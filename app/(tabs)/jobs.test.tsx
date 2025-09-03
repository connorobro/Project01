/// <reference types="jest" />
import { render } from "@testing-library/react-native";
import JobsScreen from "./jobs";

describe("<JobsScreen />", () => {
  test("shows header and Saved Jobs button", () => {
    const { getByText } = render(<JobsScreen />);
    getByText("Job Listings");
    getByText("Saved Jobs");
  });

  test("renders two placeholder job cards", () => {
    const { getAllByText } = render(<JobsScreen />);
    expect(getAllByText("Job Title").length).toBe(2);
  });

  test("snapshot renders", () => {
    const tree = render(<JobsScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
