// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Restore user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Use Effect called for user auth");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
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
    setUser(JSON.stringify(res.data.user));
  };

  const signup = async (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
