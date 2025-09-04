import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function jobsScreen() {
  return (
    <SafeAreaView style={s.screen}>
      <View style={s.wrap}>
        {/* Navbar */}
        <View style={s.row}>
          <Text style={s.h1}>Job Listings</Text>
          <Pressable style={s.pill}>
            <Text style={s.pillText}>Saved Jobs</Text>
          </Pressable>
        </View>

        {/* Search (visual only) */}
        <View style={s.input}>
          <Text style={s.muted}>Search (placeholder)</Text>
        </View>

        {/* Two placeholder cards */}
        <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
          {[0, 1].map((i) => (
            <View key={i} style={s.card}>
              <Text style={s.title}>Job Title</Text>
              <Text style={s.sub}>Company • Location</Text>
              <Text style={s.body}>
                Short summary placeholder to show how the card will look.
              </Text>

              <View style={s.cardRow}>
                <Pressable style={s.btn}>
                  <Text style={s.btnText}>Save Job</Text>
                </Pressable>
                <Text style={s.posted}>Posted: —</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
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

  pagerRow: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  pagerBtn: {
    backgroundColor: "#0ea5a4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  pagerGhost: { backgroundColor: "#a7f3d0" },
  pagerBtnText: { color: "#ffffff", fontWeight: "700" },
  pageText: { fontWeight: "700", color: "#0f172a" },
});
