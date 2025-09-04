import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Index" }} />
      <Stack.Screen name="Home" options={{ headerTitle: "Home" }} />
    </Stack>
  );
}
