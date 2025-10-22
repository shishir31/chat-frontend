import { useState, useContext } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [form, setForm] = useState({ username:"", email:"", password:"" });
  const navigate = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[420px] bg-gradient-to-br from-[#07172a] to-[#051025] p-8 rounded-2xl shadow-2xl border border-white/5">
        <h2 className="text-2xl font-semibold text-white/90 mb-4">Create account</h2>
        <p className="text-sm text-slate-400 mb-6">Build fast with MERN — secure chat for two.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" onChange={handleChange} placeholder="Username" className="w-full p-3 bg-[rgba(255,255,255,0.03)] rounded-lg outline-none border border-white/5" />
          <input name="email" onChange={handleChange} placeholder="Email" className="w-full p-3 bg-[rgba(255,255,255,0.03)] rounded-lg outline-none border border-white/5" />
          <input name="password" type="password" onChange={handleChange} placeholder="Password" className="w-full p-3 bg-[rgba(255,255,255,0.03)] rounded-lg outline-none border border-white/5" />
          <button className="w-full py-3 bg-gradient-to-r from-primary to-blue-400 rounded-lg font-medium hover:scale-[1.01] transition">Sign up</button>
        </form>

        <div className="mt-4 text-sm text-slate-400">Already have an account? <a href="/login" className="text-blue-300">Login</a></div>
      </div>
    </div>
  );
}