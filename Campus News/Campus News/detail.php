<?php
require_once 'config.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$news = null;
$error = null;

if ($id > 0) {
    try {
        $stmt = $conn->prepare("SELECT * FROM news WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $news = $stmt->fetch();
        
        if (!$news) {
            $error = "News item not found";
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
    <title><?= $news ? htmlspecialchars($news['title']) : 'News Details' ?> | Campus News</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
    <link rel="stylesheet" href="css/style.css" />
    <style>
        .news-detail {
            max-width: 900px;
            margin: 0 auto;
        }
        .news-detail img {
            max-width: 100%;
            max-height: 500px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        .news-meta {
            color: #666;
            margin: 1rem 0;
        }
        .news-content {
            line-height: 1.8;
            margin-top: 2rem;
            white-space: pre-line;
        }
        .actions {
            margin-top: 2rem;
            display: flex;
            gap: 1rem;
        }
        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 2rem 0;
        }
    </style>
</head>
<body>
    <main class="container">
        <nav>
            <ul>
                <li><a href="index.html">&larr; Back to News List</a></li>
            </ul>
        </nav>

        <?php if ($error): ?>
            <div class="error-message">
                <h2>Error</h2>
                <p><?= htmlspecialchars($error) ?></p>
                <a href="index.html" role="button">Back to News List</a>
            </div>
        <?php elseif ($news): ?>
            <article class="news-detail">
                <h1><?= htmlspecialchars($news['title']) ?></h1>
                <div class="news-meta">
                    Published: <?= date('F j, Y', strtotime($news['created_at'])) ?>
                </div>
                <img src="<?= htmlspecialchars($news['image_url']) ?>" alt="<?= htmlspecialchars($news['title']) ?>" />
                <div class="news-content">
                    <?= nl2br(htmlspecialchars($news['content'])) ?>
                </div>
                <div class="actions">
                    <a href="index.html" role="button" class="secondary">Back to News</a>
                    <a href="edit.php?id=<?= $news['id'] ?>" role="button">Edit News</a>
                </div>
            </article>
        <?php else: ?>
            <div class="container">
                <h2>News Not Found</h2>
                <p>Sorry, the news article you're looking for doesn't exist or has been removed.</p>
                <a href="index.html" role="button">Back to News List</a>
            </div>
        <?php endif; ?>
    </main>
</body>
</html>
