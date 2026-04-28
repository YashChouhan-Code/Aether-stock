const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'stockforge.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT, stock INTEGER DEFAULT 0, unit TEXT, status TEXT, gst REAL DEFAULT 0)`);
      db.run(`CREATE TABLE IF NOT EXISTS purchase_orders (id TEXT PRIMARY KEY, supplier TEXT, type TEXT, amount REAL, status TEXT)`);
      db.run(`CREATE TABLE IF NOT EXISTS invoices (id TEXT PRIMARY KEY, customer TEXT, contact TEXT, date TEXT, total REAL, status TEXT)`);
      db.run(`CREATE TABLE IF NOT EXISTS agencies (id TEXT PRIMARY KEY, name TEXT, contact TEXT, performance_score INTEGER)`);
      db.run(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`);

      // Try adding new columns to existing tables if not exists
      db.run(`ALTER TABLE items ADD COLUMN gst REAL DEFAULT 0`, () => {});
      db.run(`ALTER TABLE invoices ADD COLUMN contact TEXT`, () => {});

      db.get("SELECT COUNT(*) as count FROM agencies", (err, row) => {
        if (row && row.count === 0) {
          db.run("INSERT INTO agencies VALUES ('V-001', 'MedLife Agency', '+91-9876543210', 98)");
          db.run("INSERT INTO agencies VALUES ('V-002', 'CarePharma Suppliers', '+91-9988776655', 85)");
          db.run("INSERT INTO agencies VALUES ('V-003', 'Global Medical', '+91-9123456789', 92)");
        }
      });

      // Default Settings
      db.get("SELECT COUNT(*) as count FROM settings", (err, row) => {
        if (row && row.count === 0) {
          db.run("INSERT INTO settings (key, value) VALUES ('low_stock_threshold', '100')");
          db.run("INSERT INTO settings (key, value) VALUES ('gst_options', '0,5,12,18,28')");
        }
      });
    });
  }
});

module.exports = db;
