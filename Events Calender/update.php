<?php
include 'db.php';

if (!isset($_GET['id'])) {
  die('Event ID is missing.');
}

$id = $_GET['id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Update the event
  $title = $_POST['title'];
  $date = $_POST['date'];
  $location = $_POST['location'];
  $type = $_POST['type'];
  $description = $_POST['description'];

  try {
    $stmt = $conn->prepare("UPDATE events SET title = ?, date = ?, location = ?, type = ?, description = ? WHERE id = ?");
    $stmt->execute([$title, $date, $location, $type, $description, $id]);
    header("Location: index.php");
    exit;
  } catch (PDOException $e) {
    echo "Error updating event: " . $e->getMessage();
  }
} else {
  // Load the event data
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
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Update Event</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-5">
    <h1>Edit Event</h1>
    <form method="POST">
      <div class="mb-3">
        <label for="title" class="form-label">Title*</label>
        <input type="text" id="title" name="title" class="form-control" value="<?= htmlspecialchars($event['title']) ?>" required>
      </div>

      <div class="mb-3">
        <label for="date" class="form-label">Date*</label>
        <input type="date" id="date" name="date" class="form-control" value="<?= $event['date'] ?>" required>
      </div>

      <div class="mb-3">
        <label for="location" class="form-label">Location*</label>
        <input type="text" id="location" name="location" class="form-control" value="<?= htmlspecialchars($event['location']) ?>" required>
      </div>

      <div class="mb-3">
        <label for="type" class="form-label">Type</label>
        <select id="type" name="type" class="form-select">
          <option value="Seminar" <?= $event['type'] === 'Seminar' ? 'selected' : '' ?>>Seminar</option>
          <option value="Workshop" <?= $event['type'] === 'Workshop' ? 'selected' : '' ?>>Workshop</option>
          <option value="Conference" <?= $event['type'] === 'Conference' ? 'selected' : '' ?>>Conference</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea id="description" name="description" class="form-control" rows="4"><?= htmlspecialchars($event['description']) ?></textarea>
      </div>

      <button type="submit" class="btn btn-primary">Update</button>
      <a href="index.php" class="btn btn-secondary">Cancel</a>
    </form>
  </div>
</body>
</html>
