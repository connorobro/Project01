import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../src/utils/authHelpers';

beforeEach(async () => {
  await AsyncStorage.clear();
});

test('registerUser creates and persists a new user', async () => {
  const user = await registerUser('alice', 'pw123');

  expect(user).toBeDefined();
  expect(user.username).toBe('alice');

  const usersRaw = await AsyncStorage.getItem('users');
  expect(usersRaw).toBeDefined();
  const users = usersRaw ? JSON.parse(usersRaw) : [];
  expect(users.length).toBe(1);
  expect(users[0].username).toBe('alice');

  const currentRaw = await AsyncStorage.getItem('currentUser');
  const current = currentRaw ? JSON.parse(currentRaw) : null;
  expect(current.username).toBe('alice');

  const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  expect(isLoggedIn).toBe('true');
});

test('registerUser throws for duplicate username', async () => {
  await registerUser('bob', 'pw1');
  await expect(registerUser('bob', 'pw2')).rejects.toThrow('Username already exists');
});

test('loginUser succeeds with correct credentials', async () => {
  await registerUser('carol', 'pwcarol');
  const user = await loginUser('carol', 'pwcarol');
  expect(user.username).toBe('carol');
  const currentRaw = await AsyncStorage.getItem('currentUser');
  const current = currentRaw ? JSON.parse(currentRaw) : null;
  expect(current.username).toBe('carol');
});

test('loginUser fails with wrong credentials', async () => {
  await registerUser('dave', 'pwdave');
  await expect(loginUser('dave', 'wrong')).rejects.toThrow('Invalid username or password');
});
