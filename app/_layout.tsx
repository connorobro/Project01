// app/_layout.tsx
import { Redirect, Stack, useSegments } from "expo-router";
import React from "react";

// ✅ use the AuthProvider we implemented for per-user saved jobs
import { AuthProvider, useAuth } from "../src/utils/AuthContext";
// ✅ SavedJobsProvider that keys storage by current user
import { SavedJobsProvider } from "../src/utils/SavedJobsContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SavedJobsProvider>
        <AuthGate>
          <Stack>
            <Stack.Screen name="index" options={{ headerTitle: "Index" }} />
            <Stack.Screen name="Home" options={{ headerTitle: "Home" }} />
            <Stack.Screen name="jobs" options={{ headerTitle: "Jobs" }} />
            <Stack.Screen name="savedJobs" options={{ headerTitle: "Saved Jobs" }} />
            <Stack.Screen name="Login" options={{ headerTitle: "Login" }} />
            <Stack.Screen name="Register" options={{ headerTitle: "Register" }} />
            <Stack.Screen name="debug" options={{ headerTitle: "Debug" }} />
          </Stack>
        </AuthGate>
      </SavedJobsProvider>
    </AuthProvider>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { currentUserId, hydrated } = useAuth();
  const segments = useSegments();

  // Public routes (adjust to your actual file names if needed)
  const publicSegments = ["", "index", "login", "register", "debug"];

  const seg = segments[0] ? String(segments[0]).toLowerCase() : "";
  const shouldRedirect = hydrated && !publicSegments.includes(seg) && !currentUserId;

  // Wait for hydration so we don't redirect before we know the auth state
  if (!hydrated) return null;

  if (shouldRedirect) {
    return <Redirect href="/Login" />;
  }

  return <>{children}</>;
}

