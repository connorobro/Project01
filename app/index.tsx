import { Link, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../context/AuthProvider";

export default function Index() {
  const { userToken } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (userToken) {
      router.replace("/Home");
    }
  }, [userToken, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello React</Text>
      <Link href="./Register" style={styles.button}>
        Register
      </Link>
      <Link href={"./Login"} style={styles.button}>
        Login
      </Link>
      {/* <Link href={"/Home"} style={styles.button}>
        Home
      </Link>
      <Link href={"/savedJobs"} style={styles.button}>
        Saved Jobs
      </Link>
      <Link href={"/jobs"} style={styles.button}>
        Job
      </Link> */}
      <Link href={"/debug"} style={styles.button}>
        View Database
      </Link>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  text: {
    color: "white",
  },
  button: {
    fontSize: 20,
    margin:10,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 15,
    // textDecorationLine: "underline",
    color: "#fff",
  },
});
