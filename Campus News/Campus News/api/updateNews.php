<?php
require_once '../config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, POST");
    header("Access-Control-Allow-Headers: Content-Type");
    exit;
}

// Accept PUT or POST with _method=PUT
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['_method']) && $_POST['_method'] === 'PUT') {
        // Continue processing as a PUT request
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }
}

try {
    // Get input data
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
    } else {
        // POST with _method=PUT
        $data = $_POST;
    }

    if (empty($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'News ID is required']);
        exit;
    }
    
    // First check if the news item exists
    $checkStmt = $conn->prepare("SELECT id FROM news WHERE id = :id");
    $checkStmt->bindValue(':id', $data['id'], PDO::PARAM_INT);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'News item not found']);
        exit;
    }
    
    // Build the update SQL dynamically
    $updateFields = [];
    $params = [':id' => intval($data['id'])];
    
    if (!empty($data['title'])) {
        $updateFields[] = "title = :title";
        $params[':title'] = $data['title'];
    }
    
    if (!empty($data['content'])) {
        $updateFields[] = "content = :content";
        $params[':content'] = $data['content'];
    }
    
    if (!empty($data['image_url'])) {
        $updateFields[] = "image_url = :image_url";
        $params[':image_url'] = $data['image_url'];
    }
    
    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        exit;
    }
    
    // Create and execute the update statement
    $sql = "UPDATE news SET " . implode(", ", $updateFields) . " WHERE id = :id";
    $stmt = $conn->prepare($sql);
    
    foreach ($params as $key => &$val) {
        $type = is_int($val) ? PDO::PARAM_INT : PDO::PARAM_STR;
        $stmt->bindParam($key, $val, $type);
    }
    
    $stmt->execute();
    
    // Fetch the updated news item
    $getStmt = $conn->prepare("SELECT * FROM news WHERE id = :id");
    $getStmt->bindValue(':id', $data['id'], PDO::PARAM_INT);
    $getStmt->execute();
    $updatedNews = $getStmt->fetch();
    
    // Ensure ID is an integer
    $updatedNews['id'] = (int)$updatedNews['id'];
    
    echo json_encode($updatedNews);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
