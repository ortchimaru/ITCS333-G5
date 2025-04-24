// Retrieve the selected note object from localStorage and parse it back into a JavaScript object
const note = JSON.parse(localStorage.getItem("selectedNote"));

// Check if a note was found in localStorage
if (note) {
  // Populate the note details page with the selected note's information
  document.getElementById("noteTitle").textContent = note.title;         // Set the title
  document.getElementById("noteCourse").textContent = note.course;       // Set the course name
  document.getElementById("noteUploader").textContent = note.uploader;   // Set the uploader's name
  document.getElementById("noteDescription").textContent = note.description; // Set the description
  document.getElementById("noteDownloads").textContent = note.downloads;     // Set the number of downloads
} else {
  // If no note is found, display an error message to the user
  document.querySelector("main").innerHTML = 
    "<p style='color:red'>⚠️ No note data found. Please go back and select a note from the list.</p>";
}
