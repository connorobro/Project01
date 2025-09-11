const APP_ID = process.env.EXPO_PUBLIC_ADZUNA_APP_ID;
const API_KEY = process.env.EXPO_PUBLIC_ADZUNA_API_KEY;
const BASE = "https://api.adzuna.com/v1/api/jobs/us";

// Type for the job object returned by Adzuna (only the fields we use)
export type AdzunaJob = {
  id: string;
  title: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  created?: string;
  redirect_url?: string;
};

export async function searchJobs(query = "software", page = 1) {
  const url =
    `${BASE}/search/${page}?` +
    `app_id=${APP_ID}&app_key=${API_KEY}` +
    `&what=${encodeURIComponent(query)}` +
    `&results_per_page=5&content-type=application/json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Adzuna search failed: ${res.status}`);
  const data = await res.json();
  return (data?.results ?? []) as AdzunaJob[];
}