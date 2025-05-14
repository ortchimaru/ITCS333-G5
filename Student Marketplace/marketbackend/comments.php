<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
require_once 'db.php';


$item_id = $_GET['item_id'] ?? ($_POST['item_id'] ?? null);

// Validate that item_id is provided
if (empty($item_id)) {
    echo json_encode([
        "error" => "Missing item_id",
        "message" => "Please provide a valid item_id"
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle GET request - fetch comments
    try {
        $pdo = Database::getInstance();

        $stmt = $pdo->prepare("
            SELECT * FROM comments 
            WHERE item_id = ? 
            ORDER BY created_at DESC
        ");
        $stmt->execute([$item_id]);
        $comments = $stmt->fetchAll();

        echo json_encode($comments);

    } catch (PDOException $e) {
        error_log("Error fetching comments: " . $e->getMessage());
        echo json_encode([
            "error" => "Failed to fetch comments",
            "message" => $e->getMessage()
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle POST request - add new comment
    $text = $_POST['text'] ?? '';
    $name = $_POST['name'] ?? 'Anonymous';

    // Validate that comment text is provided
    if (empty($text)) {
        echo json_encode([
            "error" => "Missing comment text",
            "message" => "Please provide a comment text"
        ]);
        exit();
    }

    try {
        $pdo = Database::getInstance();

        $stmt = $pdo->prepare("
            INSERT INTO comments 
            (item_id, text, name, created_at)
            VALUES (?, ?, ?, NOW())
        ");

        $success = $stmt->execute([
            $item_id,
            $text,
            $name
        ]);

        if ($success) {
            echo json_encode([
                "success" => true,
                "message" => "Comment added successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "error" => "Failed to add comment"
            ]);
        }

    } catch (PDOException $e) {
        error_log("Error adding comment: " . $e->getMessage());
        echo json_encode([
            "success" => false,
            "error" => "Database error",
            "message" => $e->getMessage()
        ]);
    }
}
?>
