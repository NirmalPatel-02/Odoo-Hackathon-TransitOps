import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest } from "../api/endpoints/auth";
import { AUTH_STORAGE_KEY } from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // True while we're checking sessionStorage on first load, so routes don't
  // flash-redirect to /login before we've had a chance to read a saved session.
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      setUser(saved.user);
      setToken(saved.token);
    }
    setInitializing(false);
  }, []);

  const persist = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    sessionStorage.setItem(
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
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
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