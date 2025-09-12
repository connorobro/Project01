import { Link } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
export default function Index() {
    useEffect(() => {
    if (typeof window !== 'undefined') {
      // If someone typed a URL other than root, redirect to root
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        window.location.href = '/';
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello React</Text>
      <Link href="./Register" style={styles.button}>
        Register
      </Link>
      <Link href={"./Login"} style={styles.button}>
        Login
      </Link>
      <Link href={"/Home"} style={styles.button}>
        Home
      </Link>
      <Link href={"/savedJobs"} style={styles.button}>
        Saved Jobs
      </Link>
      <Link href={"/jobs"} style={styles.button}>
        Job
      </Link>
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
    textDecorationLine: "underline",
    color: "#fff",
  },
});
