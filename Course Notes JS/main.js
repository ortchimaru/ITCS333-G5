// Get references to HTML elements needed for filtering and displaying notes
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");
const sortOption = document.getElementById("sortOption");

// Variables for storing data and pagination state
let allNotes = [];
let currentPage = 1;
const notesPerPage = 3; // Only show 3 notes per page

// Fetch the notes JSON file from GitHub
fetch("https://raw.githubusercontent.com/ortchimaru/Notes-Data/refs/heads/main/notes.json")
  .then(response => {
    // Handle fetch errors
    if (!response.ok) {
      throw new Error("Failed to fetch notes. Please try again later.");
    }
    return response.json(); // Parse JSON if response is okay
  })
  .then(data => {
    // Store the fetched notes and apply filters (render first time)
    allNotes = data;
    applyFilters();
  })
  .catch(error => {
    // Show an error message if fetch fails
    notesContainer.innerHTML = `<p style="color:red">${error.message}</p>`;
  });

/**
 * Display notes for the current page.
 * Each note is displayed in an article element with title, course, uploader, etc.
 */
function renderNotes(notes) {
  const start = (currentPage - 1) * notesPerPage;
  const end = start + notesPerPage;
  const paginated = notes.slice(start, end); // Get notes for current page

  notesContainer.innerHTML = ""; // Clear previous notes

  paginated.forEach(note => {
    const article = document.createElement("article");
    article.style.marginBottom = "2rem";
    article.innerHTML = `
      <h3><a href="Details.html" data-id="${note.id}" class="note-link">${note.title}</a></h3>
      <ul>
        <li><strong>Course:</strong> ${note.course}</li>
        <li><strong>Uploaded by:</strong> ${note.uploader}</li>
        <li><strong>Description:</strong> ${note.description}</li>
        <li><strong>Downloads:</strong> ${note.downloads}</li>
      </ul>
    `;
    notesContainer.appendChild(article);
  });

  // Store the selected note in localStorage when a title link is clicked
  document.querySelectorAll(".note-link").forEach(link => {
    link.addEventListener("click", function () {
      const noteId = this.getAttribute("data-id");
      const selectedNote = notes.find(note => note.id === noteId);
      localStorage.setItem("selectedNote", JSON.stringify(selectedNote));
    });
  });
}

/**
 * Display pagination links and handle page switching
 */
function renderPagination(notes) {
  const pageCount = Math.ceil(notes.length / notesPerPage);
  const nav = document.querySelector("nav[aria-label='Pagination']");
  nav.innerHTML = "";

  const ul = document.createElement("ul");

  // Previous page button
  const prevLi = document.createElement("li");
  prevLi.innerHTML = `<a href="#">← Prev</a>`;
  prevLi.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      applyFilters();
    }
  };
  ul.appendChild(prevLi);

  // Page number buttons
  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    if (i === currentPage) {
      li.innerHTML = `<strong>${i}</strong>`;
    } else {
      li.innerHTML = `<a href="#">${i}</a>`;
      li.onclick = () => {
        currentPage = i;
        applyFilters();
      };
    }
    ul.appendChild(li);
  }

  // Next page button
  const nextLi = document.createElement("li");
  nextLi.innerHTML = `<a href="#">Next →</a>`;
  nextLi.onclick = () => {
    if (currentPage < pageCount) {
      currentPage++;
      applyFilters();
    }
  };
  ul.appendChild(nextLi);

  nav.appendChild(ul);
}

/**
 * Filter notes based on search, course, and sort option
 * Then render filtered notes and pagination
 */
function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCourse = courseFilter.value;
  const selectedSort = sortOption.value;

  // Filter notes by title and course
  let filtered = allNotes.filter(note => {
    const titleMatch = note.title.toLowerCase().includes(searchText);
    const courseMatch = selectedCourse ? note.course === selectedCourse : true;
    return titleMatch && courseMatch;
  });

  // Sort notes by newest (using id as proxy)
  if (selectedSort === "newest") {
    for (let i = 0; i < filtered.length - 1; i++) {
      for (let j = 0; j < filtered.length - i - 1; j++) {
        if (filtered[j].id < filtered[j + 1].id) {
          let temp = filtered[j];
          filtered[j] = filtered[j + 1];
          filtered[j + 1] = temp;
        }
      }
    }
  }

  // Sort notes by number of downloads
  if (selectedSort === "downloads") {
    for (let i = 0; i < filtered.length - 1; i++) {
      for (let j = 0; j < filtered.length - i - 1; j++) {
        if (filtered[j].downloads < filtered[j + 1].downloads) {
          let temp = filtered[j];
          filtered[j] = filtered[j + 1];
          filtered[j + 1] = temp;
        }
      }
    }
  }

  renderPagination(filtered); // Update pagination
  renderNotes(filtered);     // Show filtered notes
}

// Event listeners to re-apply filters on user input
searchInput.addEventListener("input", () => {
  currentPage = 1;
  applyFilters();
});
courseFilter.addEventListener("change", () => {
  currentPage = 1;
  applyFilters();
});
sortOption.addEventListener("change", () => {
  currentPage = 1;
  applyFilters();
});