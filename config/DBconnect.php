<?php
$host = 'localhost';
$dbname = 'gwangju';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
} catch (PDOException $e) {
    echo $e->getMessage();
}
