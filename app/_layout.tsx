import { Redirect, Stack, useSegments } from "expo-router";
import React from "react";
import { AuthContext, AuthProvider } from "../context/AuthProvider";
import { SavedJobsProvider } from "../src/utils/SavedJobsContext";

export default function RootLayout() {
  // Client-side redirect for protected routes when the user is not authenticated.
  return (
    <AuthProvider>
      <SavedJobsProvider>
        <AuthGate>
          <Stack>
            <Stack.Screen name="index" options={{ headerTitle: "Index" }} />
            <Stack.Screen 
              name="Home" />
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
  const { userToken, isLoading } = React.useContext(AuthContext);
  const segments = useSegments();

  // Define public top-level segments; everything else will be protected by default.
  const publicSegments = ["login", "register", "debug"];

  // Debug logging
  console.log("AuthGate - segments:", segments);
  console.log("AuthGate - userToken:", !!userToken);
  console.log("AuthGate - isLoading:", isLoading);

  // Wait for loading to complete before making redirect decisions
  if (isLoading) {
    console.log("AuthGate - Still loading, showing children");
    return <>{children}</>;
  }

  // Check if we're on a route that should always be accessible
  // The root route appears as an empty segments array in the logs
  if ((segments as string[]).length === 0) {
    console.log("AuthGate - Root route (empty segments), allowing access");
    return <>{children}</>;
  }

  // Get the first segment and convert to lowercase for comparison
  const seg = segments[0].toLowerCase();
  console.log("AuthGate - seg:", seg);

  // Special case: if someone navigates directly to index, allow it
  if (seg === "index") {
    console.log("AuthGate - Index route, allowing access");
    return <>{children}</>;
  }

  // Check if current route is public
  const isPublicRoute = publicSegments.includes(seg);
  
  // Only redirect to Login if user is not authenticated and route is not public
  if (!userToken && !isPublicRoute) {
    console.log("AuthGate - User not authenticated and route not public, redirecting to Login");
    return <Redirect href="/Login" />;
  }

  console.log("AuthGate - All checks passed, allowing access");
  return <>{children}</>;
}
