import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Pressable, Text } from "react-native";
import { SavedJobsProvider, useSavedJobs } from "../src/utils/SavedJobsContext";

jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce(
  JSON.stringify([{ id: "2", title: "QA" }])
);

function Consumer() {
  const { saved, add, remove, isSaved } = useSavedJobs();
  return (
    <>
      <Text testID="count">{String(saved.length)}</Text>
      <Pressable onPress={() => add({ id: "1", title: "Dev" })}>
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
  const { getByText, getByTestId } = render(
    <SavedJobsProvider>
      <Consumer />
    </SavedJobsProvider>
  );

  await waitFor(() => expect(getByTestId("count").props.children).toBe("1"));

  fireEvent.press(getByText("add"));
  await waitFor(() => expect(getByTestId("count").props.children).toBe("2"));
  expect(getByTestId("isSaved").props.children).toBe("true");

  fireEvent.press(getByText("remove"));
  await waitFor(() => expect(getByTestId("count").props.children).toBe("1"));
});
