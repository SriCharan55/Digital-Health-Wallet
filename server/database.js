const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ✅ Always create DB in a fixed location
const dbPath = path.join(__dirname, "health_wallet.db");

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error connecting to SQLite:", err);
  } else {
    console.log("✅ Connected to SQLite database at", dbPath);
  }
});


// Create tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  // Reports table
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      filename TEXT,
      report_type TEXT,
      report_date TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

   db.run(
  "ALTER TABLE reports ADD COLUMN associated_vital TEXT",
  (err) => {
    if (err) {
      // SQLite already has the column → ignore safely
      if (!err.message.includes("duplicate column name")) {
        console.error("❌ ALTER TABLE error:", err.message);
      }
    } else {
      console.log("✅ associated_vital column added");
    }
  }
);


  // Vitals table
  db.run(`
    CREATE TABLE IF NOT EXISTS vitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      vital_type TEXT,
      value TEXT,
      date TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

 



  // Shares table
  db.run(`
    CREATE TABLE IF NOT EXISTS shares (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id INTEGER,
      shared_with TEXT,
      role TEXT,
      FOREIGN KEY (report_id) REFERENCES reports(id)
    )
  `);

  console.log("✅ All tables created");
});



module.exports = db;
