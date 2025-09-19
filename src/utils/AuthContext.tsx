import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthCtx = {
  currentUserId: string | null;
  hydrated: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
};

const STORAGE_KEY = "CURRENT_USER_ID_V1";
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const id = await AsyncStorage.getItem(STORAGE_KEY);
        if (id) setCurrentUserId(id);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const login = async (userId: string) => {
    setCurrentUserId(userId);
    await AsyncStorage.setItem(STORAGE_KEY, userId);
  };

  const logout = async () => {
    setCurrentUserId(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthCtx>(() => ({ currentUserId, hydrated, login, logout }), [currentUserId, hydrated]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
