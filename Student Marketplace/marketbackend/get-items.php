<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'db.php';

try {
    $pdo = Database::getInstance();

    
    $stmt = $pdo->query("SELECT * FROM books ORDER BY id DESC");
    $items = $stmt->fetchAll();

    // Special response format (if needed)
    echo json_encode($items);

} catch (PDOException $e) {
    error_log("Error fetching items: " . $e->getMessage());
    echo json_encode([
        "error" => "Failed to fetch items",
        "message" => $e->getMessage()
    ]);
}
?>
