import { Link, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthProvider";
import "./index.css";

export default function Index() {
  const { userToken } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (userToken) {
      router.replace("/Home");
    }
  }, [userToken, router]);

  return (
    <div className="page-container">
      <main className="center-container">
        <h1 className="title">Job Listing</h1>
        <Link className="index-button" href={"./Login"} style={styles.button}>
          Login
        </Link>
        <Link className="index-button" href="./Register" style={styles.button}>
          Register
        </Link>
      </main>
    </div>
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
    margin: 10,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 15,
    // textDecorationLine: "underline",
    color: "#fff",
  },
});
