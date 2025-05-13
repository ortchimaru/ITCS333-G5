<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

require_once 'db.php';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  if (!isset($_GET['note_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing note_id']);
    exit;
  }

  $note_id = (int) $_GET['note_id'];

  try {
    $stmt = $pdo->prepare("SELECT * FROM comments WHERE note_id = :note_id ORDER BY created_at DESC");
    $stmt->execute([':note_id' => $note_id]);
    echo json_encode($stmt->fetchAll());
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
  }

} elseif ($method === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);

  if (!isset($data['note_id'], $data['content'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
  }

  $note_id = (int) $data['note_id'];
  $content = trim($data['content']);

  try {
    $stmt = $pdo->prepare("INSERT INTO comments (note_id, content) VALUES (:note_id, :content)");
    $stmt->execute([
      ':note_id' => $note_id,
      ':content' => $content
    ]);
    echo json_encode(['message' => '✅ Comment added']);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
  }
}
?>
