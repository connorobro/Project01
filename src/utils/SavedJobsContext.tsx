import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SavedJob = {
  id: string;
  title: string;
  company?: string;
  location?: string;
  postedAt?: string;
  url?: string;
};

type SavedJobsCtx = {
  saved: SavedJob[];
  add: (job: SavedJob) => void;
  remove: (id: string) => void;
  isSaved: (id: string | number) => boolean;
};

const SavedJobsContext = createContext<SavedJobsCtx | null>(null);
const STORAGE_KEY = "SAVED_JOBS_V1";

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<SavedJob[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSaved(JSON.parse(raw));
      } catch {
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved)).catch(() => {});
  }, [saved, hydrated]);

  const api = useMemo<SavedJobsCtx>(() => {
    return {
      saved,
      add: (job) =>
        setSaved((prev) => (prev.find((j) => j.id === job.id) ? prev : [job, ...prev])),
      remove: (id) => setSaved((prev) => prev.filter((j) => j.id !== String(id))),
      isSaved: (id) => saved.some((j) => j.id === String(id)),
    };
  }, [saved, hydrated]);

  return <SavedJobsContext.Provider value={api}>{children}</SavedJobsContext.Provider>;
}

export function useSavedJobs() {
  const ctx = useContext(SavedJobsContext);
  if (!ctx) throw new Error("useSavedJobs must be used within SavedJobsProvider");
  return ctx;
}

