import * as SQLite from 'expo-sqlite';

const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('users.db');
};

export const registerUser = async (username: string, password: string): Promise<boolean> => {
  if (!username || !password) {
    console.log('Username and password are required');
    return false;
  }

  const db = await openDatabase();
  try {
    await db.runAsync(
      'INSERT INTO users (username, password) VALUES (?, ?);',
      [username, password]
    );
    console.log(`Registered user: ${username}`);
    return true;
  } catch (error) {
    console.log('Error registering user:', error);
    return false;
  } finally {
    await db.closeAsync();
  }
};

// Check login credentials
export const loginUser = async (username: string, password: string): Promise<boolean> => {
  if (!username || !password) {
    return false;
  }

  const db = await openDatabase();
  try {
    const result = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ? AND password = ?;',
      [username, password]
    );
    return !!result; // Return true if user is found, false otherwise
  } catch (error) {
    console.log('Error during login:', error);
    return false;
  } finally {
    await db.closeAsync();
  }
};

// List all users
export const getAllUsers = async (): Promise<Array<{ id: number; username: string; password: string }>> => {
  const db = await openDatabase();
  try {
    const result = await db.getAllAsync('SELECT * FROM users;');
    return result as Array<{ id: number; username: string; password: string }>;
  } catch (error) {
    console.log('Error fetching users:', error);
    return [];
  } finally {
    await db.closeAsync();
  }
};