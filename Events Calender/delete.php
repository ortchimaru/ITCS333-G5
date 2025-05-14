<?php
require 'db.php';

if (!isset($_GET['id'])) {
  die("Event ID is required.");
}

$id = $_GET['id'];

try {
  $stmt = $conn->prepare("DELETE FROM events WHERE id = ?");
  $stmt->execute([$id]);
  header("Location: index.php");
  exit;
} catch (PDOException $e) {
  die("Error deleting event: " . $e->getMessage());
}