document.addEventListener("DOMContentLoaded", () => {
  const notesContainer = document.getElementById("notesContainer");
  const searchInput = document.getElementById("searchInput");
  const courseFilter = document.getElementById("courseFilter");
  const sortOption = document.getElementById("sortOption");
  const paginationControls = document.getElementById("paginationControls");

  let currentPage = 1;
  const limit = 3;

  function fetchNotes() {
    const search = searchInput.value.trim();
    const course = courseFilter.value;
    const sort = sortOption.value;

    let url = `../CourseNotesPHP/notes.php?page=${currentPage}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (course) url += `&course=${encodeURIComponent(course)}`;
    if (sort) url += `&sort=${encodeURIComponent(sort)}`;

    fetch(url)
      .then(res => res.json())
      .then(notes => {
        renderNotes(notes);
        renderPagination(notes.length);
      })
      .catch(error => {
        console.error("Fetch error:", error);
        notesContainer.innerHTML = `<p>❌ Failed to load notes: ${error.message}</p>`;
      });
  }

  function renderNotes(notes) {
    notesContainer.innerHTML = "";

    if (!Array.isArray(notes) || notes.length === 0) {
      notesContainer.innerHTML = "<p>📭 No notes found.</p>";
      return;
    }

    notes.forEach(note => {
      const article = document.createElement("article");
      article.innerHTML = `
        <h3><a href="Details.html?id=${note.id}">${note.title}</a></h3>
        <ul>
          <li><strong>Course:</strong> ${note.course}</li>
          <li><strong>Uploader:</strong> ${note.uploader}</li>
          <li><strong>Description:</strong> ${note.description}</li>
          <li><strong>Downloads:</strong> ${note.downloads}</li>
          <li><strong>Date:</strong> ${note.created_at}</li>
        </ul>
      `;
      notesContainer.appendChild(article);
    });
  }

  function renderPagination(noteCount) {
    paginationControls.innerHTML = `
      <button ${currentPage === 1 ? "disabled" : ""} id="prevBtn">← Prev</button>
      <span> Page ${currentPage} </span>
      <button ${noteCount < limit ? "disabled" : ""} id="nextBtn">Next →</button>
    `;

    document.getElementById("prevBtn").onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        fetchNotes();
      }
    };

    document.getElementById("nextBtn").onclick = () => {
      if (noteCount === limit) {
        currentPage++;
        fetchNotes();
      }
    };
  }

  // Listeners for filters
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    fetchNotes();
  });

  courseFilter.addEventListener("change", () => {
    currentPage = 1;
    fetchNotes();
  });

  sortOption.addEventListener("change", () => {
    currentPage = 1;
    fetchNotes();
  });

  fetchNotes();
});