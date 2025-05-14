<?php
$host = "127.0.0.1";
$user = getenv("db_user") ?: "root";
$pass = getenv("db_pass") ?: "";
$db = getenv("db_name") ?: "campus_news_db";

try {
    $dsn = "mysql:host=$host;charset=utf8mb4";
    if (isset($db)) {
        $dsn .= ";dbname=$db";
    }
    
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false, // Use real prepared statements
        PDO::MYSQL_ATTR_FOUND_ROWS => true,  // Return found rows for updates
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ];
    
    $conn = new PDO($dsn, $user, $pass, $options);
    
    // Set JSON content type header for API responses
    if (strpos($_SERVER['PHP_SELF'], '/api/') !== false) {
        header('Content-Type: application/json');
    }
} catch (PDOException $e) {
    if (strpos($_SERVER['PHP_SELF'], '/api/') !== false) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    } else {
        echo 'Database connection failed: ' . $e->getMessage();
    }
    exit;
}
?>