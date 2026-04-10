const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

// Open a connection to SQLite database
const dbPromise = open({
  filename: path.join(__dirname, 'database.sqlite'),
  driver: sqlite3.Database
});

// Initialize tables if they don't exist
dbPromise.then(async (db) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS farmers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aadhaar TEXT,
      name TEXT,
      wallet TEXT,
      location TEXT,
      crop_type TEXT,
      wallet_balance REAL DEFAULT 0
    );
  `);
  
  // Safe Alterations for existing dev databases
  try { await db.exec("ALTER TABLE farmers ADD COLUMN location TEXT;"); } catch(e){}
  try { await db.exec("ALTER TABLE farmers ADD COLUMN crop_type TEXT;"); } catch(e){}
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS yields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER,
      crop TEXT,
      weight REAL,
      price REAL,
      tokens_earned REAL
    );
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER,
      crop TEXT,
      weight REAL,
      price REAL
    );
  `);
  console.log('SQLite database connected and initialized.');
}).catch(err => {
  console.error('Failed to initialize SQLite:', err);
});

// Create a wrapper object that mimics mysql2 promises
// so we don't have to rewrite any of the routes
const legacyDb = {
  query: async (sql, params = []) => {
    const db = await dbPromise;
    // Check if the query modifies data
    const isInsertUpdateDelete = /^(INSERT|UPDATE|DELETE)/i.test(sql.trim());
    
    if (isInsertUpdateDelete) {
      const result = await db.run(sql, params);
      // MySQL returns an array where the first element contains insertId and affectedRows
      return [{ insertId: result.lastID, affectedRows: result.changes }];
    } else {
      const rows = await db.all(sql, params);
      // MySQL returns [rows, fields] for select queries
      return [rows];
    }
  }
};

module.exports = legacyDb;