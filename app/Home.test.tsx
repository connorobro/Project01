// /// <reference types="jest" />
// import { fireEvent, render } from "@testing-library/react-native";
// import HomeScreen from "./Home";

// describe("<HomeScreen />", () => {
//   test("shows Saved Jobs and User Profile buttons", () => {
//     const { getByText } = render(<HomeScreen />);
//     getByText("Saved Jobs");
//     getByText("User Profile");
//   });

//   test("shows dropdown labels", () => {
//     const { getByText } = render(<HomeScreen />);
//     getByText("Choose Job Category");
//     getByText("Choose Level Category");
//   });

//   test("opens User Profile menu on press", () => {
//     const { getByText } = render(<HomeScreen />);
//     fireEvent.press(getByText("User Profile"));
//     getByText("Logout");
//     getByText("Update Profile");
//   });

//   test("snapshot renders", () => {
//     const tree = render(<HomeScreen />).toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });
