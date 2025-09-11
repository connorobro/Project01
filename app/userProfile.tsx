import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function UserProfile() {
  // Dummy initial values; replace with real user data from backend if needed
  const [username, setUsername] = useState("current_username");
  const [password, setPassword] = useState("current_password");
  const [editing, setEditing] = useState(false);

  // // when you click save, you run this function to update the user in the database
  // const handleSave = async () => {
  //   // Replace 1 with the actual user id
  //   const success = await updateUser(1, username, password);
  //   if (success) {
  //     setEditing(false);
  //     console.log("User updated successfully");
  //   } else {
  //     console.log("Error updating user");
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit User Profile</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          editable={editing}
          onChangeText={setUsername}
          placeholder="Enter new username"
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          editable={editing}
          onChangeText={setPassword}
          placeholder="Enter new password"
          secureTextEntry
        />
      </View>
      <Button
        title={editing ? "Save" : "Edit"}
        onPress={editing ? () => {} : () => setEditing(true)} // Replace () => {} with handleSave when uncommenting handleSave function
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 24,
    width: "100%",
    maxWidth: 320,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 4,
  },
});
