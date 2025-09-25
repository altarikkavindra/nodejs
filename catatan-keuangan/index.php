<?php
$servername = "db";
$username = "user";
$password = "123";
$database = "keuangan";

// Koneksi ke DB
$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Ambil data transaksi
$result = $conn->query("SELECT * FROM transaksi");

echo "<h2>Catatan Keuangan Harian</h2>";
echo "<table border='1'>
<tr><th>ID</th><th>Tanggal</th><th>Keterangan</th><th>Jumlah</th></tr>";

while ($row = $result->fetch_assoc()) {
    echo "<tr>
            <td>".$row["id"]."</td>
            <td>".$row["tanggal"]."</td>
            <td>".$row["keterangan"]."</td>
            <td>".$row["jumlah"]."</td>
          </tr>";
}
echo "</table>";
?>
