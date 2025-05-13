<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $course = $_GET['course'] ?? '';
    $search = $_GET['search'] ?? '';
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;
    $sort = $_GET['sort'] ?? '';

    $query = "SELECT * FROM notes WHERE 1=1";
    $params = [];

    if (!empty($course)) {
        $query .= " AND course = :course";
        $params[':course'] = $course;
    }

    if (!empty($search)) {
        $query .= " AND title LIKE :search";
        $params[':search'] = "%" . $search . "%";
    }

    if ($sort === 'downloads') {
        $query .= " ORDER BY downloads DESC";
    } else {
        $query .= " ORDER BY created_at DESC";
    }
    $query .= " LIMIT :limit OFFSET :offset";
    
    try {
        $stmt = $pdo->prepare($query);

        if (!empty($course)) {
            $stmt->bindValue(':course', $course);
        }

        if (!empty($search)) {
            $stmt->bindValue(':search', "%" . $search . "%");
        }

        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

        $stmt->execute();
        echo json_encode($stmt->fetchAll());
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => '❌ Query failed: ' . $e->getMessage()]);
    }

} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['title'], $data['course'], $data['description'], $data['uploader'])) {
        http_response_code(400);
        echo json_encode(['error' => '⚠️ Missing required fields.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO notes (title, course, description, uploader, file_path)
            VALUES (:title, :course, :description, :uploader, :file_path)
        ");
        $stmt->execute([
            ':title' => $data['title'],
            ':course' => $data['course'],
            ':description' => $data['description'],
            ':uploader' => $data['uploader'],
            ':file_path' => $data['file_path'] ?? null
        ]);

        echo json_encode(['message' => '✅ Note created successfully!']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => '❌ Insert failed: ' . $e->getMessage()]);
    }

} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($_GET['id'], $data['title'], $data['course'], $data['description'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing fields or ID']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            UPDATE notes
            SET title = :title,
                course = :course,
                description = :description
            WHERE id = :id
        ");
        $stmt->execute([
            ':title' => $data['title'],
            ':course' => $data['course'],
            ':description' => $data['description'],
            ':id' => (int) $_GET['id']
        ]);

        echo json_encode(['message' => '✅ Note updated successfully.']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }

} elseif ($method === 'DELETE') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing ID']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM notes WHERE id = :id");
        $stmt->execute([':id' => (int) $_GET['id']]);

        echo json_encode(['message' => '🗑️ Note deleted']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
