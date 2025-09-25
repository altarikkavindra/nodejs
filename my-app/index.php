<?php
$servername = "db"; 
$username = "db";
$password = "123";
$database = "db";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
echo "Koneksi ke database berhasil!<br>";

// coba query
$result = $conn->query("SELECT * FROM stok");

if ($result === false) {
    die("Query error: " . $conn->error);
}

if ($result->num_rows === 0) {
    echo "Tidak ada data di tabel stok.<br>";
} else {
    while ($row = $result->fetch_assoc()) {
        echo $row["id"] . " | " . $row["nama"] . " | " . $row["stok"] . "<br>";
    }
}

?>
