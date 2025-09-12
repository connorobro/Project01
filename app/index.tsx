import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <text style={styles.text}>Welcome</text>

      <Link href="./Register" style={styles.button}>
        Register
      </Link>
      <Link href={"./Login"} style={styles.button}>
        Login
      </Link>
      {/* <Link href={"/Home"} style={styles.button}>
        Home
      </Link> */}
      {/* <Link href={"/savedJobs"} style={styles.button}>
        Saved Jobs
      </Link> */}
      {/* <Link href={"/jobs"} style={styles.button}>
        Job
      </Link> */}
      {/* <Link href={"/debug"} style={styles.button}>
        View Database
      </Link> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: '15px',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
    
  },
  text: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
    // color: "#fff",
    textAlign: "center",
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold", 
    letterSpacing: 2
  },
  button: {
    fontSize: 20,
    backgroundColor: "#007AFF",
    
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
    // paddingLeft: 20,
    padding: 40,
    // textDecorationLine: "underline",
    color: "#fff",
  },
});
