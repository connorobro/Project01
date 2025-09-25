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
        <view style={{width:'25%',}}>
          <Text style={styles.title}>Job Listing</Text>
        </view>
      <View style={{flexDirection: 'column',justifyContent:'space-evenly', width: '50%',height: '45%', backgroundColor: '#003459', borderRadius: 15}}>
        <Link href="./Register" style={styles.button}>
          Register
        </Link>
        <Link href={"./Login"} style={styles.button}>
          Login
        </Link>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: '#00171F',
    textAlign: 'center'
  },
  text: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 25,
  },
  button: {
    textAlign: 'center',
    fontSize: 20,
    margin: 15,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 15,
    color: "#fff",
  },
  title:{
    fontSize: 40,
    color: '#007EA7',
    fontWeight: '800'
  }
});
