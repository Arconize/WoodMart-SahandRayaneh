import { ProductsRenderer } from './products.js';

export const Filters = {
  state: {
    category: 'all',
    subcategory: 'all',
    maxPrice: 130,
    brands: [],
    countries: [],
    sortBy: 'featured',
    layout: 'grid-4',
    visibleCount: 20
  },

  allProducts: [],

  init(products) {
    this.allProducts = products;

    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    const subParam = urlParams.get('sub');
    const qParam = urlParams.get('q');

    if (catParam && catParam !== 'all') {
      this.state.category = catParam;
    }
    if (subParam && subParam !== 'all') {
      this.state.subcategory = subParam;
    }
    if (qParam) {
      this.state.searchQuery = qParam.toLowerCase();
    }

    this.syncActiveCategoryUI();
    this.bindEvents();
    this.applyFilters();
  },

  syncActiveCategoryUI() {
    const pageTitle = document.querySelector('.page-main-heading');
    const breadcrumbCurrent = document.querySelector('.breadcrumb .current');
    const label = this.state.subcategory !== 'all'
      ? this.state.subcategory
      : (this.state.category !== 'all' ? this.state.category : 'Vegetables & Fruits');

    if (pageTitle) pageTitle.textContent = label;
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = label;

    document.querySelectorAll('.filter-cat-btn').forEach(btn => {
      const isMatch = btn.dataset.category.toLowerCase() === this.state.category.toLowerCase() ||
        (this.state.category === 'all' && btn.dataset.category === 'Vegetables & Fruits');
      btn.classList.toggle('active', isMatch);
    });

    document.querySelectorAll('.subcat-pill-card, .filter-subcat-btn').forEach(el => {
      const sub = el.dataset.subcategory;
      el.classList.toggle('active', sub && sub.toLowerCase() === this.state.subcategory.toLowerCase());
    });
  },

  bindEvents() {
    const catButtons = document.querySelectorAll('.filter-cat-btn');
    catButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.category = btn.dataset.category;
        this.state.subcategory = 'all';
        delete this.state.searchQuery;
        this.syncActiveCategoryUI();
        this.applyFilters();
      });
    });

    const subcatButtons = document.querySelectorAll('.subcat-pill-card, .filter-subcat-btn');
    subcatButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const clickedSub = btn.dataset.subcategory;
        if (this.state.subcategory === clickedSub) {
          this.state.subcategory = 'all';
        } else {
          this.state.category = 'Vegetables & Fruits';
          this.state.subcategory = clickedSub;
        }
        this.syncActiveCategoryUI();
        this.applyFilters();
      });
    });

    const priceSlider = document.querySelector('.price-range-slider');
    const priceDisplay = document.querySelector('.current-max-price');
    const filterPriceBtn = document.querySelector('.btn-filter-price');

    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        this.state.maxPrice = parseFloat(e.target.value);
        if (priceDisplay) priceDisplay.textContent = `$${this.state.maxPrice}`;
      });
      priceSlider.addEventListener('change', () => this.applyFilters());
    }

    if (filterPriceBtn) {
      filterPriceBtn.addEventListener('click', () => this.applyFilters());
    }

    const brandSearchInput = document.querySelector('.brand-search-input');
    if (brandSearchInput) {
      brandSearchInput.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        document.querySelectorAll('.brand-filter-row').forEach(row => {
          const brandName = (row.dataset.brandName || '').toLowerCase();
          row.style.display = brandName.includes(q) ? 'flex' : 'none';
        });
      });
    }

    document.querySelectorAll('.brand-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(document.querySelectorAll('.brand-checkbox:checked')).map(el => el.value);
        this.state.brands = checked;
        this.applyFilters();
      });
    });

    document.querySelectorAll('.country-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(document.querySelectorAll('.country-checkbox:checked')).map(el => el.value);
        this.state.countries = checked;
        this.applyFilters();
      });
    });

    document.querySelectorAll('.per-page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.per-page-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.visibleCount = parseInt(btn.dataset.count, 10) || 20;
        this.applyFilters();
      });
    });

    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.state.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    const viewList = document.querySelector('.view-list-btn');
    const viewGrid3 = document.querySelector('.view-grid3-btn');
    const viewGrid4 = document.querySelector('.view-grid4-btn');
    const gridEl = document.querySelector('.products-grid');

    const setViewMode = (mode) => {
      this.state.layout = mode;
      [viewList, viewGrid3, viewGrid4].forEach(b => b?.classList.remove('active'));
      if (mode === 'list') viewList?.classList.add('active');
      if (mode === 'grid-3') viewGrid3?.classList.add('active');
      if (mode === 'grid-4') viewGrid4?.classList.add('active');
      if (gridEl) {
        gridEl.classList.toggle('cols-3', mode === 'grid-3');
      }
      this.applyFilters();
    };

    viewList?.addEventListener('click', () => setViewMode('list'));
    viewGrid3?.addEventListener('click', () => setViewMode('grid-3'));
    viewGrid4?.addEventListener('click', () => setViewMode('grid-4'));
  },

  applyFilters() {
    let result = this.allProducts.filter(item => {
      if (this.state.category !== 'all' && item.category.toLowerCase() !== this.state.category.toLowerCase()) {
        return false;
      }
      if (this.state.subcategory !== 'all' && (!item.subcategory || item.subcategory.toLowerCase() !== this.state.subcategory.toLowerCase())) {
        return false;
      }
      if (item.price > this.state.maxPrice) {
        return false;
      }
      if (this.state.brands.length > 0 && !this.state.brands.includes(item.brand)) {
        return false;
      }
      if (this.state.countries.length > 0 && !this.state.countries.includes(item.country)) {
        return false;
      }
      if (this.state.searchQuery) {
        const text = `${item.name} ${item.description} ${item.category} ${item.subcategory || ''}`.toLowerCase();
        if (!text.includes(this.state.searchQuery)) return false;
      }
      return true;
    });

    if (this.state.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.state.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.state.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    const countEl = document.querySelector('.shop-result-count');
    if (countEl) {
      const shown = Math.min(result.length, this.state.visibleCount);
      countEl.textContent = `Showing 1–${shown} of ${result.length} results`;
    }

    const container = document.querySelector('.products-grid');
    if (container) {
      const itemsToRender = result.slice(0, this.state.visibleCount);
      const cardLayout = this.state.layout === 'list' ? 'list' : 'grid';
      ProductsRenderer.renderGrid(container, itemsToRender, cardLayout);
    }
  }
};
