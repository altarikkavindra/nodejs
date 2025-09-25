<?php
$servername = "db"; 
$username = "user";  // sesuaikan sama docker-compose
$password = "123";   // sesuaikan
$database = "keuangan";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
echo "<h2>Catatan Keuangan</h2>";

$result = $conn->query("SELECT * FROM transaksi");

echo "<table border='1' cellpadding='5'>";
echo "<tr><th>ID</th><th>Keterangan</th><th>Jumlah</th><th>Tipe</th></tr>";
while($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>".$row["id"]."</td>";
    echo "<td>".$row["keterangan"]."</td>";
    echo "<td>".$row["jumlah"]."</td>";
    echo "<td>".$row["tipe"]."</td>";
    echo "</tr>";
}
echo "</table>";
?>
