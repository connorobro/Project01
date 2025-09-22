import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as adzuna from "../src/utils/adzuna";
import JobsScreen from "../app/jobs";
import { SavedJobsProvider } from "../src/utils/SavedJobsContext";
import { AuthContext } from "../context/AuthProvider";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.spyOn(adzuna, "searchJobs");

function renderWithProviders(ui: React.ReactElement) {
  const authValue = {
    userToken: "t",
    username: "tester",
    password: "p",
    login: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
  };
  return render(
    <AuthContext.Provider value={authValue as any}>
      <SavedJobsProvider>{ui}</SavedJobsProvider>
    </AuthContext.Provider>
  );
}

test("renders returned jobs and lets me save/unsave from the heart", async () => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({ q: "software" });
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });

  (adzuna.searchJobs as jest.Mock).mockResolvedValueOnce([
    {
      id: "1",
      title: "Junior Dev",
      company: { display_name: "Acme" },
      location: { display_name: "NYC" },
      created: "2025-01-01",
      redirect_url: "http://x",
    },
  ]);

  renderWithProviders(<JobsScreen />);

  // chip shows current category
  expect(await screen.findByText(/Category:\s*software/i)).toBeTruthy();

  // job renders
  expect(await screen.findByText("Junior Dev")).toBeTruthy();
  expect(await screen.findByText(/Acme/i)).toBeTruthy();

  // toggle heart by testID and assert its accessibilityLabel changes
  const heart = await screen.findByTestId("heart-1");

  // initially should say "Save job"
  expect(heart.props.accessibilityLabel).toMatch(/save job/i);

  fireEvent.press(heart);
  await waitFor(() =>
    expect(screen.getByTestId("heart-1").props.accessibilityLabel).toMatch(/unsave job/i)
  );

  fireEvent.press(screen.getByTestId("heart-1"));
  await waitFor(() =>
    expect(screen.getByTestId("heart-1").props.accessibilityLabel).toMatch(/save job/i)
  );
});


