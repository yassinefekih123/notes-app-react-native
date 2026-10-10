import React, { createContext, useContext, useEffect, useState } from "react";
import { account, ID } from "./appwrite";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app start, check if a session already exists
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const current = await account.get();
      setUser(current);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    await account.createEmailPasswordSession({ email, password });
    const current = await account.get();
    setUser(current);
  };

  const register = async (name, email, password) => {
    await account.create({ userId: ID.unique(), email, password, name });
    await login(email, password);
  };

  const logout = async () => {
    await account.deleteSession({ sessionId: "current" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);