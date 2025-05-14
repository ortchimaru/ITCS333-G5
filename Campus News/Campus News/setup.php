<?php
    $host = "127.0.0.1";
    $user = getenv("db_user") ?: "root";
    $pass = getenv("db_pass") ?: "";
    $db = getenv("db_name") ?: "campus_news_db";

    try {
        // Connect to MySQL without selecting a database
        $conn = new mysqli($host, $user, $pass);
        
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Set character set
        $conn->set_charset("utf8mb4");
        
        // Create database if it doesn't exist
        if (!$conn->query("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")) {
            die("Database creation failed: " . $conn->error);
        }
        echo "Database created or already exists<br>";
        
        // Select the database
        $conn->select_db($db);
        
        // Create news table with explicit ENGINE setting for MariaDB
        $sql = "CREATE TABLE IF NOT EXISTS `news` (
            `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `title` VARCHAR(255) NOT NULL,
            `content` TEXT NOT NULL,
            `image_url` VARCHAR(255) NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        if (!$conn->query($sql)) {
            die("Table creation failed: " . $conn->error);
        }
        echo "Table 'news' created or already exists<br>";
        
        // Check if table is empty
        $result = $conn->query("SELECT COUNT(*) as count FROM news");
        $row = $result->fetch_assoc();
        if ($row['count'] == 0) {
            // Use prepared statements for sample data
            $stmt = $conn->prepare("INSERT INTO news (title, content, image_url) VALUES (?, ?, ?)");
            if (!$stmt) {
                die("Prepare failed: " . $conn->error);
            }
            
            // Sample news items
            $sampleData = [
                [
                    'Campus Library Extends Hours During Finals Week', 
                    'The university library will extend its hours to 24/7 during the final examination period starting next week. Students are encouraged to utilize the quiet study spaces and group project rooms. Refreshments will be provided at midnight each day.',
                    'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1000'
                ],
                [
                    'Computer Science Department Hosts Annual Hackathon', 
                    'The Computer Science Department is excited to announce its annual hackathon taking place next month. Students from all disciplines are welcome to participate in this 48-hour coding marathon. Prizes include internship opportunities and the latest tech gadgets.',
                    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000'
                ],
                [
                    'New Student Wellness Center Opening Ceremony', 
                    'The much-anticipated Student Wellness Center will officially open its doors next Monday. The state-of-the-art facility includes a fitness center, meditation rooms, counseling services, and a health clinic. All students are invited to the ribbon-cutting ceremony.',
                    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000'
                ]
            ];
            
            $stmt->bind_param('sss', $title, $content, $image);
            
            foreach ($sampleData as $item) {
                $title = $item[0];
                $content = $item[1];
                $image = $item[2];
                
                if (!$stmt->execute()) {
                    echo "Error inserting sample data: " . $stmt->error . "<br>";
                }
            }
            
            $stmt->close();
            echo "Sample news items inserted<br>";
        } else {
            echo "Table already contains data<br>";
        }
        
        echo "Setup completed successfully!";
    } catch (Exception $e) {
        die("Error: " . $e->getMessage());
    }

    $conn->close();
?>
