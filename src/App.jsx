import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App(){
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;