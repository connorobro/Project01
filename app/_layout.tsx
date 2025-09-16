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
          <Stack />
        </AuthGate>
      </SavedJobsProvider>
    </AuthProvider>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { userToken, isLoading } = React.useContext(AuthContext);
  const segments = useSegments();

  // Define public top-level segments; everything else will be protected by default.
  // Include empty string for root (index).
  const publicSegments = ["", "index", "login", "register", "debug"];

  // segments is an array like ["Home"] or ["jobs"] depending on route
  const seg = segments[0] ? segments[0].toLowerCase() : "";

  const shouldRedirect = !isLoading && !publicSegments.includes(seg) && !userToken;

  // If we need to redirect, render the expo-router Redirect component so navigation happens
  // only when the router is ready (avoids 'attempted to navigate before mounting').
  if (shouldRedirect) {
    return <Redirect href="/Login" />;
  }

  return <>{children}</>;
}
