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
        await login("someTokenValue", user.username); // Replace "someTokenValue" with a real token if you have one
        setFeedback("Login successful! Welcome back!");

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: "#1a1d21",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#2a2d32",
    color: "#fff",
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
    backgroundColor: "#4CAF50",
  },
  errorFeedback: {
    backgroundColor: "#FF3B30",
  },
  feedbackText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 14,
  },
});
