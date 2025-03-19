import sqlite3 from 'sqlite3';

// Initialize the database (will create a new file if it doesn't exist)
const db = new sqlite3.Database('./ntataise.db', (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("SQLite Database connected.");
  }
});

// Create `courses` table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique identifier for each course
    title TEXT,                            -- Title of the course
    summary TEXT,                          -- Summary of the course
    subject TEXT                           -- Subject of the course
  )
`);

// Create `profiles` table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,                   -- User ID from Firebase
    firstName TEXT,
    lastName TEXT,
    email TEXT,
    profilePicture TEXT,                   -- Optional: Store URL to the profile picture
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create `recommendations` table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,                           -- User ID
    title TEXT,                            -- Course title
    subject TEXT,                          -- Subject of the course
    level TEXT,                            -- Course difficulty level
    url TEXT,                              -- URL for the course
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES profiles (id) ON DELETE CASCADE
  )
`);

export default db;
