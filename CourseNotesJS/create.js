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
      // Optional file input
      const fileInput = document.getElementById("file");
      const file_path = fileInput.files.length > 0 ? fileInput.files[0].name : null;
      const uploader = "Anonymous"; // You can make this dynamic later
    
      // Prepare note data
      const noteData = {
        title,
        course,
        description,
        uploader,
        file_path
      };
    
      // Send POST request to your backend
        fetch("https://f3a4bae5-c028-4757-b448-e94ff06617a5-00-3fo74n4qt75qz.pike.replit.dev/notes.php", {

        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(noteData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            alert("✅ Note created successfully!");
            document.getElementById("noteForm").reset();
          } else {
            alert("❌ Error: " + data.error);
          }
        })
        .catch(error => {
          alert("❌ Request failed. See console.");
          console.error("Fetch error:", error);
        });
    }
    
});
