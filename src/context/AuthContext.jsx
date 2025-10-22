// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { socket } from "../socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user?.userId) {
      // connect socket when user logs in
      socket.connect();
      socket.emit("addUser", user.userId);
    } else {
      socket.disconnect();
    }
    // cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [user]);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};