import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
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

      {/* inner container  */}
      {/* <View style={{width:'15%',backgroundColor: 'white', alignContent: "center",}}> */}
      {/* <Link href="/Home" style={styles.button}>Home</Link> */}
      {/* </View> */}
      {/* <View style={{flexDirection: 'column',}}> */}
        {/* <View style={{alignItems: 'center',borderRadius:100,margin:10,padding: 5,width: 150, height: 150, backgroundColor: "rgba(87, 120, 129, 1)"}}>
          <Text style={{fontWeight: "900",color: 'white',}}>Photo</Text>
        </View> */}
        {/* <View style={{alignItems: 'flex-start',width: 200, height: 200,borderRadius: 20, backgroundColor: 'rgba(154, 187, 203, 0.33)', marginTop: 20}}>
          <Text style={styles.text}>Name:  </Text>
          <Text style={styles.text}>Title: </Text>
          <Text style={styles.text}>User Id</Text>

        </View> */}
      {/* </View> */}
      <View style={{flexDirection:"column",padding: 100, borderRadius: 15, backgroundColor: '#00171F'}}>
        <Text style={styles.header}>Edit User Profile</Text>
        {/* <Text style={styles.header}>Edit User Credentials</Text> */}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: "#25292e",
    backgroundColor:'#003459',
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    // color: "#fff",
    color: "#bcc0e2ff",

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
    // backgroundColor: "#fff",
    backgroundColor: "rgba(198, 200, 206, 1)",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 4,
  },
  button:{
    backgroundColor: 'rgba(113, 146, 177, 0.87)',
    color: 'white',
    // margin: 25,
    padding: 15,
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 0,
    // alignItems: "center"
  },
  text:{
    fontSize: 20,
    fontWeight: '900',
    color: "rgba(231, 242, 245, 1)",
    alignContent: 'center',
    textAlign: 'center',
    margin: 5,
    // justifyContent: 'center'
  }
});
