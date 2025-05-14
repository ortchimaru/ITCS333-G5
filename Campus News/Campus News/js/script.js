document.addEventListener('DOMContentLoaded', function() {
  const newsForm = document.getElementById('newsForm');
  const newsList = document.getElementById('newsList');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const pagination = document.getElementById('pagination');

  const modal = document.getElementById('modal');
  const overlay = document.getElementById('overlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalContent = document.getElementById('modalContent');

  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const imageInput = document.getElementById('imageUrl');

  const ITEMS_PER_PAGE = 3;
  let currentPage = 1;
  let allNews = [];
  let editId = null;

  // Fetch news from API
  async function fetchNews(search = '') {
    try {
      let url = 'api/readNews.php';
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      allNews = data;
      renderNews();
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to load news. Please try again later.');
      loadFromLocalStorage(); // Fallback to localStorage if API fails
    }
  }

  // Save to localStorage as backup
  function saveToLocalStorage() {
    localStorage.setItem('campusNews', JSON.stringify(allNews));
  }

  // Load from localStorage as backup
  function loadFromLocalStorage() {
    const stored = localStorage.getItem('campusNews');
    if (stored) {
      allNews = JSON.parse(stored);
      renderNews();
    }
  }

  function renderNews() {
    const searchQuery = searchInput.value.toLowerCase();
    let filtered = allNews.filter(item => 
      item.title && item.title.toLowerCase().includes(searchQuery)
    );

    if (sortSelect.value === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered.sort((a, b) => {
        const dateA = a.created_at || a.date || '';
        const dateB = b.created_at || b.date || '';
        return new Date(dateB) - new Date(dateA);
      });
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

    newsList.innerHTML = '';
    
    if (paginated.length === 0) {
      newsList.innerHTML = '<p>No news items found.</p>';
      return;
    }
    
    paginated.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'news-item';
      const imageUrl = item.image_url || item.image || '';
      const newsId = item.id || 0;
      
      div.innerHTML = `
        <img src="${imageUrl}" alt="News Image" />
        <h3>${item.title}</h3>
        <p>${item.content ? item.content.substring(0, 100) + '...' : ''}</p>
        <div class="action-buttons">
          <a href="detail.php?id=${newsId}" class="button" role="button">Read More</a>
          <a href="edit.php?id=${newsId}" class="button secondary" role="button">Edit</a>
          <button onclick="deleteNews(${newsId})" class="delete-btn">Delete</button>
        </div>
      `;
      newsList.appendChild(div);
    });

    renderPagination(filtered.length);
  }

  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === currentPage) btn.setAttribute('aria-current', 'page');
      btn.onclick = () => {
        currentPage = i;
        renderNews();
      };
      pagination.appendChild(btn);
    }
  }

  // Keep the modal code for possible inline previews
  window.showDetail = function(id) {
    const item = allNews.find(news => parseInt(news.id) === parseInt(id));
    if (!item) return;
    
    modalTitle.textContent = item.title;
    modalImage.src = item.image_url || item.image || '';
    modalContent.textContent = item.content;
    modal.classList.add('show');
    overlay.classList.add('show');
  }

  window.closeModal = function() {
    modal.classList.remove('show');
    overlay.classList.remove('show');
  }

  window.deleteNews = async function(id) {
    if (!confirm('Are you sure you want to delete this news item?')) return;
    
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('_method', 'DELETE');
      
      // Use POST as a fallback for environments that don't support DELETE
      const response = await fetch('api/deleteNews.php', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to delete news');
      }

      // Remove from local array
      allNews = allNews.filter(item => parseInt(item.id) !== parseInt(id));
      saveToLocalStorage(); // Update backup
      renderNews();
      alert('News item deleted successfully');
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Failed to delete news. Please try again.');
    }
  }

  // Simplify the form submission since it's now only for creating new items
  newsForm.onsubmit = async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const image = imageInput.value.trim();

    if (!title || !content || !image) {
      alert('Please fill in all fields correctly.');
      return;
    }

    try {
      let formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('image_url', image);
      
      // Now only for adding new news
      const url = 'api/createNews.php';
      const method = 'POST';

      const response = await fetch(url, {
        method: method,
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to save news');
      }

      const savedNews = await response.json();
      allNews.unshift(savedNews);
      
      saveToLocalStorage(); // Update backup
      renderNews();
      newsForm.reset();
      alert('News created successfully!');
      
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Failed to save news. Please try again.');
    }
  };

  // Search functionality
  searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderNews(); // Filter client-side for better UX
  });
  
  sortSelect.addEventListener('change', () => {
    renderNews();
  });

  // Initial Load
  fetchNews();
});
