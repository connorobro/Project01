import { StyleSheet, Text, View } from "react-native";

export default function userProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>User Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
