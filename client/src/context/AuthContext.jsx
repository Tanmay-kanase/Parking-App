// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../config/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/users/me");
      setUser(res.data);
      console.log("Response from fetched user", res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    console.log("credentials : ", credentials);
    await axios.post("/api/users/login", credentials);
    await fetchUser();
  };

  const signup = async (userData) => {
    await axios.post("/api/users/signup", userData);
    await fetchUser();
  };

  const logout = async () => {
    await axios.post("/api/users/logout", {}, { withCredentials: true });

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, signup, fetchUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
