document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get("id");

  // If in edit mode, prefill the form
  if (editId) {
    fetch(`https://f3a4bae5-c028-4757-b448-e94ff06617a5-00-3fo74n4qt75qz.pike.replit.dev/get-note.php?id=${editId}`)
      .then(res => res.json())
      .then(note => {
        if (note.error) {
          alert("❌ Failed to load note for editing.");
          return;
        }
        document.getElementById("title").value = note.title;
        document.getElementById("course").value = note.course;
        document.getElementById("description").value = note.description;
        // File input not prefilled by design
      });
  }

  // Attach submit listener
  document.getElementById("noteForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const course = document.getElementById("course").value;
    const description = document.getElementById("description").value.trim();

    // Clear previous errors
    document.getElementById("titleError").textContent = "";
    document.getElementById("courseError").textContent = "";
    document.getElementById("descriptionError").textContent = "";

    let valid = true;

    if (title === "") {
      document.getElementById("titleError").textContent = "Title is required.";
      valid = false;
    }

    if (course === "") {
      document.getElementById("courseError").textContent = "Please select a course.";
      valid = false;
    }

    if (description === "") {
      document.getElementById("descriptionError").textContent = "Description is required.";
      valid = false;
    }

    if (valid) {
      const fileInput = document.getElementById("file");
      const file_path = fileInput.files.length > 0 ? fileInput.files[0].name : null;
      const uploader = "Anonymous"; // can be dynamic later

      const noteData = {
        title,
        course,
        description,
        uploader,
        file_path
      };

      // Determine whether to POST or PUT
      const method = editId ? "PUT" : "POST";
      const endpoint = `https://f3a4bae5-c028-4757-b448-e94ff06617a5-00-3fo74n4qt75qz.pike.replit.dev/notes.php${editId ? `?id=${editId}` : ""}`;

      fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(noteData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            alert(editId ? "✅ Note updated successfully!" : "✅ Note created successfully!");
            window.location.href = "Main Page.html";
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
});
