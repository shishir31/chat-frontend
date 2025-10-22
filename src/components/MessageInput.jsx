// src/components/MessageInput.jsx
import { useRef, useState } from "react";
import { API } from "../api";
import { socket } from "../socket";

export default function MessageInput({ onSend, chatId }) {
  const [text, setText] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // preview
    setFilePreview(URL.createObjectURL(file));
    // upload
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await API.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      // API returns { filePath }
      const filePath = res.data.filePath;
      // keep filePath (we send on submit)
      setFilePreview(filePath); // store server path
    } catch (err) {
      console.error("Upload error", err);
      alert("Upload failed");
    }
  };

  const send = () => {
    if (!text.trim() && !filePreview) return;
    onSend({ text: text.trim(), filePath: filePreview });
    setText("");
    setFilePreview(null);
  };

  const handleKey = () => {
    socket.emit("typing", { chatId, senderId: JSON.parse(localStorage.getItem("user")).userId });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <input ref={inputRef} value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={handleKey} placeholder="Write a message..." className="w-full p-3 rounded-lg bg-[rgba(255,255,255,0.02)] outline-none" />
        {filePreview && (
          <div className="mt-2">
            {/* if preview is server path, show from server; else local blob */}
            <img src={filePreview.startsWith("uploads/") ? `http://localhost:5000/${filePreview}` : filePreview} className="w-36 rounded" alt="preview" />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <label className="p-2 bg-[rgba(255,255,255,0.03)] rounded cursor-pointer">
          <input type="file" className="hidden" onChange={handleFile} />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" viewBox="0 0 20 20" fill="currentColor"><path d="M15.172 7l-4.95 4.95a3 3 0 11-4.243-4.243L11.343 2"/> <path d="M3 10a7 7 0 1014 0 7 7 0 00-14 0z"/></svg>
        </label>
        <button onClick={send} className="px-4 py-2 bg-gradient-to-r from-primary to-blue-400 rounded-lg">Send</button>
      </div>
    </div>
  );
}