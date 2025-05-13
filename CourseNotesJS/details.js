document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML = "<p style='color:red'>❌ Missing note ID.</p>";
    return;
  }

  fetch(`https://coursenotes.ortchimaru1.repl.co/get-note.php?id=${id}`)
    .then(res => res.json())
    .then(note => {
      if (note.error) {
        document.body.innerHTML = `<p style='color:red'>❌ ${note.error}</p>`;
        return;
      }

      document.getElementById("noteTitle").textContent = note.title;
      document.getElementById("noteCourse").textContent = note.course;
      document.getElementById("noteUploader").textContent = note.uploader;
      document.getElementById("noteDescription").textContent = note.description;
      document.getElementById("noteDownloads").textContent = note.downloads;
      document.getElementById("noteFile").href = `files/${note.file_path}`;

      loadComments(id);
    });

  function loadComments(noteId) {
    fetch(`https://coursenotes.ortchimaru1.repl.co/comment.php?note_id=${noteId}`)
      .then(res => res.json())
      .then(comments => {
        const container = document.getElementById("commentsList");
        container.innerHTML = "";

        if (!comments.length) {
          container.innerHTML = "<p>No comments yet.</p>";
          return;
        }

        comments.forEach(comment => {
          const div = document.createElement("div");
          div.innerHTML = `
            <p>${comment.content}</p>
            <small>${comment.created_at}</small>
            <hr>
          `;
          container.appendChild(div);
        });
      });
  }

  // Handle comment submission
  document.getElementById("commentForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const content = document.getElementById("commentContent").value.trim();
    if (content === "") return;

    fetch("https://coursenotes.ortchimaru1.repl.co/comment.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ note_id: id, content })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          document.getElementById("commentContent").value = "";
          loadComments(id);
        } else {
          alert("❌ Failed to add comment.");
        }
      });
  });
});
