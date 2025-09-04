import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="Launch">
      <Stack.Screen name="Launch" options={{ headerTitle: "Launch" }} />
      <Stack.Screen name="index" options={{ headerTitle: "Index" }} />
      <Stack.Screen name="Home" options={{ headerTitle: "Home" }} />
      <Stack.Screen name="savedJobs" options={{ headerTitle: "Saved Jobs" }} />
      <Stack.Screen name="jobs" options={{ headerTitle: "Job" }} />
    </Stack>
  );
}