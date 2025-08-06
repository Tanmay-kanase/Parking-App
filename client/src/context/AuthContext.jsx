// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // ✅ Restore user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.log("Failed to parse user:", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    console.log("credentials : ", credentials);
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
      credentials
    );
    console.log(res);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user); // ✅ Use object here, not stringified
  };

  const signup = async (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, signup, loading, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
