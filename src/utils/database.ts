import * as SQLite from 'expo-sqlite';

// Open or create the database file
const db = SQLite.openDatabaseSync('users.db');

// Initialize the database (create table if not exists)
export const initDatabase = () => {
  db.execSync([
    {
      sql: `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      );`,
      args: [],
    },
  ]);
  console.log('Users table created or already exists');
};