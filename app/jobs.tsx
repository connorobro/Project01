import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSavedJobs } from "../src/utils/SavedJobsContext";
import { AdzunaJob, searchJobs } from "../src/utils/adzuna";

const PALETTE = {
  bg: "#FFFFFF",
  text: "#00171F",
  subtext: "#4B5563",
  primary: "#00A7E1",
  teal: "#007EA7",
  cardBorder: "#DCE8F2",
  muted: "#6B7280",
  chipBg: "#E6F7FD",
};

type JobCard = {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAt?: string;
  url?: string;
};

async function openJobUrl(url?: string) {
  if (!url) return;
  try {
    const can = await Linking.canOpenURL(url);
    if (can) await Linking.openURL(url);
  } catch {}
}

export default function JobsScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const query = (Array.isArray(q) ? q[0] : q) || "software";

  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { add, remove, isSaved } = useSavedJobs();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const results: AdzunaJob[] = await searchJobs(query, 1);
        const mapped: JobCard[] = results.map((j) => ({
          id: String(j.id),
          title: j.title,
          company: j.company?.display_name ?? "Unknown",
          location: j.location?.display_name ?? "Unknown",
          postedAt: j.created,
          url: j.redirect_url,
        }));
        setJobs(mapped);
      } catch (e) {
        console.log("API error:", e);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.wrap}>
        {/* Top bar */}
        <View style={s.topRow}>
          <Text style={s.h1}>Job Listings</Text>
          <Pressable style={s.pill} onPress={() => router.push("/savedJobs")}>
            <Text style={s.pillText}>Saved Jobs</Text>
          </Pressable>
        </View>

        <View style={{ height: 12 }} />

        {/* Query chip */}
        <View style={s.chipRow}>
          <View style={s.chip}>
            <Text style={s.chipText}>Category: {query}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
          {loading && <Text style={s.muted}>Loading…</Text>}

          {jobs.map((item) => {
            const saved = isSaved(item.id);
            return (
              <View key={item.id} style={s.card}>
                <Text style={s.title}>{item.title}</Text>
                <Text style={s.sub}>
                  {item.company} • {item.location}
                </Text>

                <View style={s.actionsRow}>
                  <TouchableOpacity
                    onPress={() => openJobUrl(item.url)}
                    disabled={!item.url}
                    style={[s.linkBtn, !item.url && { opacity: 0.4 }]}
                  >
                    <Text style={s.linkBtnText}>
                      {item.url ? "Apply" : "No link"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={s.posted}>
                  Posted: {item.postedAt ? item.postedAt.slice(0, 10) : "—"}
                </Text>

                {/* Heart LAST so it stacks on top and is fully clickable */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={saved ? "Unsave job" : "Save job"}
                  onPress={() =>
                    saved
                      ? remove(item.id)
                      : add({
                          id: item.id,
                          title: item.title,
                          company: item.company,
                          location: item.location,
                          url: item.url,
                          postedAt: item.postedAt,
                        })
                  }
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  style={s.heartBtn}
                  testID={`heart-${item.id}`}
                >
                  <Ionicons
                    name={saved ? "heart" : "heart-outline"}
                    size={22}
                    color={saved ? "#e11d48" : "#9CA3AF"}
                  />
                </Pressable>
              </View>
            );
          })}

          {!loading && jobs.length === 0 && (
            <Text style={s.muted}>No results.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PALETTE.bg },
  wrap: { flex: 1, padding: 16 },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  h1: { fontSize: 22, fontWeight: "800", color: PALETTE.text },

  pill: {
    backgroundColor: PALETTE.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pillText: { color: "#fff", fontWeight: "700" },

  chipRow: { flexDirection: "row", gap: 8, marginTop: 6, marginBottom: 10 },
  chip: {
    backgroundColor: PALETTE.chipBg,
    borderColor: PALETTE.primary,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: { color: PALETTE.teal, fontWeight: "600" },

  card: {
    position: "relative", 
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    paddingTop: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: PALETTE.text,
    paddingRight: 48, 
  },
  sub: { marginTop: 2, color: PALETTE.subtext, paddingRight: 48 },

  actionsRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  linkBtn: {
    backgroundColor: PALETTE.teal,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  linkBtnText: { color: "#fff", fontWeight: "700" },

  posted: { marginTop: 10, color: PALETTE.muted, textAlign: "right" },
  muted: { color: PALETTE.muted, marginTop: 8 },
});

