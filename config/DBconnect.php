<?php
$host = 'localhost';
$dbname = 'gwangiu';
$username = 'root';
$password = '1234';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname, $username, $password");
} catch (PDOException $e) {
    echo $e->getMessage();
}