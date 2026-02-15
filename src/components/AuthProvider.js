"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated, getUser, logout as doLogout } from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setUser(isAuthenticated() ? getUser() : null);
    setChecked(true);
  }, []);

  function login(userData) {
    setUser(userData);
  }

  function logout() {
    doLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, checked, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
