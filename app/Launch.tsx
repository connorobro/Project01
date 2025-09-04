import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

/* This page will contain two buttons to login or register.
Pressing the login button takes the User to Login.tsx 
Pressing the register button takes the User to Register.tsx
*/

export default function Launch() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <TouchableOpacity onPress={() => router.push("/Login")}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/Register")}>
        <Text>Register</Text>
      </TouchableOpacity>
    </SafeAreaProvider>
  );
}