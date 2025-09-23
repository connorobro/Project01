import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  FlatList,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSavedJobs } from "../src/utils/SavedJobsContext";

const PALETTE = {
  bg: "#FFFFFF",
  text: "#00171F",
  subtext: "#4B5563",
  primary: "#00A7E1",
  navy: "#003459",
  danger: "#B00020",
  cardBorder: "#DCE8F2",
};

async function openJobUrl(url?: string) {
  if (!url) return;
  try {
    const can = await Linking.canOpenURL(url);
    if (can) await Linking.openURL(url);
  } catch {}
}

export default function SavedJobsScreen() {
  const { saved, remove } = useSavedJobs();
  const router = useRouter();

  const renderItem = useCallback(
    ({ item }: any) => (
      <View style={s.card}>
        <Text style={s.title}>{item.title}</Text>
        {!!item.company && <Text style={s.sub}>{item.company}</Text>}
        {!!item.location && <Text style={s.sub}>{item.location}</Text>}

        <View style={s.actionsRow}>
          {item.url ? (
            <Pressable onPress={() => openJobUrl(item.url)} style={s.linkBtn}>
              <Text style={s.linkBtnText}>View Posting</Text>
            </Pressable>
          ) : (
            <Text style={[s.sub, { opacity: 0.7 }]}>No direct link</Text>
          )}

          <TouchableOpacity onPress={() => remove(item.id)} style={s.removeBtn}>
            <Text style={s.removeBtnText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [remove]
  );

  return (
    <SafeAreaView style={s.screen}>
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={saved}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={[s.sub, { textAlign: "center", marginTop: 24 }]}>
            No saved jobs yet.
          </Text>
        }
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PALETTE.bg },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: PALETTE.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { color: PALETTE.primary, fontWeight: "700" },
  h1: { fontSize: 18, fontWeight: "800", color: PALETTE.text },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  title: { fontSize: 16, fontWeight: "700", color: PALETTE.text },
  sub: { marginTop: 2, color: PALETTE.subtext },

  actionsRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  linkBtn: {
    backgroundColor: PALETTE.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  linkBtnText: { color: "#fff", fontWeight: "700" },

  removeBtn: {
    marginLeft: "auto",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    backgroundColor: "#FFF5F6",
  },
  removeBtnText: { color: PALETTE.danger, fontWeight: "600" },
});


