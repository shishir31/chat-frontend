// src/components/MessageBubble.jsx
export default function MessageBubble({ message, meId }) {
  const mine = message.senderId === meId;
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`${mine ? "bg-gradient-to-br from-sky-500 to-indigo-600 text-white" : "bg-[rgba(255,255,255,0.03)] text-slate-200"} p-3 rounded-lg max-w-[70%] shadow-sm`}>
        {message.text && <div className="whitespace-pre-wrap">{message.text}</div>}
        {message.file && (
          <div className="mt-2">
            {/* image or link preview */}
            <img src={`http://localhost:5000/${message.file}`} alt="file" className="max-w-xs rounded" />
          </div>
        )}
        <div className="text-[10px] text-white/60 mt-1 text-right">{new Date(message.createdAt).toLocaleTimeString()}</div>
      </div>
    </div>
  );
}