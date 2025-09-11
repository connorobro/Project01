import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthProvider";
import { SavedJobsProvider } from "../src/utils/SavedJobsContext";

export default function RootLayout() {
  // Always render a navigator (Stack) on initial render
  return (
    <AuthProvider>
      <SavedJobsProvider>
        <Stack />
      </SavedJobsProvider>
    </AuthProvider>
  );
}
