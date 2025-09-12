import ProtectedRoute from "@/src/utils/ProtectedRoute";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSavedJobs } from "../src/utils/SavedJobsContext";
import { AdzunaJob, searchJobs } from "../src/utils/adzuna";

type JobCard = {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAt?: string;
  url?: string;
};

export default function JobsScreen() {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { add, isSaved } = useSavedJobs();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // 1) calling our helper to fetch jobs from Adzuna
        const results: AdzunaJob[] = await searchJobs("junior developer", 1);
        // 2) mapping API fields into our UI shape (JobCard)
        const mapped: JobCard[] = results.map((j) => ({
          id: j.id,
          title: j.title,
          company: j.company?.display_name ?? "Unknown",
          location: j.location?.display_name ?? "Unknown",
          postedAt: j.created,
          url: j.redirect_url,
        }));
        // 3) rendering them
        setJobs(mapped);
      } catch (e) {
        console.log("API error:", e);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ProtectedRoute>
      <SafeAreaView style={s.screen}>
        <View style={s.wrap}>
          {/* Navbar */}
          <View style={s.row}>
            <Text style={s.h1}>Job Listings</Text>
            <Pressable style={s.pill} onPress={() => router.push("/savedJobs")}>
              <Text style={s.pillText}>Saved Jobs</Text>
            </Pressable>
          </View>

          {/* Search (visual only for now) */}
          <View style={s.input}>
            <Text style={s.muted}>Search (placeholder)</Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
            {loading && (
              <Text style={{ color: "#6b7280", marginBottom: 10 }}>Loading…</Text>
            )}

            {jobs.map((item) => (
              <View key={item.id} style={s.card}>
                <Text style={s.title}>{item.title}</Text>
                <Text style={s.sub}>
                  {item.company} • {item.location}
                </Text>
                <Text style={s.body}>
                  {item.url
                    ? "Tap Save to remember this posting."
                    : "Job from Adzuna."}
                </Text>

                <View style={s.cardRow}>
                  <Pressable
                    onPress={() => add(item)}
                    disabled={isSaved(item.id)}
                    style={[
                      s.btn,
                      isSaved(item.id) && { backgroundColor: "#9CA3AF" },
                    ]}
                  >
                    <Text style={s.btnText}>
                      {isSaved(item.id) ? "Saved" : "Save Job"}
                    </Text>
                  </Pressable>
                  <Text style={s.posted}>
                    Posted: {item.postedAt ? item.postedAt.slice(0, 10) : "—"}
                  </Text>
                </View>
              </View>
            ))}

            {!loading && jobs.length === 0 && (
              <Text style={{ color: "#6b7280" }}>No results.</Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f4f6f8" },
  wrap: { flex: 1, padding: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  h1: { fontSize: 22, fontWeight: "800" },
  pill: {
    backgroundColor: "#0ea5a4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pillText: { color: "#ffffff", fontWeight: "700" },
  input: {
    height: 42,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1fae5",
    paddingHorizontal: 12,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  muted: { color: "#6b7280" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d1fae5",
    borderLeftWidth: 4,
    borderLeftColor: "#2dd4bf",
  },
  title: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  sub: { marginTop: 2, color: "#6b7280" },
  body: { marginTop: 8, color: "#1f2937" },
  cardRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#0ea5a4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnText: { color: "#ffffff", fontWeight: "700" },
  posted: { color: "#6b7280", width: 96, textAlign: "right" },
});