
const API_URL = "https://680cdd0a2ea307e081d54528.mockapi.io/api/v1/marketplace";
const ITEMS_PER_PAGE = 4;

const getElement = (selector) => document.querySelector(selector);
const getURLParam = (param) => new URLSearchParams(window.location.search).get(param);


async function fetchItems() {
  const itemsList = getElement("#itemsList");
  if (!itemsList) return;

  itemsList.innerHTML = "<p>Loading items...</p>";
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch items");
    const data = await res.json();
    window.allItems = data;
    renderItems();
  } catch (error) {
    itemsList.innerHTML = `<p style='color: red;'>${error.message}</p>`;
  }
}

function renderItems() {
  const searchInput = getElement("#searchInput");
  const sortSelect = getElement("#sortSelect");
  const itemsList = getElement("#itemsList");
  const prevPageBtn = getElement("#prevPage");
  const nextPageBtn = getElement("#nextPage");

  if (!window.allItems) return;

  let filtered = window.allItems.filter(item =>
    item.title.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  if (sortSelect.value === "price") {
    filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortSelect.value === "title") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  const start = (window.currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  itemsList.innerHTML = "";

  if (filtered.length === 0) {
    itemsList.innerHTML = "<p>No items found.</p>";
    return;
  }

  paginated.forEach(item => {
    const article = document.createElement("article");
    article.innerHTML = `
      <img src="${item.image || 'calc.jpg'}" alt="${item.title}" />
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <strong>$${item.price}</strong>
      <a href="view-item.html?id=${item.id}" class="button primary">View Details</a>
    `;
    itemsList.appendChild(article);
  });

  prevPageBtn.disabled = window.currentPage === 1;
  nextPageBtn.disabled = start + ITEMS_PER_PAGE >= filtered.length;
}

function setupMarketplacePage() {
  if (!getElement("#itemsList")) return;

  window.currentPage = 1;

  getElement("#searchInput").addEventListener("input", () => {
    window.currentPage = 1;
    renderItems();
  });

  getElement("#sortSelect").addEventListener("change", () => {
    window.currentPage = 1;
    renderItems();
  });

  getElement("#prevPage").addEventListener("click", () => {
    if (window.currentPage > 1) {
      window.currentPage--;
      renderItems();
    }
  });

  getElement("#nextPage").addEventListener("click", () => {
    window.currentPage++;
    renderItems();
  });

  fetchItems();
}


async function fetchItemDetails() {
  const itemDetails = getElement("#itemDetails");
  if (!itemDetails) return;

  const id = getURLParam("id");
  if (!id) {
    itemDetails.innerHTML = "<p style='color: red;'>No item ID provided.</p>";
    return;
  }

  itemDetails.innerHTML = "<p>Loading item...</p>";

  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch item");
    const item = await res.json();

    itemDetails.innerHTML = `
      <article>
        <img src="${item.image || 'calc.jpg'}" alt="Item Image" />
        <h2>${item.title}</h2>
        <p><strong>Condition:</strong> ${item.condition}</p>
        <p><strong>Price:</strong> $${item.price}</p>
        <p>${item.description}</p>
      </article>
    `;
  } catch (error) {
    itemDetails.innerHTML = `<p style='color: red;'>${error.message}</p>`;
  }
}

function setupFormValidation() {
  const form = getElement("#itemForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = getElement("#title").value.trim();
    const description = getElement("#description").value.trim();
    const price = getElement("#price").value.trim();
    const condition = getElement("#condition").value;

    if (title.length < 3) return alert("Title must be at least 3 characters.");
    if (description.length < 10) return alert("Description must be at least 10 characters.");
    if (!price || parseFloat(price) <= 0) return alert("Price must be greater than $0.");
    if (!condition) return alert("Please select a condition.");

    const newItem = {
      title,
      description,
      price: parseFloat(price),
      condition,
      image: "calc.jpg"
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });

      if (!res.ok) throw new Error("Failed to add item");
      alert("Item successfully added!");
      window.location.href = "marketplace.html";
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
}


setupMarketplacePage();
fetchItemDetails();
setupFormValidation();
