import ProtectedRoute from "@/src/utils/ProtectedRoute";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState, useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { useSavedJobs } from "../src/utils/SavedJobsContext";
import { AuthContext } from "../context/AuthProvider";

export default function SavedJobs() {
  const { saved = [], remove } = useSavedJobs();
  const { userToken } = useContext(AuthContext);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect unauthenticated users after mount
  useEffect(() => {
    if (isMounted && !userToken) {
      router.replace("/Login");
    }
  }, [isMounted, userToken, router]);

  return (
    <ProtectedRoute>
      <View style={{ flex: 1, backgroundColor: "#111827", padding: 16 }}>
        <Stack.Screen options={{ title: "Saved Jobs" }} />
        <Text style={{ color: "white", fontSize: 24, fontWeight: "800", marginBottom: 12 }}>
          Saved Jobs
        </Text>

        {saved.length === 0 ? (
          <>
            <CardPlaceholder />
            <CardPlaceholder />
          </>
        ) : (
          saved.map((j) => (
            <View
              key={j.id}
              style={{
                backgroundColor: "#1f2937",
                borderRadius: 12,
                padding: 14,
                borderWidth: 1,
                borderColor: "#374151",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "white", fontWeight: "800" }}>{j.title}</Text>
              <Text style={{ color: "#cbd5e1", marginTop: 4 }}>
                {j.company} • {j.location}
              </Text>
              <Pressable
                onPress={() => remove(j.id)}
                style={{
                  marginTop: 8,
                  alignSelf: "flex-start",
                  backgroundColor: "#ef4444",
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>Remove</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </ProtectedRoute>
  );
}

function CardPlaceholder() {
  return (
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
      <Text style={{ color: "white", fontWeight: "800" }}>Saved Job (placeholder)</Text>
      <Text style={{ color: "#cbd5e1", marginTop: 4 }}>Company • Location</Text>
    </View>
  );
}