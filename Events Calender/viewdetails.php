<?php
require 'db.php';

if (!isset($_GET['id'])) {
  die('Event ID is missing.');
}

$id = $_GET['id'];

try {
  $stmt = $conn->prepare("SELECT * FROM events WHERE id = ?");
  $stmt->execute([$id]);
  $event = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$event) {
    die("Event not found.");
  }
} catch (PDOException $e) {
  die("Error fetching event: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Event Details</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-5">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h2><?= htmlspecialchars($event['title']) ?></h2>
      </div>
      <div class="card-body">
        <p><strong>Date:</strong> <?= htmlspecialchars($event['date']) ?></p>
        <p><strong>Location:</strong> <?= htmlspecialchars($event['location']) ?></p>
        <p><strong>Type:</strong> <?= htmlspecialchars($event['type']) ?></p>
        <p><strong>Description:</strong><br><?= nl2br(htmlspecialchars($event['description'])) ?></p>
      </div>
      <div class="card-footer">
        <a href="index.php" class="btn btn-secondary">Back to Events</a>
        <a href="update.php?id=<?= $event['id'] ?>" class="btn btn-primary">Edit</a>
        <a href="delete.php?id=<?= $event['id'] ?>" class="btn btn-danger" onclick="return confirm('Are you sure?')">Delete</a>
      </div>
    </div>
  </div>
</body>
</html>
