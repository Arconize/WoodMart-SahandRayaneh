import { Cart } from './cart.js';
import { Wishlist } from './wishlist.js';
import { Storage } from './storage.js';

export const ProductsRenderer = {
  createCard(product, layout = 'grid') {
    const isFavorited = Wishlist.isWishlisted(product.id);
    const inPagesDir = window.location.pathname.includes('/pages/');
    const detailUrl = inPagesDir ? `product.html?id=${product.id}` : `pages/product.html?id=${product.id}`;

    const badgeList = Array.isArray(product.badges) && product.badges.length > 0
      ? product.badges
      : (product.badge ? [product.badge] : []);

    const badgesHtml = badgeList.map(b => {
      const isHot = b.toUpperCase() === 'HOT';
      const cls = isHot ? 'badge badge-hot' : 'badge badge-discount';
      return `<span class="${cls}">${b}</span>`;
    }).join('');

    const dietaryList = Array.isArray(product.dietary) ? product.dietary : ['gf', 'vegan'];
    const dietaryHtml = dietaryList.map(d => {
      if (d === 'gf') return `<span class="diet-circle" title="Gluten Free">GF</span>`;
      if (d === 'kosher') return `<span class="diet-circle" title="Kosher">U</span>`;
      if (d === 'vegan') return `<span class="diet-leaf" title="Vegan">🌱</span>`;
      return '';
    }).join('');

    const heartSvg = isFavorited
      ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="#bc473b" stroke="#bc473b" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
      : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

    return `
      <div class="product-card" data-id="${product.id}" style="${layout === 'list' ? 'display: flex; flex-direction: row; align-items: center; gap: 20px;' : ''}">
        <div class="product-badges">${badgesHtml}</div>
        <button class="card-wishlist-btn wishlist-btn ${isFavorited ? 'favorited' : ''}" data-action="wishlist" title="Add to Wishlist">
          ${heartSvg}
        </button>

        <div class="product-thumb-wrapper" style="${layout === 'list' ? 'width: 160px; flex-shrink: 0; margin-bottom: 0;' : ''}">
          <a href="${detailUrl}">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
          </a>
        </div>

        <div class="product-details" style="${layout === 'list' ? 'flex: 1;' : ''}">
          <div class="product-title-row">
            <a href="${detailUrl}" class="product-title">${product.name}</a>
            <div class="dietary-icons">${dietaryHtml}</div>
          </div>

          <div class="product-price-rating-row">
            <div class="product-price-group">
              ${product.oldPrice ? `<span class="price-old">$${product.oldPrice.toFixed(2)}</span>` : ''}
              <span class="price">$${product.price.toFixed(2)}</span>
              <span class="product-unit">/ ${product.weight}</span>
            </div>
            ${product.rating ? `
              <div class="product-inline-rating">
                <span>${product.rating.toFixed(1)}</span>
                <span class="star">★</span>
              </div>
            ` : ''}
          </div>

          <div class="product-hover-footer">
            <div class="qty-stepper">
              <button class="qty-btn" data-action="card-qty-minus">-</button>
              <span class="qty-val card-qty-val">1</span>
              <button class="qty-btn" data-action="card-qty-plus">+</button>
            </div>
            <button class="add-cart-btn" data-action="add-cart">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  },

  renderGrid(container, products, layout = 'grid') {
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #ffffff; border-radius: var(--radius-md);">
          <p style="font-weight: 700; font-size: 1.1rem; margin-bottom: 8px;">No matching products found</p>
          <p style="font-size: 0.84rem; color: var(--text-muted);">Try adjusting your filter options or price range.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(p => this.createCard(p, layout)).join('');

    container.querySelectorAll('.product-card').forEach(card => {
      const id = parseInt(card.dataset.id, 10);
      const product = products.find(p => p.id === id);
      if (!product) return;

      const qtyVal = card.querySelector('.card-qty-val');
      let currentQty = 1;

      card.querySelector('[data-action="card-qty-plus"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        currentQty++;
        if (qtyVal) qtyVal.textContent = currentQty;
      });

      card.querySelector('[data-action="card-qty-minus"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentQty > 1) {
          currentQty--;
          if (qtyVal) qtyVal.textContent = currentQty;
        }
      });

      card.querySelector('[data-action="add-cart"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        Cart.addItem(product, currentQty);
      });

      card.querySelector('[data-action="wishlist"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        Wishlist.toggle(product);
        const btn = e.currentTarget;
        const isFav = Wishlist.isWishlisted(product.id);
        if (btn) {
          btn.classList.toggle('favorited', isFav);
          btn.innerHTML = isFav
            ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="#bc473b" stroke="#bc473b" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
            : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
        }
      });
    });
  },

  renderDetailPage(products) {
    const params = new URLSearchParams(window.location.search);
    const idParam = parseInt(params.get('id'), 10);
    const product = products.find(p => p.id === idParam) || products[0];

    if (!product) return;

    document.title = `${product.name} - Woodmart Vegetarian Grocery`;

    const breadcrumbCategory = document.querySelector('.detail-breadcrumb-cat');
    const breadcrumbTitle = document.querySelector('.detail-breadcrumb-title');
    if (breadcrumbCategory) breadcrumbCategory.textContent = product.category;
    if (breadcrumbTitle) breadcrumbTitle.textContent = product.name;

    const mainImg = document.querySelector('.detail-main-img');
    const thumbsContainer = document.querySelector('.thumbnails-row');

    if (mainImg) mainImg.src = product.images[0];
    if (thumbsContainer) {
      thumbsContainer.innerHTML = product.images.map((img, idx) => `
        <button class="thumb-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}">
          <img src="${img}" alt="">
        </button>
      `).join('');

      thumbsContainer.querySelectorAll('.thumb-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          thumbsContainer.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const idx = parseInt(btn.dataset.index, 10);
          if (mainImg) mainImg.src = product.images[idx];
        });
      });
    }

    const titleEl = document.querySelector('.detail-product-title');
    const categoryEl = document.querySelector('.detail-product-category');
    const skuEl = document.querySelector('.detail-sku-val');
    const originEl = document.querySelector('.detail-origin-val');
    const shelfEl = document.querySelector('.detail-shelf-val');
    const stockEl = document.querySelector('.detail-stock-val');
    const descEl = document.querySelector('.detail-product-desc');
    const priceEl = document.querySelector('.detail-price-val');
    const oldPriceEl = document.querySelector('.detail-old-price-val');
    const weightBadge = document.querySelector('.detail-weight-badge');

    if (titleEl) titleEl.textContent = product.name;
    if (categoryEl) categoryEl.textContent = product.category;
    if (skuEl) skuEl.textContent = product.sku;
    if (originEl) originEl.textContent = product.origin;
    if (shelfEl) shelfEl.textContent = product.shelfLife;
    if (stockEl) stockEl.textContent = `In Stock (${product.stock} units)`;
    if (descEl) descEl.textContent = product.description;
    if (priceEl) priceEl.textContent = `$${product.price.toFixed(2)}`;
    if (oldPriceEl) {
      oldPriceEl.textContent = product.oldPrice ? `$${product.oldPrice.toFixed(2)}` : '';
      oldPriceEl.style.display = product.oldPrice ? 'inline' : 'none';
    }
    if (weightBadge) weightBadge.textContent = `Unit: ${product.weight}`;

    let qty = 1;
    const qtySpan = document.querySelector('.detail-qty-span');
    document.querySelector('.detail-qty-plus')?.addEventListener('click', () => {
      qty++;
      if (qtySpan) qtySpan.textContent = qty;
    });
    document.querySelector('.detail-qty-minus')?.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        if (qtySpan) qtySpan.textContent = qty;
      }
    });

    document.querySelector('.detail-add-cart-btn')?.addEventListener('click', () => {
      Cart.addItem(product, qty);
    });

    const wishlistBtn = document.querySelector('.detail-wishlist-btn');
    if (wishlistBtn) {
      const isFav = Wishlist.isWishlisted(product.id);
      wishlistBtn.innerHTML = isFav ? '❤️' : '🤍';
      wishlistBtn.classList.toggle('active', isFav);

      wishlistBtn.addEventListener('click', () => {
        Wishlist.toggle(product);
        const updatedFav = Wishlist.isWishlisted(product.id);
        wishlistBtn.innerHTML = updatedFav ? '❤️' : '🤍';
        wishlistBtn.classList.toggle('active', updatedFav);
      });
    }

    const bundleContainer = document.querySelector('.frequently-bought-bundle');
    const bundleProduct = products.find(p => p.id !== product.id && p.category === product.category) || products[1];

    if (bundleContainer && bundleProduct) {
      const bundleTotal = (product.price + bundleProduct.price) * 0.9;
      bundleContainer.innerHTML = `
        <div class="bundle-row">
          <div class="bundle-items">
            <div class="bundle-item-card">
              <img src="${product.images[0]}" alt="${product.name}">
              <div>
                <div style="font-weight: 700; font-size: 0.85rem;">${product.name}</div>
                <div style="color: var(--primary); font-weight: 700;">$${product.price.toFixed(2)}</div>
              </div>
            </div>
            <span class="bundle-plus">+</span>
            <div class="bundle-item-card">
              <img src="${bundleProduct.images[0]}" alt="${bundleProduct.name}">
              <div>
                <div style="font-weight: 700; font-size: 0.85rem;">${bundleProduct.name}</div>
                <div style="color: var(--primary); font-weight: 700;">$${bundleProduct.price.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-decoration: line-through;">$${(product.price + bundleProduct.price).toFixed(2)}</div>
            <div style="font-size: 1.3rem; font-weight: 900; color: var(--primary);">$${bundleTotal.toFixed(2)}</div>
            <button class="btn btn-primary add-bundle-btn" style="margin-top: 6px; padding: 8px 16px;">Add Both to Basket</button>
          </div>
        </div>
      `;

      bundleContainer.querySelector('.add-bundle-btn')?.addEventListener('click', () => {
        Cart.addItem(product, 1);
        Cart.addItem(bundleProduct, 1);
        Storage.showToast('Added bundle to cart with 10% discount!');
      });
    }

    const tabButtons = document.querySelectorAll('.detail-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.style.display = 'none');

        btn.classList.add('active');
        const targetId = btn.dataset.tab;
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.style.display = 'block';
      });
    });

    const reviewsForm = document.querySelector('.add-review-form');
    const reviewsList = document.querySelector('.reviews-list');

    if (reviewsForm && reviewsList) {
      reviewsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = reviewsForm.querySelector('#review-author').value.trim();
        const rating = parseInt(reviewsForm.querySelector('#review-rating').value, 10);
        const comment = reviewsForm.querySelector('#review-comment').value.trim();

        if (author && comment) {
          const newReviewEl = document.createElement('div');
          newReviewEl.className = 'review-item';
          newReviewEl.innerHTML = `
            <div class="review-author-row">
              <span class="review-author">${author} <span class="badge badge-organic" style="margin-left: 6px;">Verified Buyer</span></span>
              <span style="font-size: 0.75rem; color: var(--text-light);">Just now</span>
            </div>
            <div class="stars" style="margin-bottom: 6px;">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
            <p style="font-size: 0.85rem; color: #4b5563;">${comment}</p>
          `;
          reviewsList.prepend(newReviewEl);
          reviewsForm.reset();
          Storage.showToast('Thank you! Your review was published.');
        }
      });
    }

    const relatedContainer = document.querySelector('.related-products-grid');
    if (relatedContainer) {
      const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
      this.renderGrid(relatedContainer, related);
    }
  }
};
