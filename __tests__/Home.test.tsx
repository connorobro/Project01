import { render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import HomeScreen from "../app/Home";

// Mock fetch for API calls
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          results: [
            { label: "IT", value: "it" },
            { label: "Healthcare", value: "healthcare" },
          ],
        }),
    } as Response)
  );
});

afterAll(() => {
  (global.fetch as jest.Mock).mockRestore?.();
});

describe("HomeScreen", () => {
  it("fetches and displays job categories from API", async () => {
    render(<HomeScreen />);
    // Wait for dropdown to be populated
    await waitFor(() => {
      expect(screen.getByText("IT")).toBeTruthy();
      expect(screen.getByText("Healthcare")).toBeTruthy();
    });
  });
});
