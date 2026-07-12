import { createContext, useContext, useState } from "react";
import { loginRequest, registerRequest } from "../api/endpoints/auth";
import { AUTH_STORAGE_KEY } from "../api/axiosClient";

const AuthContext = createContext(null);

function readStoredSession() {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  try {
    const raw = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { user: null, token: null };

    const saved = JSON.parse(raw);
    return {
      user: saved?.user ?? null,
      token: saved?.token ?? null,
    };
  } catch {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const savedSession = readStoredSession();
  const [user, setUser] = useState(savedSession.user);
  const [token, setToken] = useState(savedSession.token);
  const initializing = false;

  const persist = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    window.sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user: nextUser, token: nextToken })
    );
  };

  const login = async (email, password) => {
    const { data } = await loginRequest(email, password);
    persist(data.user, data.access_token);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await registerRequest(payload);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  };

  const value = {
    user,
    token,
    initializing,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}