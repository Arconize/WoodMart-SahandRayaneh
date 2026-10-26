import { Storage } from './storage.js';
import { Cart } from './cart.js';

export const Wishlist = {
  isWishlisted(productId) {
    const list = Storage.getWishlist();
    return list.some(item => item.id === productId);
  },

  toggle(product) {
    let list = Storage.getWishlist();
    const exists = list.some(item => item.id === product.id);

    if (exists) {
      list = list.filter(item => item.id !== product.id);
      Storage.setWishlist(list);
      Storage.showToast(`Removed "${product.name}" from wishlist`);
    } else {
      list.push({
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        image: product.images ? product.images[0] : product.image,
        category: product.category,
        stock: product.stock
      });
      Storage.setWishlist(list);
      Storage.showToast(`Added "${product.name}" to wishlist`);
    }

    this.updateBadges();
    this.renderWishlistPage();
  },

  remove(productId) {
    let list = Storage.getWishlist().filter(item => item.id !== productId);
    Storage.setWishlist(list);
    Storage.showToast('Item removed from wishlist');
    this.updateBadges();
    this.renderWishlistPage();
  },

  updateBadges() {
    const list = Storage.getWishlist();
    document.querySelectorAll('.wishlist-count-badge').forEach(el => {
      el.textContent = list.length;
    });
  },

  renderWishlistPage() {
    const tbody = document.querySelector('.wishlist-table-body');
    const emptyContainer = document.querySelector('.wishlist-empty-message');
    const contentContainer = document.querySelector('.wishlist-content-wrapper');

    if (!tbody) return;

    const list = Storage.getWishlist();

    if (list.length === 0) {
      if (emptyContainer) emptyContainer.style.display = 'block';
      if (contentContainer) contentContainer.style.display = 'none';
      return;
    }

    if (emptyContainer) emptyContainer.style.display = 'none';
    if (contentContainer) contentContainer.style.display = 'block';

    tbody.innerHTML = list.map(item => `
      <tr data-id="${item.id}">
        <td>
          <div class="cart-product-cell">
            <img src="${item.image}" alt="${item.name}">
            <div>
              <div class="cart-product-title">${item.name}</div>
              <div class="cart-product-meta">${item.weight} · ${item.category}</div>
            </div>
          </div>
        </td>
        <td style="font-weight: 700; color: var(--primary);">$${item.price.toFixed(2)}</td>
        <td>
          <span class="badge badge-organic">In Stock</span>
        </td>
        <td>
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button class="btn btn-primary add-to-cart-from-wishlist" style="padding: 6px 14px; font-size: 0.78rem;">
              Add to Cart
            </button>
            <button class="drawer-item-remove remove-from-wishlist-btn" style="font-size: 1.1rem; padding: 6px;">
              ✕
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.add-to-cart-from-wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const id = parseInt(row.dataset.id, 10);
        const item = list.find(i => i.id === id);
        if (item) {
          Cart.addItem({
            ...item,
            images: [item.image]
          }, 1);
        }
      });
    });

    tbody.querySelectorAll('.remove-from-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const id = parseInt(row.dataset.id, 10);
        this.remove(id);
      });
    });
  },

  init() {
    this.updateBadges();
    this.renderWishlistPage();

    window.addEventListener('wishlist-updated', () => {
      this.updateBadges();
      this.renderWishlistPage();
    });
  }
};
