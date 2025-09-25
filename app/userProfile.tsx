import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import "./userProfile.css";

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
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <h1 className="profile-title">User Profile</h1>
        <button className="nav-button" onClick={() => router.push("/Home")}>
          ← Back to Home
        </button>
      </header>

      {/* Edit Form Section */}
      <div className="center">
        <div className="profile-form-section">
          <h2 className="form-title">Edit Credentials</h2>

          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              type="text"
              className={`form-input ${!editing ? "readonly" : ""}`}
              value={username}
              readOnly={!editing}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter new username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              type="text"
              className={`form-input ${!editing ? "readonly" : ""}`}
              value={password}
              readOnly={!editing}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <button
            className="button profile-action-btn"
            onClick={editing ? handleSave : () => setEditing(true)}
          >
            {editing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
