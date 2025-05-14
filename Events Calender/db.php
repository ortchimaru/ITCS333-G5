<?php
$host = 'localhost';
$dbname = 'mydb';
$username = 'user';
$password = 'pass';

try {
  $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
} catch (PDOException $e) {
  echo "Database connection failed.";
  exit;
}