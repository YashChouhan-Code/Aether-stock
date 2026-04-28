const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// --- ITEMS API ---
app.get('/api/items', (req, res) => {
  db.all("SELECT * FROM items", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "success", data: rows });
  });
});

app.post('/api/items', (req, res) => {
  const { id, name, category, stock, unit, status, gst } = req.body;
  const sql = 'INSERT INTO items (id, name, category, stock, unit, status, gst) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [id, name, category, stock, unit, status, gst || 0], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "success", data: req.body });
  });
});

app.put('/api/items/:id', (req, res) => {
  const { name, category, stock, unit, status, gst } = req.body;
  const sql = 'UPDATE items SET name=?, category=?, stock=?, unit=?, status=?, gst=? WHERE id=?';
  db.run(sql, [name, category, stock, unit, status, gst || 0, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "success" });
  });
});

app.delete('/api/items/:id', (req, res) => {
  const sql = 'DELETE FROM items WHERE id = ?';
  db.run(sql, [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "success" });
  });
});

// --- PURCHASE ORDERS API ---
app.get('/api/purchase-orders', (req, res) => {
  db.all("SELECT * FROM purchase_orders ORDER BY id DESC", [], (err, rows) => {
    res.json({ message: "success", data: rows });
  });
});

app.post('/api/purchase-orders', (req, res) => {
  const { id, supplier, type, amount, status } = req.body;
  const sql = 'INSERT INTO purchase_orders (id, supplier, type, amount, status) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [id, supplier, type, amount, status], function(err) {
    res.json({ message: "success" });
  });
});

app.put('/api/purchase-orders/:id/approve', (req, res) => {
  db.run('UPDATE purchase_orders SET status = ? WHERE id = ?', ['Approved', req.params.id], function(err) {
    res.json({ message: "success" });
  });
});

// --- INVOICES API ---
app.get('/api/invoices', (req, res) => {
  db.all("SELECT * FROM invoices ORDER BY id DESC", [], (err, rows) => {
    res.json({ message: "success", data: rows });
  });
});

app.post('/api/invoices', (req, res) => {
  const { id, customer, contact, date, total, status } = req.body;
  const sql = 'INSERT INTO invoices (id, customer, contact, date, total, status) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [id, customer, contact, date, total, status], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "success" });
  });
});

app.put('/api/invoices/:id/pay', (req, res) => {
  db.run('UPDATE invoices SET status = ? WHERE id = ?', ['Paid', req.params.id], function(err) {
    res.json({ message: "success" });
  });
});

// --- AGENCIES API ---
app.get('/api/agencies', (req, res) => {
  db.all("SELECT * FROM agencies", [], (err, rows) => {
    res.json({ message: "success", data: rows });
  });
});
app.post('/api/agencies', (req, res) => {
  const { id, name, contact, performance_score } = req.body;
  db.run('INSERT INTO agencies VALUES (?, ?, ?, ?)', [id, name, contact, performance_score], function(err) {
    res.json({ message: "success" });
  });
});

// --- SETTINGS API ---
app.get('/api/settings', (req, res) => {
  db.all("SELECT * FROM settings", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json({ message: "success", data: settings });
  });
});

app.put('/api/settings', (req, res) => {
  const settings = req.body;
  let errorOccurred = false;
  let count = 0;
  const keys = Object.keys(settings);
  if (keys.length === 0) return res.json({ message: "success" });

  keys.forEach(key => {
    db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, settings[key]], function(err) {
      if (err) errorOccurred = true;
      count++;
      if (count === keys.length) {
        if (errorOccurred) return res.status(500).json({ error: "Failed to update settings" });
        res.json({ message: "success" });
      }
    });
  });
});

// Serve static files from the React app
const path = require('path');
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
