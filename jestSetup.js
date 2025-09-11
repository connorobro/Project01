// Mock AsyncStorage for Jest
module.exports = () => {
  jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
  );
};
