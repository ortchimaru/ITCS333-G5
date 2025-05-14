<?php

class Database {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        
        $host = 'localhost';
        $dbname = 'ayoub'; 
        $username = 'user1';
        $password = '05055729388'; 

        try {
            $this->pdo = new PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                ]
            );

            // Test connection
            $this->pdo->query("SELECT 1");
        } catch (PDOException $e) {
            // Secure error handling (no credentials exposed)
            error_log("DB Error: " . $e->getMessage());
            die(json_encode([
                "error" => "Database connection failed",
                "message" => "Check server logs for details"
            ]));
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance->pdo;
    }
}
?>