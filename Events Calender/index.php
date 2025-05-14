<?php
// events.php
require 'db.php';

$perPage = 6; // Events per page
$page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int) $_GET['page'] : 1;
$offset = ($page - 1) * $perPage;

try {
  // Count total events
  $countStmt = $conn->query("SELECT COUNT(*) FROM events");
  $totalEvents = $countStmt->fetchColumn();
  $totalPages = ceil($totalEvents / $perPage);

  // Fetch current page events
  $stmt = $conn->prepare("SELECT * FROM events ORDER BY date DESC LIMIT :limit OFFSET :offset");
  $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
  $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
  $stmt->execute();
  $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
  die("Error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>All Events</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-5">
    <h1 class="mb-4">All Events</h1>

    <a href="create.php" class="btn btn-success mb-3">+ Add New Event</a>

    <?php if (count($events) > 0): ?>
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <?php foreach ($events as $event): ?>
          <div class="col">
            <div class="card h-100">
              <div class="card-header bg-primary text-white">
                <h5 class="card-title"><?= htmlspecialchars($event['title']) ?></h5>
              </div>
              <div class="card-body">
                <p class="card-text">
                  <strong>Date:</strong> <?= htmlspecialchars($event['date']) ?><br>
                  <strong>Location:</strong> <?= htmlspecialchars($event['location']) ?><br>
                  <strong>Type:</strong> <?= htmlspecialchars($event['type']) ?><br>
                  <strong>Description:</strong> <?= htmlspecialchars($event['description']) ?>
                </p>
              </div>
              <div class="card-footer">
                <a href="update.php?id=<?= $event['id'] ?>" class="btn btn-sm btn-primary">Edit</a>
                <a href="delete.php?id=<?= $event['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Delete this event?');">Delete</a>
                <a href="viewdetails.php?id=<?= $event['id'] ?>" class="btn btn-sm btn-info">View Details</a>
              </div>
            </div>
          </div>
        <?php endforeach ?>
      </div>

      <!-- Pagination -->
      <nav class="mt-4">
        <ul class="pagination justify-content-center">
          <?php if ($page > 1): ?>
            <li class="page-item">
              <a class="page-link" href="?page=<?= $page - 1 ?>">Previous</a>
            </li>
          <?php endif; ?>

          <?php for ($i = 1; $i <= $totalPages; $i++): ?>
            <li class="page-item <?= ($i === $page) ? 'active' : '' ?>">
              <a class="page-link" href="?page=<?= $i ?>"><?= $i ?></a>
            </li>
          <?php endfor; ?>

          <?php if ($page < $totalPages): ?>
            <li class="page-item">
              <a class="page-link" href="?page=<?= $page + 1 ?>">Next</a>
            </li>
          <?php endif; ?>
        </ul>
      </nav>

    <?php else: ?>
      <div class="alert alert-warning">No events found.</div>
    <?php endif ?>
  </div>
</body>
</html>
