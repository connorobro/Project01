import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";
import Jobs from "../app/jobs";

jest.mock("expo-router", () => {
  const push = jest.fn();
  return { router: { push } };
});

jest.mock("../src/utils/SavedJobsContext", () => ({
  useSavedJobs: () => ({ add: jest.fn(), isSaved: () => false }),
}));

describe("Jobs screen", () => {
  it("navigates to /savedJobs when Saved Jobs is pressed", () => {
    render(<Jobs />);
    fireEvent.press(screen.getByText(/Saved Jobs/i));
    expect(router.push).toHaveBeenCalledWith("/savedJobs");
  });
});
