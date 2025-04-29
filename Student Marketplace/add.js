// add.js

const API_URL = "https://680cdd0a2ea307e081d54528.mockapi.io/api/v1/marketplace";

const form = document.getElementById("itemForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Basic validation
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value.trim();
  const condition = document.getElementById("condition").value;
  
  if (title.length < 3) {
    alert("Title must be at least 3 characters.");
    return;
  }
  if (description.length < 10) {
    alert("Description must be at least 10 characters.");
    return;
  }
  if (!price || parseFloat(price) <= 0) {
    alert("Price must be greater than $0.");
    return;
  }
  if (!condition) {
    alert("Please select a condition.");
    return;
  }

  const newItem = {
    title,
    description,
    price: parseFloat(price),
    condition,
    image: "calc.jpg" // You can replace with uploaded image if you want
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });

    if (!res.ok) throw new Error("Failed to add item");

    alert("Item successfully added!");
    window.location.href = "marketplace.html"; // Redirect back to marketplace

  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
