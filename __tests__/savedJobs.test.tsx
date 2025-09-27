import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";
import { SavedJobsProvider, useSavedJobs } from "../src/utils/SavedJobsContext";
import { AuthContext } from "../context/AuthProvider";

// Make getItem return a saved list for the current user's key
jest.spyOn(AsyncStorage, "getItem").mockImplementation(async (key: string) => {
  return key.includes("SAVED_JOBS_V3_")
    ? JSON.stringify([{ id: "2", title: "QA", company: "", location: "" }])
    : null;
});

function Consumer() {
  const { saved, add, remove, isSaved } = useSavedJobs();
  return (
    <>
      <Text testID="count">{String(saved.length)}</Text>
      <Pressable onPress={() => add({ id: "1", title: "Dev", company: "", location: "" })}>
        <Text>add</Text>
      </Pressable>
      <Pressable onPress={() => remove("1")}>
        <Text>remove</Text>
      </Pressable>
      <Text testID="isSaved">{String(isSaved("1"))}</Text>
    </>
  );
}

test("add/remove/isSaved work and state hydrates from storage", async () => {
  const authValue = {
    userToken: "t",
    username: "tester",
    password: "p",
    login: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
  };

  const { getByText, getByTestId } = render(
    <AuthContext.Provider value={authValue as any}>
      <SavedJobsProvider>
        <Consumer />
      </SavedJobsProvider>
    </AuthContext.Provider>
  );

  // seed from storage
  await waitFor(() => expect(getByTestId("count").props.children).toBe("1"));

  // add
  fireEvent.press(getByText("add"));
  await waitFor(() => expect(getByTestId("count").props.children).toBe("2"));
  expect(getByTestId("isSaved").props.children).toBe("true");

  // remove
  fireEvent.press(getByText("remove"));
  await waitFor(() => expect(getByTestId("count").props.children).toBe("1"));
});
