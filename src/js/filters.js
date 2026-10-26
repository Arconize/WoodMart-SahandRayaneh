import { ProductsRenderer } from './products.js';

export const Filters = {
  state: {
    category: 'all',
    maxPrice: 20,
    inStockOnly: false,
    onSaleOnly: false,
    veganOnly: false,
    organicOnly: false,
    weights: [],
    sortBy: 'featured',
    layout: 'grid',
    visibleCount: 12
  },

  allProducts: [],

  init(products) {
    this.allProducts = products;

    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    const qParam = urlParams.get('q');

    if (catParam && catParam !== 'all') {
      this.state.category = catParam;
    }
    if (qParam) {
      this.state.searchQuery = qParam.toLowerCase();
    }

    this.bindEvents();
    this.applyFilters();
  },

  bindEvents() {
    const catButtons = document.querySelectorAll('.filter-cat-btn');
    catButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        catButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.category = btn.dataset.category;
        this.state.visibleCount = 12;
        this.applyFilters();
      });
    });

    const priceSlider = document.querySelector('.price-range-slider');
    const priceDisplay = document.querySelector('.current-max-price');

    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        this.state.maxPrice = parseFloat(e.target.value);
        if (priceDisplay) priceDisplay.textContent = `$${this.state.maxPrice.toFixed(2)}`;
        this.applyFilters();
      });
    }

    const inStockCheck = document.querySelector('#filter-in-stock');
    if (inStockCheck) {
      inStockCheck.addEventListener('change', (e) => {
        this.state.inStockOnly = e.target.checked;
        this.applyFilters();
      });
    }

    const onSaleCheck = document.querySelector('#filter-on-sale');
    if (onSaleCheck) {
      onSaleCheck.addEventListener('change', (e) => {
        this.state.onSaleOnly = e.target.checked;
        this.applyFilters();
      });
    }

    const organicCheck = document.querySelector('#filter-organic');
    if (organicCheck) {
      organicCheck.addEventListener('change', (e) => {
        this.state.organicOnly = e.target.checked;
        this.applyFilters();
      });
    }

    const veganCheck = document.querySelector('#filter-vegan');
    if (veganCheck) {
      veganCheck.addEventListener('change', (e) => {
        this.state.veganOnly = e.target.checked;
        this.applyFilters();
      });
    }

    const weightButtons = document.querySelectorAll('.weight-btn');
    weightButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const weight = btn.dataset.weight;
        if (this.state.weights.includes(weight)) {
          this.state.weights = this.state.weights.filter(w => w !== weight);
          btn.classList.remove('active');
        } else {
          this.state.weights.push(weight);
          btn.classList.add('active');
        }
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

    const viewGrid = document.querySelector('.view-grid-btn');
    const viewList = document.querySelector('.view-list-btn');

    if (viewGrid && viewList) {
      viewGrid.addEventListener('click', () => {
        this.state.layout = 'grid';
        viewGrid.classList.add('active');
        viewList.classList.remove('active');
        this.applyFilters();
      });

      viewList.addEventListener('click', () => {
        this.state.layout = 'list';
        viewList.classList.add('active');
        viewGrid.classList.remove('active');
        this.applyFilters();
      });
    }

    const resetBtn = document.querySelector('.reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.state.category = 'all';
        this.state.maxPrice = 20;
        this.state.inStockOnly = false;
        this.state.onSaleOnly = false;
        this.state.veganOnly = false;
        this.state.organicOnly = false;
        this.state.weights = [];
        this.state.sortBy = 'featured';
        this.state.visibleCount = 12;
        delete this.state.searchQuery;

        if (priceSlider) priceSlider.value = 20;
        if (priceDisplay) priceDisplay.textContent = '$20.00';
        if (inStockCheck) inStockCheck.checked = false;
        if (onSaleCheck) onSaleCheck.checked = false;
        if (organicCheck) organicCheck.checked = false;
        if (veganCheck) veganCheck.checked = false;
        catButtons.forEach(b => {
          if (b.dataset.category === 'all') b.classList.add('active');
          else b.classList.remove('active');
        });
        weightButtons.forEach(b => b.classList.remove('active'));
        if (sortSelect) sortSelect.value = 'featured';

        this.applyFilters();
      });
    }

    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.state.visibleCount += 6;
        this.applyFilters();
      });
    }
  },

  applyFilters() {
    let result = this.allProducts.filter(item => {
      if (this.state.category !== 'all' && item.category.toLowerCase() !== this.state.category.toLowerCase()) {
        return false;
      }
      if (item.price > this.state.maxPrice) {
        return false;
      }
      if (this.state.inStockOnly && item.stock <= 0) {
        return false;
      }
      if (this.state.onSaleOnly && !item.oldPrice) {
        return false;
      }
      if (this.state.organicOnly && !item.isOrganic) {
        return false;
      }
      if (this.state.veganOnly && !item.isVegan) {
        return false;
      }
      if (this.state.weights.length > 0) {
        const matchesWeight = this.state.weights.some(w => item.weight.toLowerCase().includes(w.toLowerCase()));
        if (!matchesWeight) return false;
      }
      if (this.state.searchQuery) {
        const text = `${item.name} ${item.description} ${item.category}`.toLowerCase();
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
      countEl.textContent = `Showing ${Math.min(result.length, this.state.visibleCount)} of ${result.length} products`;
    }

    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = result.length > this.state.visibleCount ? 'inline-block' : 'none';
    }

    const container = document.querySelector('.products-grid');
    if (container) {
      const itemsToRender = result.slice(0, this.state.visibleCount);
      ProductsRenderer.renderGrid(container, itemsToRender, this.state.layout);
    }
  }
};
