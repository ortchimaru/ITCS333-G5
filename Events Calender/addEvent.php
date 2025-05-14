<?php
include 'db.php';


if($_SERVER['REQUEST_METHOD'] === 'POST')
{
  
    $title = $_POST['title'];
    $date = $_POST['date'];
    $location = $_POST['location'];
    $type = $_POST['type'];
    $description = $_POST['description'];

  try
  {
     $sql = "Insert into events (title, date, location, type, description) values ('$title', '$date', '$location', '$type','$description')";
     $conn->exec($sql);
    header("Location: index.php");
  }catch (PDOException $e)
  {
    echo $sql . "<br>" . $e->getMessage();
  }

}

    

?>