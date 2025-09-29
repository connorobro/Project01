import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthProvider";

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

const keyForV4 = (userId: string | null) => `SAVED_JOBS_V4_${userId ?? "GUEST"}`;
const keyForV3 = (username: string | null) => `SAVED_JOBS_V3_${username ?? "GUEST"}`;

async function migrateV3toV4(userId: string | null): Promise<void> {
  try {
    const rawCurrent = await AsyncStorage.getItem("currentUser"); // set by Register/Login
    const parsed = rawCurrent ? JSON.parse(rawCurrent) : null;

    const username = parsed?.username ?? (await AsyncStorage.getItem("username"));
    const oldKey = keyForV3(typeof username === "string" ? username : null);
    const newKey = keyForV4(userId);

    if (!newKey) return;

    const [newVal, oldVal] = await Promise.all([
      AsyncStorage.getItem(newKey),
      AsyncStorage.getItem(oldKey),
    ]);

    if (!newVal && oldVal) {
      await AsyncStorage.setItem(newKey, oldVal);  
      await AsyncStorage.removeItem(oldKey);       
    }
  } catch {}
}

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const { userId, username } = useAuth(); // userId now provided by AuthProvider
  const [identity, setIdentity] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedJob[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const id = userId ?? null;
      if (!cancelled) setIdentity(id);
      await migrateV3toV4(id);
    })();
    return () => { cancelled = true; };
  }, [userId, username]);

  useEffect(() => {
    const key = keyForV4(identity);
    let cancelled = false;
    (async () => {
      loadingRef.current = true;
      try {
        const raw = await AsyncStorage.getItem(key);
        if (!cancelled) {
          setSaved(raw ? JSON.parse(raw) : []);
          setLoadedKey(key);
        }
      } finally {
        loadingRef.current = false;
      }
    })();
    return () => { cancelled = true; };
  }, [identity]);

  useEffect(() => {
    if (!loadedKey || loadingRef.current) return;
    AsyncStorage.setItem(loadedKey, JSON.stringify(saved)).catch(() => {});
  }, [saved, loadedKey]);

  const api = useMemo<Ctx>(
    () => ({
      saved,
      add: (job) =>
        setSaved((prev) => (prev.some((j) => j.id === job.id) ? prev : [job, ...prev])),
      remove: (id) => setSaved((prev) => prev.filter((j) => j.id !== id)),
      isSaved: (id) => saved.some((j) => j.id === id),
      clearInMemory: () => setSaved([]),
    }),
    [saved]
  );

  return <C.Provider value={api}>{children}</C.Provider>;
}

export function useSavedJobs() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useSavedJobs must be used inside SavedJobsProvider");
  return ctx;
}
