import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../context/AuthProvider";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const router = useRouter();

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setFeedback("");

    if (!username.trim() || !password.trim()) {
      setFeedback("Please fill in all fields");
      return;
    }

    setLoading(true);
    setFeedback("Logging in...");

    try {
      const existingUsers = await AsyncStorage.getItem("users");
      const users = existingUsers ? JSON.parse(existingUsers) : [];

      const user = users.find(
        (u: any) => u.username === username && u.password === password
      );
      if (user) {
        // Tell AuthContext who is logged in
        await login("someTokenValue", user.username, user.password);

        await AsyncStorage.setItem("currentUser", JSON.stringify(user));
        await AsyncStorage.setItem("isLoggedIn", "true");

        setFeedback("Login successful! Welcome back!");
        setTimeout(() => {
          router.replace("/Home");
        }, 1500);
      } else {
        setFeedback("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setFeedback("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {feedback ? (
            <View
              style={[
                styles.feedbackContainer,
                feedback.includes("successful") || feedback.includes("Welcome")
                  ? styles.successFeedback
                  : styles.errorFeedback,
              ]}
            >
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/Register")}
          >
            <Text style={styles.linkText}>
              Do not have an account? Register here
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: "center",
//   },
//   formContainer: {
//     padding: 20,
//     margin: 20,
//     backgroundColor: "#003459",
//     borderRadius: 10,
//   },
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003459", // This is your --navy color
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#00171F", // This is your --dark-navy color
  },
  formContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: "rgba(0, 52, 89, 0.9)", // Semi-transparent navy
    borderRadius: 10,
    // Add some shadow for depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00A7E1",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#00171F",
    color: "#00A7E1",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  feedbackContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  successFeedback: {
    backgroundColor: "#007EA7",
  },
  errorFeedback: {
    backgroundColor: "#003459",
  },
  feedbackText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#00A7E1",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#007EA7",
  },
  buttonText: {
    color: "#00171F",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: "#00A7E1",
    textAlign: "center",
    fontSize: 14,
  },
});
