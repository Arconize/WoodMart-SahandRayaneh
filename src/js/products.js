import { Cart } from './cart.js';
import { Wishlist } from './wishlist.js';
import { Storage } from './storage.js';

export const ProductsRenderer = {
  createCard(product, layout = 'grid') {
    const isFavorited = Wishlist.isWishlisted(product.id);
    const discountPercent = product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

    const inPagesDir = window.location.pathname.includes('/pages/');
    const detailUrl = inPagesDir ? `product.html?id=${product.id}` : `pages/product.html?id=${product.id}`;

    return `
      <div class="product-card" data-id="${product.id}" style="${layout === 'list' ? 'display: flex; flex-direction: row; align-items: center;' : ''}">
        <div class="product-thumb-wrapper" style="${layout === 'list' ? 'width: 180px; flex-shrink: 0;' : ''}">
          <a href="${detailUrl}">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
          </a>
          <div class="product-badges">
            ${product.badge ? `<span class="badge badge-sale">${product.badge}</span>` : ''}
            ${discountPercent ? `<span class="badge badge-sale">-${discountPercent}%</span>` : ''}
          </div>
          <div class="product-hover-actions">
            <button class="product-action-btn wishlist-btn ${isFavorited ? 'favorited' : ''}" data-action="wishlist" title="Wishlist">
              ${isFavorited ? '❤️' : '🤍'}
            </button>
            <button class="product-action-btn quick-view-btn" data-action="quickview" title="Quick View">
              👁️
            </button>
          </div>
        </div>

        <div class="product-details">
          <div class="product-meta-row">
            <span>${product.category}</span>
            <span>${product.weight}</span>
          </div>

          <a href="${detailUrl}" class="product-title">${product.name}</a>

          <div class="product-rating-row">
            <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
            <span>(${product.reviewCount})</span>
          </div>

          <div class="product-footer-row">
            <div>
              <span class="price">$${product.price.toFixed(2)}</span>
              ${product.oldPrice ? `<span class="price-old">$${product.oldPrice.toFixed(2)}</span>` : ''}
            </div>

            <div style="display: flex; align-items: center; gap: 6px;">
              <div class="qty-stepper">
                <button class="qty-btn" data-action="card-qty-minus">-</button>
                <span class="qty-val card-qty-val">1</span>
                <button class="qty-btn" data-action="card-qty-plus">+</button>
              </div>
              <button class="add-cart-btn" data-action="add-cart">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderGrid(container, products, layout = 'grid') {
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <p style="font-weight: 700; font-size: 1.1rem; margin-bottom: 8px;">No matching organic produce found</p>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Try adjusting your filter options or price range.</p>
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
        const btn = e.target.closest('button');
        const isFav = Wishlist.isWishlisted(product.id);
        if (btn) {
          btn.innerHTML = isFav ? '❤️' : '🤍';
          btn.classList.toggle('favorited', isFav);
        }
      });

      card.querySelector('[data-action="quickview"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        this.openQuickView(product);
      });
    });
  },

  openQuickView(product) {
    let modal = document.querySelector('.quick-view-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'quick-view-modal';
      modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.6);
        backdrop-filter: blur(2px); z-index: 300; display: flex;
        align-items: center; justify-content: center; padding: 20px;
      `;
      document.body.appendChild(modal);
    }

    const inPagesDir = window.location.pathname.includes('/pages/');
    const detailUrl = inPagesDir ? `product.html?id=${product.id}` : `pages/product.html?id=${product.id}`;

    modal.innerHTML = `
      <div style="background: #ffffff; border-radius: var(--radius-lg); max-width: 760px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 32px; position: relative; box-shadow: var(--shadow-lg);">
        <button class="quick-view-close" style="position: absolute; top: 16px; right: 16px; font-size: 1.4rem; color: var(--text-light); cursor: pointer;">✕</button>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
          <div>
            <img src="${product.images[0]}" alt="${product.name}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: var(--radius-md);">
          </div>
          <div>
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase;">${product.category}</span>
            <h3 style="font-size: 1.4rem; font-weight: 800; margin: 8px 0 12px 0;">${product.name}</h3>
            <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px;">
              <span class="price" style="font-size: 1.5rem;">$${product.price.toFixed(2)}</span>
              ${product.oldPrice ? `<span class="price-old">$${product.oldPrice.toFixed(2)}</span>` : ''}
              <span style="font-size: 0.8rem; color: var(--text-muted);">/ ${product.weight}</span>
            </div>
            <p style="font-size: 0.85rem; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">${product.description}</p>
            <div style="font-size: 0.8rem; margin-bottom: 24px; color: var(--text-muted);">
              <div>Availability: <strong style="color: var(--primary);">In Stock (${product.stock} units)</strong></div>
              <div>SKU: <strong>${product.sku}</strong></div>
            </div>
            <div style="display: flex; gap: 10px;">
              <button class="btn btn-primary modal-add-cart" style="flex: 1;">Add to Cart</button>
              <a href="${detailUrl}" class="btn btn-outline">Full Details →</a>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    modal.querySelector('.quick-view-close').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    modal.querySelector('.modal-add-cart').addEventListener('click', () => {
      Cart.addItem(product, 1);
      modal.style.display = 'none';
    });
  },

  renderDetailPage(products) {
    const params = new URLSearchParams(window.location.search);
    const idParam = parseInt(params.get('id'), 10);
    const product = products.find(p => p.id === idParam) || products[0];

    if (!product) return;

    document.title = `${product.name} - WoodMart Vegetables`;

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
    if (weightBadge) weightBadge.textContent = product.weight;

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
