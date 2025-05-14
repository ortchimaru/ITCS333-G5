<?php
require_once '../config.php';

// Handle only GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Default query
    $sql = "SELECT * FROM news ORDER BY created_at DESC";
    $params = [];
    
    // Search functionality
    if (!empty($_GET['search'])) {
        $search = '%' . $_GET['search'] . '%';
        $sql = "SELECT * FROM news WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC";
        $params = [$search, $search];
    } 
    // Get by ID
    else if (!empty($_GET['id'])) {
        $sql = "SELECT * FROM news WHERE id = ?";
        $params = [intval($_GET['id'])];
    }
    
    $stmt = $conn->prepare($sql);
    
    // Bind parameters if any
    if (!empty($params)) {
        $types = str_repeat('s', count($params));
        $stmt->execute($params);
    } else {
        $stmt->execute();
    }
    
    $news = $stmt->fetchAll();
    
    // Ensure all IDs are integers for JavaScript
    foreach ($news as &$item) {
        if (isset($item['id'])) {
            $item['id'] = (int)$item['id'];
        }
    }
    
    echo json_encode($news);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
