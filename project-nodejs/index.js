const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// koneksi ke MySQL (nama service = db)
const db = mysql.createConnection({
  host: 'db',
  user: 'user',
  password: '123',
  database: 'testdb'
});

db.connect(err => {
  if (err) {
    console.error('Koneksi gagal:', err);
    process.exit(1);
  }
  console.log('Terhubung ke MySQL!');
});

// endpoint root
app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
