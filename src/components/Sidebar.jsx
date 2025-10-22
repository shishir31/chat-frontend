// src/components/Sidebar.jsx
import Avatar from "./Avatar";

export default function Sidebar({ users, online = [], onStartChat, onLogout, me }) {
  return (
    <div className="w-80 bg-panel p-4 border-r border-white/5 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Avatar name={me.username} />
          <div>
            <div className="font-medium">{me.username}</div>
            <div className="text-xs text-slate-400">You</div>
          </div>
        </div>
        <button onClick={onLogout} className="text-sm text-red-400 hover:underline">Logout</button>
      </div>

      <div className="mb-3 text-slate-400 text-sm">Contacts</div>
      <div className="space-y-2 overflow-y-auto pr-2">
        {users.map(u => (
          <div key={u._id} className="flex items-center justify-between p-2 rounded hover:bg-[rgba(255,255,255,0.02)] cursor-pointer" onClick={() => onStartChat(u._id)}>
            <div className="flex items-center space-x-3">
              <Avatar name={u.username} />
              <div>
                <div className="font-medium">{u.username}</div>
                <div className="text-xs text-slate-400">{u.email}</div>
              </div>
            </div>
            <div className="text-sm">
              {online.includes(u._id) ? <span className="text-green-400">●</span> : <span className="text-slate-500">●</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}