import { render, screen } from "@testing-library/react-native";
import React from "react";
import SavedJobs from "../app/savedJobs";

jest.mock("expo-router", () => ({ Stack: { Screen: () => null } }));

it("renders Saved Jobs title (smoke test)", () => {
  render(<SavedJobs />);
  expect(screen.getByText(/Saved Jobs/i)).toBeTruthy();
});
