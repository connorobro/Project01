import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { AuthContext } from "../context/AuthProvider";

export default function Register({ onRegistered }: { onRegistered?: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const router = useRouter();   
  const { login } = useContext(AuthContext);

  const handleRegister = async () => {
    setFeedback('');

    if (!username.trim() || !password.trim()) {
      setFeedback('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setFeedback('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setFeedback('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setFeedback('Creating account...');

    try {
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const userExists = users.find((user: any) => user.username === username);

      if (userExists) {
        setFeedback('Username already exists');
        setLoading(false);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      // persist current user and mark as logged in
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
      await AsyncStorage.setItem('isLoggedIn', 'true');

      // update in-memory auth state so the app recognizes the logged-in user
      await login('someTokenValue', newUser.username, newUser.password);

      setFeedback('Account created successfully! Redirecting...');
      if (onRegistered) {
        onRegistered();
      } else {
        router.replace('/Home');
      }

    } catch (error) {
      console.error('Registration error:', error);
      setFeedback('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          
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

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {feedback ? (
            <View style={[
              styles.feedbackContainer, 
              feedback.includes('successfully') ? styles.successFeedback : styles.errorFeedback
            ]}>
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>
          ) : null}

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => router.push('/Login')}
          >
            <Text style={styles.linkText}>
              Already have an account? Login here
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
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: "#003459",
    borderRadius: 10,
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