import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Linking, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSavedJobs } from "../src/utils/SavedJobsContext";

async function openJobUrl(url?: string) {
  if (!url) return;
  try {
    const can = await Linking.canOpenURL(url);
    if (can) await Linking.openURL(url);
  } catch {
  }
}

export default function SavedJobsScreen() {
  const { saved, remove } = useSavedJobs();
  const router = useRouter();

  const renderItem = useCallback(
    ({ item }: any) => (
      <View
        style={{
          marginHorizontal: 16,
          marginVertical: 8,
          padding: 12,
          borderWidth: 1,
          borderRadius: 10,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
        {!!item.company && <Text>{item.company}</Text>}
        {!!item.location && <Text>{item.location}</Text>}

        <View style={{ flexDirection: "row", gap: 16, marginTop: 10 }}>
          {item.url ? (
            <Pressable onPress={() => openJobUrl(item.url)}>
              <Text style={{ color: "#0ea5a4", textDecorationLine: "underline" }}>
                View Job Posting
              </Text>
            </Pressable>
          ) : (
            <Text style={{ opacity: 0.6 }}>No direct link</Text>
          )}

          <TouchableOpacity
            onPress={() => remove(item.id)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderWidth: 1,
              borderRadius: 8,
              marginLeft: "auto",
            }}
          >
            <Text>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [remove]
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={{ textDecorationLine: "underline" }}>‹ Back</Text>
        </Pressable>
        <Text style={{ marginLeft: 12, fontSize: 18, fontWeight: "600" }}>
          Saved Jobs
        </Text>
      </View>

      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 24 }}>No saved jobs yet.</Text>
        }
        renderItem={renderItem}
      />
    </View>
  );
}

