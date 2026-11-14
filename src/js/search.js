export const Search = {
  init(products) {
    const headerInput = document.querySelector('.search-input');
    const headerForm = document.querySelector('.search-form');
    const inPagesDir = window.location.pathname.includes('/pages/');
    const getProductUrl = (id) => inPagesDir ? `product.html?id=${id}` : `pages/product.html?id=${id}`;
    const getShopUrl = (q, cat) => {
      const base = inPagesDir ? 'products.html' : 'pages/products.html';
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (cat && cat !== 'all') params.set('cat', cat);
      return `${base}?${params.toString()}`;
    };

    let overlay = document.querySelector('.search-overlay-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'search-overlay-modal';
      overlay.innerHTML = `
        <button class="search-overlay-close" aria-label="Close search">✕</button>
        <div class="search-overlay-inner">
          <form class="search-overlay-bar">
            <input type="text" class="search-overlay-input" placeholder="Search for products" autocomplete="off">
            <select class="search-overlay-select">
              <option value="all">SELECT CATEGORY</option>
              <option value="Vegetables & Fruits">Vegetables & Fruits</option>
              <option value="Vegan Meat">Vegan Meat</option>
              <option value="Seafood">Seafood</option>
              <option value="Dairy">Dairy</option>
              <option value="Bakery">Bakery</option>
              <option value="Beverages">Beverages</option>
            </select>
            <button type="submit" class="search-overlay-submit" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </form>

          <div class="popular-requests-block">
            <div class="popular-requests-title">POPULAR REQUESTS</div>
            <div class="popular-requests-tags">
              <button type="button" class="pop-req-tag" data-tag="Frozen">FROZEN</button>
              <button type="button" class="pop-req-tag" data-tag="Cheese">YOGURT</button>
              <button type="button" class="pop-req-tag" data-tag="Chicken">VEGAN</button>
              <button type="button" class="pop-req-tag" data-tag="Water">WATER</button>
              <button type="button" class="pop-req-tag" data-tag="Mate">MILK</button>
            </div>
          </div>

          <div class="search-overlay-dynamic-area"></div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const overlayInput = overlay.querySelector('.search-overlay-input');
    const overlaySelect = overlay.querySelector('.search-overlay-select');
    const overlayForm = overlay.querySelector('.search-overlay-bar');
    const closeBtn = overlay.querySelector('.search-overlay-close');
    const dynamicArea = overlay.querySelector('.search-overlay-dynamic-area');

    const renderMiniItem = (p) => `
      <div class="search-mini-item" onclick="window.location.href='${getProductUrl(p.id)}'">
        <img src="${p.images[0]}" alt="${p.name}">
        <div>
          <div class="search-mini-title">${p.name}</div>
          <div class="search-mini-price">
            ${p.oldPrice ? `<span class="price-old">$${p.oldPrice.toFixed(2)}</span>` : ''}
            $${p.price.toFixed(2)} <span class="unit">/ ${p.weight}</span>
          </div>
        </div>
      </div>
    `;

    const renderDefaultColumns = () => {
      const col1 = products.filter(p => p.category === 'Beverages').slice(0, 3);
      const col2 = products.filter(p => p.category === 'Dairy').slice(0, 3);
      const col3 = products.filter(p => p.category === 'Bakery' || p.category === 'Vegan Meat').slice(0, 3);
      const col4 = products.filter(p => p.category === 'Beverages').slice(3, 6);

      dynamicArea.innerHTML = `
        <div class="search-overlay-columns">
          <div>
            <h4 class="search-col-heading">Popular Products</h4>
            <div class="search-mini-list">${col1.map(renderMiniItem).join('')}</div>
          </div>
          <div>
            <h4 class="search-col-heading">Popular Cheese</h4>
            <div class="search-mini-list">${col2.map(renderMiniItem).join('')}</div>
          </div>
          <div>
            <h4 class="search-col-heading">Popular Cookies & Brownies</h4>
            <div class="search-mini-list">${col3.map(renderMiniItem).join('')}</div>
          </div>
          <div>
            <h4 class="search-col-heading">Popular Tea</h4>
            <div class="search-mini-list">${col4.map(renderMiniItem).join('')}</div>
          </div>
        </div>
      `;
    };

    const renderLiveMatches = () => {
      const q = overlayInput.value.trim().toLowerCase();
      const cat = overlaySelect.value;

      if (!q && cat === 'all') {
        renderDefaultColumns();
        return;
      }

      const matches = products.filter(p => {
        const matchCat = cat === 'all' || p.category.toLowerCase() === cat.toLowerCase();
        const matchQ = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.subcategory && p.subcategory.toLowerCase().includes(q));
        return matchCat && matchQ;
      }).slice(0, 12);

      if (matches.length === 0) {
        dynamicArea.innerHTML = `
          <div style="padding: 32px 0; color: var(--text-muted); font-size: 0.92rem;">
            No products found matching "<strong>${overlayInput.value}</strong>".
          </div>
        `;
        return;
      }

      dynamicArea.innerHTML = `
        <h4 class="search-col-heading">Search Results (${matches.length})</h4>
        <div class="search-overlay-columns">
          ${matches.map(renderMiniItem).join('')}
        </div>
      `;
    };

    const openOverlay = () => {
      overlay.classList.add('active');
      renderDefaultColumns();
      setTimeout(() => overlayInput.focus(), 50);
    };

    const closeOverlay = () => {
      overlay.classList.remove('active');
    };

    if (headerInput) {
      headerInput.addEventListener('focus', openOverlay);
      headerInput.addEventListener('click', openOverlay);
    }

    if (headerForm) {
      headerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        openOverlay();
      });
    }

    closeBtn.addEventListener('click', closeOverlay);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeOverlay();
      }
    });

    overlayInput.addEventListener('input', renderLiveMatches);
    overlaySelect.addEventListener('change', renderLiveMatches);

    overlay.querySelectorAll('.pop-req-tag').forEach(tagBtn => {
      tagBtn.addEventListener('click', () => {
        overlayInput.value = tagBtn.dataset.tag;
        renderLiveMatches();
      });
    });

    overlayForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = getShopUrl(overlayInput.value.trim(), overlaySelect.value);
    });
  }
};
