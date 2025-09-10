import React, { createContext, useContext, useMemo, useState } from "react";

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
};

const SavedJobsContext = createContext<Ctx | null>(null);

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<SavedJob[]>([]);

  const api = useMemo<Ctx>(() => ({
    saved,
    add: (job) =>
      setSaved((prev) => (prev.find((j) => j.id === job.id) ? prev : [job, ...prev])),
    remove: (id) => setSaved((prev) => prev.filter((j) => j.id !== id)),
    isSaved: (id) => saved.some((j) => j.id === id),
  }), [saved]);

  return <SavedJobsContext.Provider value={api}>{children}</SavedJobsContext.Provider>;
}

export function useSavedJobs() {
  const ctx = useContext(SavedJobsContext);
  if (!ctx) throw new Error("useSavedJobs must be used inside SavedJobsProvider");
  return ctx;
}
