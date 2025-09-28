import { Redirect, Stack, useSegments } from "expo-router";
import React from "react";
import { AuthContext, AuthProvider } from "../context/AuthProvider";
import { SavedJobsProvider } from "../src/utils/SavedJobsContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SavedJobsProvider>
        <AuthGate>
          <Stack>
            <Stack.Screen name="index" options={{ headerTitle: "Welcome" }} />
            <Stack.Screen name="Home" options={{ headerTitle: "Home" }} />
            <Stack.Screen name="jobs" options={{ headerTitle: "Jobs" }} />
            <Stack.Screen
              name="savedJobs"
              options={{ headerTitle: "Saved Jobs" }}
            />
            <Stack.Screen name="Login" options={{ headerTitle: "Login" }} />
            <Stack.Screen
              name="Register"
              options={{ headerTitle: "Register" }}
            />
            <Stack.Screen name="debug" options={{ headerTitle: "Debug" }} />
            <Stack.Screen
              name="userProfile"
              options={{ headerTitle: "User Profile" }}
            />
          </Stack>
        </AuthGate>
      </SavedJobsProvider>
    </AuthProvider>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { userToken, isLoading } = React.useContext(AuthContext);
  const segments = useSegments();

  // Define public segments that don't require authentication
  const publicSegments = ["", "index", "login", "register", "debug"];

  // Wait for loading to complete before making redirect decisions
  if (isLoading) {
    return <>{children}</>;
  }

  // Get the current route segment
  const currentSegment = segments.length > 0 ? segments[0]?.toLowerCase() : "";

  // Check if current route is public
  const isPublicRoute = publicSegments.includes(currentSegment);

  // If user is authenticated and trying to access login/register, redirect to home
  if (
    userToken &&
    (currentSegment === "login" || currentSegment === "register")
  ) {
    return <Redirect href="/Home" />;
  }

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!userToken && !isPublicRoute) {
    return <Redirect href="/Login" />;
  }

  // Allow access to the route
  return <>{children}</>;
}
