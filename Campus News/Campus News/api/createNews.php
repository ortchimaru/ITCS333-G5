<?php
require_once '../config.php';

// Handle only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Get input data (JSON or form)
    $data = json_decode(file_get_contents('php://input'), true);
    
    // If not JSON, use POST data
    if (empty($data)) {
        $data = $_POST;
    }
    
    // Validate required fields
    if (empty($data['title']) || empty($data['content']) || empty($data['image_url'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    
    // Use prepared statement with named parameters
    $sql = "INSERT INTO news (title, content, image_url) VALUES (:title, :content, :image_url)";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters
    $stmt->bindParam(':title', $data['title'], PDO::PARAM_STR);
    $stmt->bindParam(':content', $data['content'], PDO::PARAM_STR);
    $stmt->bindParam(':image_url', $data['image_url'], PDO::PARAM_STR);
    
    // Execute
    $stmt->execute();
    
    // Get ID of inserted row
    $newsId = $conn->lastInsertId();
    
    // Prepare response
    $data['id'] = (int)$newsId;
    $data['created_at'] = date('Y-m-d H:i:s');
    
    http_response_code(201);
    echo json_encode($data);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
