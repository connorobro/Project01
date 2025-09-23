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

const keyFor = (identity: string | null) => `SAVED_JOBS_V3_${identity ?? "GUEST"}`;

async function resolveIdentity(usernameFromAuth: string | null): Promise<string | null> {
  if (usernameFromAuth) return usernameFromAuth; // preferred: from AuthProvider
  // fallback: what Login/Register already save
  try {
    const raw = await AsyncStorage.getItem("currentUser");
    if (raw) {
      const u = JSON.parse(raw);
      return String(u?.username ?? u?.id ?? "");
    }
  } catch {}
  return null;
}

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const { username } = useAuth(); 
  const [identity, setIdentity] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedJob[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const loadingRef = useRef(false);

  // 1) Figuring out who the user is whenever auth changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const who = await resolveIdentity(username ?? null);
      if (!cancelled) setIdentity(who && who.length ? who : null);
    })();
    return () => {
      cancelled = true;
    };
  }, [username]);

  // 2) Loading the user's saved jobs on identity change/app start
  useEffect(() => {
    const key = keyFor(identity);
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
    return () => {
      cancelled = true;
    };
  }, [identity]);

  // 3) Persisting whenever the list changes
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
