import React, { useState, useEffect } from "react";
import stompClient from "./websocket/websocket";
import ChatRoom from "./components/ChatRoom";
import ChatInput from "./components/ChatInput";
import GroupSelection from "./components/GroupSelection";
import { BACKEND_URL } from "./config";

const App = () => {
  const [username, setUsername] = useState("");
  const [group, setGroup] = useState("general");
  const [availableGroups, setAvailableGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [isBELoaded, setIsBELoaded] = useState(false);

  // Manage Groups
  useEffect(() => {
    let retries = 10;

    const loadChannels = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/chat/channels`, { mode: "cors" });
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        setIsBELoaded(true);
        setAvailableGroups(data);
      } catch (err) {
        console.warn(`❌ Failed to load channels (${retries} retries left)...`);
        if (retries > 0) {
          retries--;
          setTimeout(loadChannels, 1000);
        } else {
          console.error("🚫 Could not connect to backend after multiple attempts.");
        }
      }
    };

    // Auto join
    const autoJoinChannel = () => {
      const savedUsername = localStorage.getItem("chat-username");
      if (savedUsername) {
        setUsername(savedUsername);
        setJoined(true);
      }
    };

    autoJoinChannel()
    loadChannels();
  }, []);

  useEffect(() => {
    if (!joined) return;

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [joined, username, group]);

  const handleUnload = () => {
    if (stompClient.connected) {
      const leaveMsg = {
        sender: "System",
        content: `👋 <strong>${username}</strong> has left the chat.`,
        groupName: group,
        system: true,
        timestamp: new Date().toISOString(),
      };

      stompClient.publish({
        destination: "/app/send",
        body: JSON.stringify(leaveMsg),
      });

      stompClient.deactivate();
    }
  };



  // Manage STOMP connection when 'joined' or 'group' changes
  useEffect(() => {
    if (!joined) return;

    const connectAndFetch = async () => {
      // 📨 Fetch chat history
      try {
        const response = await fetch(`${BACKEND_URL}/chat/history?groupName=${group}`);
        const data = await response.json();

        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }

      console.log("Attempting to connect STOMP...");
      stompClient.onConnect = () => {
        console.log("✅ Connected to STOMP server.");
        stompClient.subscribe(`/topic/${group}`, (msg) => {
          try {
            const parsedMsg = JSON.parse(msg.body);
            console.log("📩 Received Message:", parsedMsg);
            setMessages((prev) => [...prev, parsedMsg]);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });

        // Send Welcome Message to Kafka
        const welcomeMsg = `👋 <strong>${username}</strong> has joined the chat!`;
        sendMessage(welcomeMsg, true);
      };

      stompClient.onStompError = (frame) => {
        console.error("❌ STOMP Error:", frame);
      };

      stompClient.onWebSocketError = (error) => {
        console.error("❌ WebSocket Error:", error);
      };

      stompClient.activate();
    };

    connectAndFetch();

    // Cleanup
    return () => {
      if (stompClient.connected) {
        stompClient.deactivate().then(() =>
            console.log("🔄 STOMP client deactivated (cleanup).")
        );
      }
    };
  }, [joined, group]);

  const handleGroupChange = (newGroup) => {
    if (joined && stompClient.connected && group !== newGroup) {
      const leaveMsg = `👋 <strong>${username}</strong> has left the chat.`;
      sendMessage(leaveMsg, true);
    }

    setGroup(newGroup);
  };

  // Join the chat room
  const joinChat = () => {
    console.log("➡ Sending join request...");
    fetch(`${BACKEND_URL}/chat/join?username=` + encodeURIComponent(username), {
      method: "POST",
      mode: "cors",
    })
        .then((res) => res.text())
        .then((data) => {
          console.log("Join response:", data);
          if (data === "true") {
            localStorage.setItem("chat-username", username);
            setJoined(true);
            console.log("✅ User joined chat!");
          } else {
            alert("Username already exists!");
          }
        })
        .catch((error) => console.error("Fetch error:", error));
  };

  // Send a message
  const sendMessage = (message, isSystem = false) => {
    if (!stompClient.connected) {
      console.error("❌ STOMP client is not connected yet.");
      return;
    }
    const chatMessage = !isSystem ? { sender: username, content: message, groupName: group } : { sender: "System", content: message, groupName: group, system: isSystem};
    console.log("Sending message:", chatMessage);
    stompClient.publish({
      destination: "/app/send",
      body: JSON.stringify(chatMessage),
    });
  };

  return (
      <div className="min-h-screen backdrop-blur-md flex items-center justify-center p-4" style={{ backgroundImage: "url('/chat-bg.jpg')" }}>
        {!isBELoaded ? (
            <div className="text-center text-white text-xl animate-pulse">⚙️ Loading backend...</div>
        ) : (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
          {!joined ? (
              <form
                  className="space-y-5 text-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!username.trim()) {
                      alert("Please enter a valid username.");
                      return;
                    }
                    joinChat();
                  }}
              >
                <h2 className="text-2xl font-semibold text-gray-800">👋 Welcome to the Chat</h2>
                <input
                    autoFocus
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Your name..."
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-neutral-900 text-white py-2 rounded-md hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  Join Chat
                </button>
              </form>
          ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">👋 Hi, {username}!</h2>

                  <div className="relative group inline-block">
                    {/* Hitbox area */}
                    <div className="p-2 rounded-full cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 text-white flex items-center justify-center font-semibold">
                        {username.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Dropdown */}
                    <div className="absolute right-0 w-40 bg-white shadow-md rounded-md text-sm opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50">
                      <div className="px-4 py-2 border-b text-gray-700 font-medium">{username}</div>
                      <button
                          onClick={async () => {
                            handleUnload();
                            await fetch(`${BACKEND_URL}/chat/logout?username=${username}`, {
                              method: "POST",
                              mode: "cors",
                            });

                            localStorage.removeItem("chat-username");
                            setUsername("");
                            setJoined(false);
                            setMessages([]);
                            stompClient.deactivate();
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-neutral-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>

                <GroupSelection
                    availableGroups={availableGroups}
                    selectedGroup={group}
                    setGroup={handleGroupChange}
                />
                <ChatRoom
                    group={group}
                    messages={messages}
                    username={username}
                    latestSender={messages[messages.length - 1]?.sender}
                />
                <ChatInput sendMessage={sendMessage} />
              </div>
          )}
        </div>)}
      </div>
  );
};

export default App;
