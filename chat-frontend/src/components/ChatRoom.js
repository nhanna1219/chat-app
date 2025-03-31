import React, {useRef, useEffect} from "react";
import {FaComments, FaBasketballBall, FaGamepad, FaMusic} from "react-icons/fa";

const ChatRoom = ({group, messages, username, latestSender}) => {
    const groupMeta = {
        general: {icon: <FaComments/>, color: "#6B7280"},
        sports: {icon: <FaBasketballBall/>, color: "#F97316"},
        gaming: {icon: <FaGamepad/>, color: "#8B5CF6"},
        music: {icon: <FaMusic/>, color: "#3B82F6"},
    };
    const current = groupMeta[group] || {};
    const bottomRef = useRef(null);

    useEffect(() => {
        const lastMessage = messages[messages.length - 1]?.content;
        if (
            latestSender === username ||
            (latestSender === 'System' && lastMessage?.includes?.(username))
        ) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, latestSender, username, group]);
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xl" style={{color: current.color}}>{current.icon}</span>
                <h3 className="text-lg font-semibold tracking-wide" style={{color: current.color}}>
                    Group: {group.charAt(0).toUpperCase() + group.slice(1)}
                </h3>
            </div>
            <ul className="space-y-2 max-h-72 overflow-y-auto shadow-inner rounded-md p-4 bg-neutral-100 scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-transparent scrollbar-thumb-rounded hover:scrollbar-thumb-neutral-500">
                {messages.map((msg, index) => (
                    <li key={index} className="flex flex-col text-sm">
                        {msg.system ? (
                            <span className="text-center text-gray-500" dangerouslySetInnerHTML={{__html: `${msg.content}`}}></span>
                        ) : (
                            <div>
                                  <span
                                      className="font-semibold"
                                      style={{
                                          color: msg.sender === username ? "#ED5540" : "#00979E",
                                      }}
                                  >
                                    {msg.sender}:{' '}
                                  </span>
                                <span className="text-neutral-800">{msg.content}</span>
                                {msg.timestamp && (
                                    <div className="text-[10px] text-gray-500">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
                <div ref={bottomRef}/>
            </ul>
        </div>
    );
};

export default ChatRoom;
