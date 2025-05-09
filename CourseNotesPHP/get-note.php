<?php
header("Content-Type: application/json");
require_once 'db.php';

if (!isset($_GET['id'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing note ID']);
  exit;
}

$id = (int) $_GET['id'];

try {
  $stmt = $pdo->prepare("SELECT * FROM notes WHERE id = :id");
  $stmt->execute([':id' => $id]);
  $note = $stmt->fetch();

  if ($note) {
    echo json_encode($note);
  } else {
    http_response_code(404);
    echo json_encode(['error' => 'Note not found']);
  }
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
