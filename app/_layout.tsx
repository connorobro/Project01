import { Stack } from "expo-router";
import { SavedJobsProvider } from "../src/utils/SavedJobsContext";

export default function RootLayout() {
  return (
    <SavedJobsProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerTitle: "Index" }} />
        <Stack.Screen name="Home" options={{ headerTitle: "Home" }} />
        <Stack.Screen name="savedJobs" options={{ headerTitle: "Saved Jobs" }} />
        <Stack.Screen name="jobs" options={{ headerTitle: "Job" }} />
      </Stack>
    </SavedJobsProvider>
  );
}

