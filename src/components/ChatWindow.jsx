import { useEffect, useRef, useState } from "react";
import { API } from "../api";
import MessageInput from "./MessageInput";
import { socket } from "../socket";

export default function ChatWindow({ chat, me }) {
  const [messages, setMessages] = useState([]);
  const [typingState, setTypingState] = useState(false);
  const bottomRef = useRef();

  const chatName = chat?.participants?.find(p => p._id !== me.userId)?.username || "Chat";

  useEffect(() => {
    if (!chat?._id) return;

    const loadMessages = async () => {
      try {
        const res = await API.get(`/messages/${chat._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadMessages();

    socket.emit("joinChat", chat._id);

    const handleReceive = (msg) => {
      if (msg.chatId === chat._id) setMessages(prev => [...prev, msg]);
    };

    const handleTyping = ({ chatId, senderId }) => {
      if (chatId === chat._id && senderId !== me.userId) {
        setTypingState(true);
        setTimeout(() => setTypingState(false), 1200);
      }
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("typing", handleTyping);
    };
  }, [chat._id]);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, typingState]);

  const handleSend = async ({ text, filePath }) => {
    if (!text.trim() && !filePath) return;

    try {
      const res = await API.post("/messages", { chatId: chat._id, text, file: filePath });
      socket.emit("sendMessage", { ...res.data, chatId: chat._id });
    } catch (err) {
      console.error(err);
    }
  };

  if (!chat) return <div className="h-full flex items-center justify-center text-slate-400">Select a user</div>;

  return (
    <div className="h-full flex flex-col bg-[rgba(255,255,255,0.02)] rounded-xl shadow-inner">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-semibold">
            {chatName.slice(0,2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">{chatName}</div>
            <div className="text-xs text-slate-400">{typingState ? "Typing..." : "Active"}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
        {messages.map((m) => {
          const isMe = m.sender._id === me.userId;
          return (
            <div
              key={m._id || m.createdAt}
              className={`max-w-[70%] p-3 rounded-xl break-words ${
                isMe ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
              }`}
            >
              {!isMe && <div className="text-xs font-semibold">{m.sender.username}</div>}
              <div>{m.text}</div>
              {m.file && <img src={m.file} alt="file" className="mt-1 max-h-40 rounded" />}
              <div className="text-xs text-right mt-1 opacity-70">
                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 py-4 border-t border-white/5">
        <MessageInput onSend={handleSend} chatId={chat._id} />
      </div>
    </div>
  );
}