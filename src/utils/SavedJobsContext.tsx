import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

export type SavedJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAt?: string;
  url?: string;
};

type Ctx = {
  saved: SavedJob[];
  add: (job: SavedJob) => void;
  remove: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearInMemory: () => void;
};

const C = createContext<Ctx | null>(null);
const keyFor = (userId: string | null) => `SAVED_JOBS_V2_${userId ?? "GUEST"}`;

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const { currentUserId, hydrated: authHydrated } = useAuth();
  const [saved, setSaved] = useState<SavedJob[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!authHydrated) return;
    const key = keyFor(currentUserId);
    (async () => {
      loadingRef.current = true;
      try {
        const raw = await AsyncStorage.getItem(key);
        setSaved(raw ? JSON.parse(raw) : []);
        setLoadedKey(key);
      } finally {
        loadingRef.current = false;
      }
    })();
  }, [currentUserId, authHydrated]);

  useEffect(() => {
    if (!loadedKey || loadingRef.current) return;
    AsyncStorage.setItem(loadedKey, JSON.stringify(saved)).catch(() => {});
  }, [saved, loadedKey]);

  const api = useMemo<Ctx>(() => ({
    saved,
    add: (job) =>
      setSaved((prev) => (prev.some((j) => j.id === job.id) ? prev : [job, ...prev])),
    remove: (id) => setSaved((prev) => prev.filter((j) => j.id !== id)),
    isSaved: (id) => saved.some((j) => j.id === id),
    clearInMemory: () => setSaved([]),
  }), [saved]);

  return <C.Provider value={api}>{children}</C.Provider>;
}

export function useSavedJobs() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useSavedJobs must be used inside SavedJobsProvider");
  return ctx;
}
