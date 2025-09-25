const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
  host: 'db',       // pastikan sesuai nama service MySQL di docker-compose
  user: 'user',     // sesuai environment MYSQL_USER
  password: '123',  // sesuai environment MYSQL_PASSWORD
  database: 'crud' // sesuai environment MYSQL_DATABASE
});

// Retry koneksi kalau MySQL belum ready
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

// CREATE: tambah transaksi
app.post('/transaksi', (req, res) => {
  const { keterangan, jumlah, tipe } = req.body;
  db.query(
    'INSERT INTO transaksi (keterangan, jumlah, tipe) VALUES (?, ?, ?)',
    [keterangan, jumlah, tipe],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ id: result.insertId, keterangan, jumlah, tipe });
    }
  );
});

// READ: tampilkan semua transaksi
app.get('/transaksi', (req, res) => {
  db.query('SELECT * FROM crud.transaksi', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// UPDATE: ubah transaksi berdasarkan ID
app.put('/transaksi/:id', (req, res) => {
  const { keterangan, jumlah, tipe } = req.body;
  const { id } = req.params;
  db.query(
    'UPDATE transaksi SET keterangan=?, jumlah=?, tipe=? WHERE id=?',
    [keterangan, jumlah, tipe, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send({ id, keterangan, jumlah, tipe });
    }
  );
});

// DELETE: hapus transaksi berdasarkan ID
app.delete('/transaksi/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM transaksi WHERE id=?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ id });
  });
});

// Jalankan server
app.get('/', (req, res) => {
  res.send('Server Node.js + MySQL berjalan dengan baik! Coba akses /transaksi untuk CRUD.');
});
app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
