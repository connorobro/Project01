import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('database.db') as any; // Type assertion workaround

export const initDatabase = () => {
  db.exec([
    { sql: 'PRAGMA foreign_keys = ON;', args: [] },
    { sql: 'DROP TABLE IF EXISTS users;', args: [] },
    { sql: 'DROP TABLE IF EXISTS jobs;', args: [] },
    { sql: 'DROP TABLE IF EXISTS saved_jobs;', args: [] },
    { sql: `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `, args: [] },
    { sql: `
      CREATE TABLE IF NOT EXISTS jobs (
        job_id TEXT PRIMARY KEY,
        title TEXT,
        company TEXT
      );
    `, args: [] },
    { sql: `
      CREATE TABLE IF NOT EXISTS saved_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        job_id TEXT NOT NULL,
        saved_at INTEGER DEFAULT (strftime('%s', 'now')),
        UNIQUE(user_id, job_id),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
      );
    `, args: [] },
  ], false, () => console.log('Database initialized'));
};

export default db;