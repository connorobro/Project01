import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { createContext, ReactNode, useState } from "react";

type AuthContextType = {
  userToken: string | null;
  login: (token: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  username: string | null;
  password: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  username: null,
  password: null,
  login: async () => {},
  logout: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  // Load token and username from AsyncStorage on mount
  React.useEffect(() => {
    const loadUserData = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const username = await AsyncStorage.getItem("username");
      const password = await AsyncStorage.getItem("password");
      setUserToken(token);
      setUsername(username);
      setPassword(password);
    };
    loadUserData();
  }, []);

  const login = async (token: string, username: string, password: string) => {
    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("username", username);
    await AsyncStorage.setItem("password", password);
    setUserToken(token);
    setUsername(username);
    setPassword(password);
    console.log("User logged in:", username);
    console.log("Password Auth:", password);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("password");
    setUserToken(null);
    setUsername(null);
    setPassword(null);
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{ userToken, username, password, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
