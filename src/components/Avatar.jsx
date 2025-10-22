// src/components/Avatar.jsx
export default function Avatar({ name, size=10 }) {
  const initials = name ? name.split(" ").map(n=>n[0]).slice(0,2).join("") : "U";
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-sm font-semibold text-white`}>
      {initials}
    </div>
  );
}