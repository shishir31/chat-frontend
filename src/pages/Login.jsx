import { useState, useContext } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login(){
  const [form, setForm] = useState({ email:"", password:"" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      // backend returns { token, userId, username } as we designed earlier
      const userData = {
        token: res.data.token,
        userId: res.data.userId,
        username: res.data.username,
      };
      login(userData);
      navigate("/chat");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[420px] bg-gradient-to-br from-[#07172a] to-[#051025] p-8 rounded-2xl shadow-2xl border border-white/5">
        <h2 className="text-2xl font-semibold text-white/90 mb-4">Welcome back</h2>
        <p className="text-sm text-slate-400 mb-6">Sign in to continue chatting.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" onChange={handleChange} placeholder="Email" className="w-full p-3 bg-[rgba(255,255,255,0.03)] rounded-lg outline-none border border-white/5" />
          <input name="password" type="password" onChange={handleChange} placeholder="Password" className="w-full p-3 bg-[rgba(255,255,255,0.03)] rounded-lg outline-none border border-white/5" />
          <button className="w-full py-3 bg-gradient-to-r from-primary to-blue-400 rounded-lg font-medium hover:scale-[1.01] transition">Login</button>
        </form>

        <div className="mt-4 text-sm text-slate-400">No account? <a href="/register" className="text-blue-300">Sign up</a></div>
      </div>
    </div>
  );
}