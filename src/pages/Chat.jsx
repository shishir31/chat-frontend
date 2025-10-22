// src/pages/Chat.jsx
import { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { API } from "../api";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../socket";

export default function Chat(){
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [online, setOnline] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // chat object { _id, participants... }

  useEffect(() => {
    // fetch users (protected route)
    async function loadUsers(){
      try {
        const res = await API.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadUsers();

    // socket listeners
    socket.on("getOnlineUsers", setOnline);
    return () => {
      socket.off("getOnlineUsers");
    };
  }, []);

  // create or get 1-1 chat with clicked user
  const openChatWith = async (otherUserId) => {
    try {
      const res = await API.post("/chats", { userId: otherUserId });
      setActiveChat(res.data);
      // join socket room
      socket.emit("joinChat", res.data._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar users={users} online={online} onStartChat={openChatWith} onLogout={logout} me={user} />
      <div className="flex-1 bg-[linear-gradient(180deg,#071127,#07172a)] p-6">
        {activeChat ? (
          <ChatWindow chat={activeChat} me={user} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            Select a user to start chat
          </div>
        )}
      </div>
    </div>
  );
}