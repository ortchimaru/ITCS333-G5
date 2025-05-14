<?php
require_once '../config.php';

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: DELETE, POST");
    header("Access-Control-Allow-Headers: Content-Type");
    exit;
}

// Accept DELETE or POST with _method=DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && (isset($_POST['_method']) && $_POST['_method'] === 'DELETE')) {
        // Continue processing as a DELETE request
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }
}

try {
    $id = null;
    
    // Get ID from various sources
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!empty($data['id'])) {
            $id = intval($data['id']);
        }
    } else {
        if (!empty($_POST['id'])) {
            $id = intval($_POST['id']);
        }
    }
    
    if ($id === null && !empty($_GET['id'])) {
        $id = intval($_GET['id']);
    }
    
    if ($id === null) {
        http_response_code(400);
        echo json_encode(['error' => 'News ID is required']);
        exit;
    }
    
    $checkStmt = $conn->prepare("SELECT id FROM news WHERE id = :id");
    $checkStmt->bindValue(':id', $id, PDO::PARAM_INT);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'News item not found']);
        exit;
    }
    
    $stmt = $conn->prepare("DELETE FROM news WHERE id = :id");
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    echo json_encode([
        'message' => 'News item deleted successfully',
        'id' => $id
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
