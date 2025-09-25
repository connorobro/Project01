import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id: string;
  username: string;
  password: string;
  createdAt: string;
};

export async function registerUser(username: string, password: string): Promise<User> {
  const existing = await AsyncStorage.getItem('users');
  const users: User[] = existing ? JSON.parse(existing) : [];

  if (users.find(u => u.username === username)) {
    throw new Error('Username already exists');
  }

  const newUser: User = {
    id: Date.now().toString(),
    username,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await AsyncStorage.setItem('users', JSON.stringify(users));
  await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
  await AsyncStorage.setItem('isLoggedIn', 'true');

  return newUser;
}

export async function loginUser(username: string, password: string): Promise<User> {
  const existing = await AsyncStorage.getItem('users');
  const users: User[] = existing ? JSON.parse(existing) : [];
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Invalid username or password');

  await AsyncStorage.setItem('currentUser', JSON.stringify(user));
  await AsyncStorage.setItem('isLoggedIn', 'true');
  return user;
}
