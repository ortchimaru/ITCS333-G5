<?php
require_once 'config.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$news = null;
$message = '';
$error = '';

// Fetch the news item
if ($id > 0) {
    try {
        $stmt = $conn->prepare("SELECT * FROM news WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $news = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        $error = $e->getMessage();
    }
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit'])) {
    try {
        $title = trim($_POST['title']);
        $content = trim($_POST['content']);
        $image_url = trim($_POST['image_url']);
        
        if (empty($title) || empty($content) || empty($image_url)) {
            $error = 'All fields are required';
        } else {
            $stmt = $conn->prepare("UPDATE news SET title = :title, content = :content, image_url = :image_url WHERE id = :id");
            $stmt->bindValue(':title', $title);
            $stmt->bindValue(':content', $content);
            $stmt->bindValue(':image_url', $image_url);
            $stmt->bindValue(':id', $id);
            $stmt->execute();
            
            $message = 'News updated successfully!';
            
            // Refresh news data
            $stmt = $conn->prepare("SELECT * FROM news WHERE id = :id");
            $stmt->bindValue(':id', $id);
            $stmt->execute();
            $news = $stmt->fetch(PDO::FETCH_ASSOC);
        }
    } catch (PDOException $e) {
        $error = $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Edit News | Campus News</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
    <link rel="stylesheet" href="css/style.css" />
    <style>
        .preview-image {
            max-width: 300px;
            max-height: 200px;
            margin-top: 10px;
        }
        .message {
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <main class="container">
        <nav>
            <ul>
                <li><a href="index.html">&larr; Back to News List</a></li>
                <?php if ($news): ?>
                <li><a href="detail.php?id=<?= $id ?>">View News</a></li>
                <?php endif; ?>
            </ul>
        </nav>

        <h1>Edit News</h1>

        <?php if (!$news && $id > 0): ?>
            <div class="error message">News item not found.</div>
            <a href="index.html" role="button">Back to News List</a>
        <?php else: ?>
            <?php if ($message): ?>
                <div class="success message"><?= htmlspecialchars($message) ?></div>
            <?php endif; ?>
            
            <?php if ($error): ?>
                <div class="error message"><?= htmlspecialchars($error) ?></div>
            <?php endif; ?>

            <form method="post">
                <div class="grid">
                    <label for="title">
                        Title
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            value="<?= htmlspecialchars($news['title'] ?? '') ?>" 
                            required
                        >
                    </label>
                </div>
                
                <div class="grid">
                    <label for="content">
                        Content
                        <textarea 
                            id="content" 
                            name="content" 
                            rows="10" 
                            required
                        ><?= htmlspecialchars($news['content'] ?? '') ?></textarea>
                    </label>
                </div>
                
                <div class="grid">
                    <label for="image_url">
                        Image URL
                        <input 
                            type="url" 
                            id="image_url" 
                            name="image_url" 
                            value="<?= htmlspecialchars($news['image_url'] ?? '') ?>" 
                            required
                        >
                    </label>
                </div>
                
                <?php if (!empty($news['image_url'])): ?>
                    <div class="grid">
                        <div>
                            <label>Current Image</label>
                            <img src="<?= htmlspecialchars($news['image_url']) ?>" alt="Current Image" class="preview-image">
                        </div>
                    </div>
                <?php endif; ?>
                
                <div class="grid">
                    <div>
                        <button type="submit" name="submit">Update News</button>
                        <a href="index.html" role="button" class="secondary">Cancel</a>
                    </div>
                </div>
            </form>
        <?php endif; ?>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Image preview functionality
            const imageUrlInput = document.getElementById('image_url');
            const previewContainer = document.querySelector('.grid:nth-child(4)');
            
            if (imageUrlInput && previewContainer) {
                imageUrlInput.addEventListener('input', function() {
                    const url = this.value.trim();
                    
                    // Remove existing preview if the URL is cleared
                    if (!url && previewContainer.querySelector('.preview-container')) {
                        previewContainer.removeChild(previewContainer.querySelector('.preview-container'));
                    }
                    
                    // Create or update preview
                    if (url) {
                        let previewDiv = previewContainer.querySelector('.preview-container');
                        
                        if (!previewDiv) {
                            previewDiv = document.createElement('div');
                            previewDiv.className = 'preview-container';
                            previewDiv.innerHTML = '<label>Image Preview</label>';
                            const img = document.createElement('img');
                            img.className = 'preview-image';
                            previewDiv.appendChild(img);
                            previewContainer.appendChild(previewDiv);
                        }
                        
                        const previewImg = previewDiv.querySelector('img');
                        previewImg.src = url;
                        previewImg.alt = 'Preview';
                    }
                });
            }
        });
    </script>
</body>
</html>
