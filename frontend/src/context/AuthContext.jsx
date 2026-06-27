import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, setAuthToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = checking, false = anon, object = signed-in
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const token = localStorage.getItem("skillen_token");
    if (!token) {
      setUser(false);
      setLoading(false);
      return;
    }
    setAuthToken(token);
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch (e) {
      localStorage.removeItem("skillen_token");
      setAuthToken(null);
      setUser(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("skillen_token", data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("skillen_token");
    setAuthToken(null);
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
