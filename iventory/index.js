const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'db',
  user: 'user',
  password: '123',
  database: 'inventori'
});

// Retry koneksi
const connectWithRetry = () => {
  db.connect(err => {
    if (err) {
      console.error('Koneksi gagal, coba lagi 5 detik...', err.message);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Terhubung ke MySQL!');
    }
  });
};
connectWithRetry();

// ========================
// ENDPOINTS
// ========================

// Root
app.get('/', (req, res) => {
  res.send('Server Node.js + MySQL Inventori berjalan!');
});

// GET semua barang + kategori (JOIN)
app.get('/barang', (req, res) => {
  db.query(
    `SELECT b.id, b.nama, b.stok, k.nama AS kategori
     FROM barang b
     LEFT JOIN kategori k ON b.kategori_id = k.id`,
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    }
  );
});

// POST tambah kategori
app.post('/kategori', (req, res) => {
  const { nama } = req.body;
  db.query('INSERT INTO kategori (nama) VALUES (?)', [nama], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId, nama });
  });
});

// POST tambah barang
app.post('/barang', (req, res) => {
  const { nama, stok, kategori_id } = req.body;
  db.query(
    'INSERT INTO barang (nama, stok, kategori_id) VALUES (?, ?, ?)',
    [nama, stok, kategori_id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ id: result.insertId, nama, stok, kategori_id });
    }
  );
});

// PUT update stok barang
app.put('/barang/:id', (req, res) => {
  const { stok } = req.body;
  const { id } = req.params;
  db.query('UPDATE barang SET stok=? WHERE id=?', [stok, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ id, stok });
  });
});

// DELETE barang
app.delete('/barang/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM barang WHERE id=?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ id });
  });
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
