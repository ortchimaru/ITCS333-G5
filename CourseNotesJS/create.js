// Attach a submit event listener to the form with ID "noteForm"
document.getElementById("noteForm").addEventListener("submit", function(event) {
    // Prevent the default form submission behavior (page reload)
    event.preventDefault();
  
    // Get the values entered by the user, trimming whitespace for title and description
    const title = document.getElementById("title").value.trim();
    const course = document.getElementById("course").value;
    const description = document.getElementById("description").value.trim();
  
    // Clear previous error messages before validating again
    document.getElementById("titleError").textContent = "";
    document.getElementById("courseError").textContent = "";
    document.getElementById("descriptionError").textContent = "";
  
    // Assume form is valid at the start
    let valid = true;
  
    // Validate title input — show error if empty
    if (title === "") {
      document.getElementById("titleError").textContent = "Title is required.";
      valid = false;
    }
  
    // Validate course selection — show error if no course is selected
    if (course === "") {
      document.getElementById("courseError").textContent = "Please select a course.";
      valid = false;
    }
  
    // Validate description input — show error if empty
    if (description === "") {
      document.getElementById("descriptionError").textContent = "Description is required.";
      valid = false;
    }
  
    // If all fields are valid, show a success alert (simulation only — no data submission happens)
    if (valid) {
      alert("✅ Form is valid! (But not actually submitted.)");
    }
  });
  