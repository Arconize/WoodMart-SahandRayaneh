export const Search = {
  debounce(func, wait = 250) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  init(products) {
    const input = document.querySelector('.search-input');
    const select = document.querySelector('.search-category-select');
    const dropdown = document.querySelector('.search-results-dropdown');
    const form = document.querySelector('.search-form');

    if (!input || !dropdown) return;

    const performSearch = () => {
      const query = input.value.trim().toLowerCase();
      const selectedCategory = select ? select.value : 'all';

      if (!query) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }

      const matches = products.filter(p => {
        const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesQuery = p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
      }).slice(0, 6);

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div style="padding: 16px; text-align: center; font-size: 0.82rem; color: var(--text-muted);">
            No matching products found for "<strong>${query}</strong>"
          </div>
        `;
        dropdown.classList.add('active');
        return;
      }

      const getProductUrl = (id) => {
        const inPagesDir = window.location.pathname.includes('/pages/');
        return inPagesDir ? `product.html?id=${id}` : `pages/product.html?id=${id}`;
      };

      dropdown.innerHTML = matches.map(p => `
        <div class="search-result-item" data-id="${p.id}" onclick="window.location.href='${getProductUrl(p.id)}'">
          <img src="${p.images[0]}" alt="${p.name}">
          <div class="search-result-info">
            <div class="search-result-title">${p.name}</div>
            <div class="search-result-price">$${p.price.toFixed(2)} · <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">${p.weight}</span></div>
          </div>
        </div>
      `).join('');

      dropdown.classList.add('active');
    };

    input.addEventListener('input', this.debounce(performSearch, 200));

    if (select) {
      select.addEventListener('change', performSearch);
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = encodeURIComponent(input.value.trim());
        const cat = select ? encodeURIComponent(select.value) : 'all';
        const inPagesDir = window.location.pathname.includes('/pages/');
        const target = inPagesDir ? 'products.html' : 'pages/products.html';
        window.location.href = `${target}?q=${query}&cat=${cat}`;
      });
    }

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }
};
