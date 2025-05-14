
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Create Event</title>
  <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css">
</head>
<body>
  <main class="container">
    <h1>Create Ne'w Event</h1>
    <form method="POST" action="addEvent.php">
      <label for="title">Title*</label>
      <input type="text" id="title" name="title" placeholder="Event Title" required>

      <label for="date">Date*</label>
      <input type="date" id="date" name="date" required>

      <label for="location">Location*</label>
      <input type="text" id="location" name="location" placeholder="Event Location" required>

      <label for="type">Type</label>  
      <select id="type" name="type">
        <option value="Seminar">Seminar</option>
        <option value="Workshop">Workshop</option>
        <option value="Conference">Conference</option>
      </select>

      <label for="description">Description</label>
      <textarea id="description" name="description" rows="4" placeholder="Event description..."></textarea>

      <button type="submit" name="submit">Submit</button>
      <a href="index.php" role="button" class="secondary">Cancel</a>
    </form>
  </main>

</body>
</html>

<?php 





?>