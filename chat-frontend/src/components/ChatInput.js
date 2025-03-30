import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";

const ChatInput = ({ sendMessage }) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim() !== "") {
            sendMessage(message);
            setMessage("");
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSend();
            }}
            className="relative"
        >
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-neutral-700 transition"
            >
                <IoMdSend className="text-2xl" />
            </button>
        </form>
    );
};

export default ChatInput;
