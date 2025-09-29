import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { createContext, ReactNode, useState } from "react";

type AuthContextType = {
  userToken: string | null;
  login: (token: string, userId: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    token: string,
    userId: string,
    username: string,
    password: string
  ) => Promise<void>;
  userId: string | null;
  username: string | null;
  password: string | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  userId: null,
  username: null,
  password: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  isLoading: true,
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Load token and username from AsyncStorage on mount
  React.useEffect(() => {
    const loadUserData = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const uid = await AsyncStorage.getItem("userId");
      const username = await AsyncStorage.getItem("username");
      const password = await AsyncStorage.getItem("password");
      setUserToken(token);
      setUserId(uid);
      setUsername(username);
      setPassword(password);
      setIsLoading(false);
    };
    loadUserData();
  }, []);

  const login = async (token: string, userId: string, username: string, password: string) => {
    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("userId", userId);
    await AsyncStorage.setItem("username", username);
    await AsyncStorage.setItem("password", password);
    setUserToken(token);
    setUserId(userId);
    setUsername(username);
    setPassword(password);
    setIsLoading(false);
  };

  const register = async (token: string, userId: string, username: string, password: string) => {
     await AsyncStorage.setItem("userToken", token);
     await AsyncStorage.setItem("userId", userId);
     await AsyncStorage.setItem("username", username);
     await AsyncStorage.setItem("password", password);
     setUserToken(token);
     setUserId(userId);
     setUsername(username);
     setPassword(password);
     setIsLoading(false);
   };

  const logout = async () => {
    console.log("Logout started - clearing storage and redirecting to /");
    // Clear storage first
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("password");
    
    // Update state - ensure we're not in loading state
    setIsLoading(false);
    setUserToken(null);
    setUsername(null);
    setPassword(null);
    
    console.log("Logout - storage cleared, state updated, redirecting to /");
    
    // Use setTimeout to ensure state updates are processed
    setTimeout(() => {
      router.replace("/");
    }, 100);
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userId,
        username,
        password,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
