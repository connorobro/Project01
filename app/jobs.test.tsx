import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

jest.mock("expo-router", () => {
  const push = jest.fn();
  return { router: { push } };
});
const { router } = require("expo-router");

jest.mock("../src/utils/SavedJobsContext", () => ({
  useSavedJobs: () => ({ add: jest.fn(), isSaved: () => false }),
}));

import Jobs from "./jobs";

describe("Jobs screen", () => {
  it("navigates to /savedJobs when Saved Jobs is pressed", () => {
    render(<Jobs />);
    fireEvent.press(screen.getByText(/Saved Jobs/i));
    expect(router.push).toHaveBeenCalledWith("/savedJobs");
  });
});



