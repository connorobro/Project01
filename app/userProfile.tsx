import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthContext } from "../context/AuthProvider";

export default function UserProfile() {
  // show the current username and password with the ability to edit them
  const {
    userToken,
    username: storedUsername,
    password: storedPassword,
    logout,
  } = React.useContext(AuthContext);
  const router = useRouter();
  // Dummy initial values; replace with real user data from backend if needed

  const [username, setUsername] = useState(storedUsername || "");
  const [password, setPassword] = useState(storedPassword || "");
  console.log("Stored username:", storedUsername);
  console.log("Stored password:", storedPassword);
  const [editing, setEditing] = useState(false);

  // Early return for unauthenticated users
  if (!userToken) {
    router.replace("/Login");
    return null;
  }
  const handleSave = async () => {
    const existingUsers = await AsyncStorage.getItem("users");
    let users = existingUsers ? JSON.parse(existingUsers) : [];

    // Use storedUsername to find and update the user
    users = users.map((u: { username: string; password: string }) =>
      u.username === storedUsername ? { ...u, username, password } : u
    );

    await AsyncStorage.setItem("users", JSON.stringify(users));
    await AsyncStorage.setItem("username", username); // update current username in AsyncStorage

    setUsername(username); // update context
    setPassword(password); // update context
    console.log("Updated username:", username);
    console.log("Updated password:", password);
    setEditing(false);

    // Warn and log out
    if (username !== storedUsername || password !== storedPassword) {
      alert("Your username or password has changed. You will be logged out.");
      if (typeof logout === "function") {
        logout();
      }
    }
  };

  return (
    <View style={styles.container}>
        <Link href="/Home" style={styles.button}>Home</Link>

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
        />
      </View>
      <Button
        title={editing ? "Save" : "Edit"}
        onPress={editing ? handleSave : () => setEditing(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    // backgroundColor: "#041b1fff", 

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
  button:{
    backgroundColor: 'rgba(11, 104, 191, 0.87)',
    color: 'white',
    margin: 25,
    padding: 15,
    borderRadius: 10
  }
});
