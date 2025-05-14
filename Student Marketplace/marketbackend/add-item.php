<?php
// Handle preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    // Validate required fields
    $required = ['title', 'description', 'price', 'author', 'contact'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => "Missing required field: $field"
            ]);
            exit;
        }
    }

    // Prepare data
    $itemData = [
        'title' => trim($input['title']),
        'description' => trim($input['description']),
        'price' => (float)$input['price'],
        'author' => trim($input['author']),
        'condition' => $input['condition'] ?? 'Good',
        'contact' => trim($input['contact']),
        'image' => trim($input['image'] ?? '')
    ];

    // Validate price
    if ($itemData['price'] <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => "Price must be greater than 0"
        ]);
        exit;
    }

    $pdo = Database::getInstance();

    // Insert new item
    $stmt = $pdo->prepare("
        INSERT INTO books 
        (title, description, price, author, `condition`, contact, image, created_at)
        VALUES (:title, :description, :price, :author, :condition, :contact, :image, NOW())
    ");

    $success = $stmt->execute($itemData);

    if ($success) {
        $itemId = $pdo->lastInsertId();
        echo json_encode([
            "success" => true,
            "message" => "Item added successfully",
            "itemId" => $itemId
        ]);
    } else {
        throw new Exception("Failed to add item to database");
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error",
        "message" => $e->getMessage(),
        "details" => $e->errorInfo ?? null
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Server error",
        "message" => $e->getMessage()
    ]);
}
?>
