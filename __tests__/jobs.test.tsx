import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import JobsScreen from "../app/jobs";
import * as adzuna from "../src/utils/adzuna";
import { SavedJobsProvider } from "../src/utils/SavedJobsContext";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.spyOn(adzuna, "searchJobs");

function renderWithProviders(ui: React.ReactElement) {
  return render(<SavedJobsProvider>{ui}</SavedJobsProvider>);
}

test("renders returned jobs and supports saving", async () => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({ q: "software" });
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });

  (adzuna.searchJobs as jest.Mock).mockResolvedValueOnce([
    { id: "1", title: "Junior Dev", company: { display_name: "Acme" }, location: { display_name: "NYC" }, created: "2025-01-01", redirect_url: "http://x" },
  ]);

  renderWithProviders(<JobsScreen />);

  expect(await screen.findByText(/Showing results for: software/i)).toBeTruthy();

  expect(await screen.findByText("Junior Dev")).toBeTruthy();
  expect(await screen.findByText(/Acme/i)).toBeTruthy();

  const btn = await screen.findByText(/Save/i);
  fireEvent.press(btn);
  await waitFor(async () => {
    expect((await screen.findByText(/Saved/i))).toBeTruthy();
  });
});
