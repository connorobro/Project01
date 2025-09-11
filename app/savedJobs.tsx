import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { useContext } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "../context/AuthProvider";

export default function SavedJobs() {
  const { userToken } = useContext(AuthContext);
  const router = useRouter();

  React.useEffect(() => {
    if (!userToken) {
      router.replace("/Login");
    }
  }, [userToken, router]);

  return (
    <View style={{ flex: 1, backgroundColor: "#111827", padding: 16 }}>
      <Stack.Screen options={{ title: "Saved Jobs" }} />

      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "800",
          marginBottom: 12,
        }}
      >
        Saved Jobs
      </Text>

      {/* simple placeholders for now */}
      <View
        style={{
          backgroundColor: "#1f2937",
          borderRadius: 12,
          padding: 14,
          borderWidth: 1,
          borderColor: "#374151",
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>
          Saved Job (placeholder)
        </Text>
        <Text style={{ color: "#cbd5e1", marginTop: 4 }}>
          Company • Location
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#1f2937",
          borderRadius: 12,
          padding: 14,
          borderWidth: 1,
          borderColor: "#374151",
        }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>
          Saved Job (placeholder)
        </Text>
        <Text style={{ color: "#cbd5e1", marginTop: 4 }}>
          Company • Location
        </Text>
      </View>
    </View>
  );
}
