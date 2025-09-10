import { render, screen } from "@testing-library/react-native";
import React from "react";

jest.mock("expo-router", () => ({ Stack: { Screen: () => null } }));

import SavedJobs from "./savedJobs";

it("renders Saved Jobs title (smoke test)", () => {
  render(<SavedJobs />);
  expect(screen.getByText(/Saved Jobs/i)).toBeTruthy();
});
