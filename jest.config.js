module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jestSetup.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
};
