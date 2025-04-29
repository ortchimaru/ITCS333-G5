// view.js

const API_URL = "https://680cdd0a2ea307e081d54528.mockapi.io/api/v1/marketplace";
const itemDetails = document.getElementById("itemDetails");

function getURLParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

async function fetchItemDetails() {
  const id = getURLParam("id");
  if (!id) {
    itemDetails.innerHTML = "<p style='color: red;'>No item ID provided.</p>";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch item");

    const item = await res.json();

    itemDetails.innerHTML = `
      <article>
        <img src="${item.image || 'calc.jpg'}" alt="Item Image" />
        <h2>${item.title}</h2>
        <p><strong>Condition:</strong> ${item.condition || 'N/A'}</p>
        <p><strong>Price:</strong> $${item.price}</p>
        <p>${item.description}</p>
        <div style="margin-top: 1rem;">
          <button id="editItem" class="button">Edit</button>
          <button id="deleteItem" class="button secondary">Delete</button>
        </div>
      </article>
    `;

    setupEditAndDelete(item);
    
  } catch (error) {
    itemDetails.innerHTML = `<p style="color: red;">${error.message}</p>`;
  }
}

function setupEditAndDelete(item) {
  const editButton = document.getElementById("editItem");
  const deleteButton = document.getElementById("deleteItem");

  editButton.addEventListener("click", () => {
    itemDetails.innerHTML = `
      <form id="editForm" class="container">
        <h2>Edit Item</h2>

        <label>Title</label>
        <input type="text" id="editTitle" value="${item.title}" required />

        <label>Description</label>
        <textarea id="editDescription" rows="4" required>${item.description}</textarea>

        <label>Price ($)</label>
        <input type="number" id="editPrice" value="${item.price}" min="0" required />

        <label>Condition</label>
        <select id="editCondition" required>
          <option value="new" ${item.condition === "new" ? "selected" : ""}>New</option>
          <option value="like-new" ${item.condition === "like-new" ? "selected" : ""}>Like New</option>
          <option value="used" ${item.condition === "used" ? "selected" : ""}>Used</option>
          <option value="fair" ${item.condition === "fair" ? "selected" : ""}>Fair</option>
        </select>

        <button type="submit" class="primary">Save Changes</button>
        <a href="view-item.html?id=${item.id}" class="button secondary">Cancel</a>
      </form>
    `;

    document.getElementById("editForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const updatedItem = {
        title: document.getElementById("editTitle").value,
        description: document.getElementById("editDescription").value,
        price: parseFloat(document.getElementById("editPrice").value),
        condition: document.getElementById("editCondition").value,
        image: item.image // Keep the old image
      };

      try {
        const res = await fetch(`${API_URL}/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedItem)
        });

        if (!res.ok) throw new Error("Failed to update item");

        alert("Item updated successfully!");
        window.location.href = `view-item.html?id=${item.id}`;

      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  });

  deleteButton.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await fetch(`${API_URL}/${item.id}`, {
          method: "DELETE"
        });

        if (!res.ok) throw new Error("Failed to delete item");

        alert("Item deleted successfully!");
        window.location.href = "marketplace.html";

      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  });
}

fetchItemDetails();
