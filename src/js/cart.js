import { Storage } from './storage.js';

export const Cart = {
  addItem(product, quantity = 1) {
    const cart = Storage.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        image: product.images[0],
        category: product.category,
        quantity: quantity
      });
    }

    Storage.setCart(cart);
    Storage.showToast(`Added ${quantity}x "${product.name}" to your cart`);
    this.updateBadges();
    this.renderDrawer();
  },

  removeItem(productId) {
    const cart = Storage.getCart().filter(item => item.id !== productId);
    Storage.setCart(cart);
    Storage.showToast('Item removed from cart');
    this.updateBadges();
    this.renderDrawer();
    this.renderCartPage();
  },

  updateQuantity(productId, delta) {
    let cart = Storage.getCart();
    const item = cart.find(i => i.id === productId);

    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
      }
      Storage.setCart(cart);
      this.updateBadges();
      this.renderDrawer();
      this.renderCartPage();
    }
  },

  getSubtotal() {
    const cart = Storage.getCart();
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  updateBadges() {
    const cart = Storage.getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.getSubtotal();

    document.querySelectorAll('.cart-count-badge').forEach(el => {
      el.textContent = totalCount;
    });

    document.querySelectorAll('.cart-subtotal-val').forEach(el => {
      el.textContent = `$${subtotal.toFixed(2)}`;
    });
  },

  renderDrawer() {
    const container = document.querySelector('.cart-drawer-items');
    const footerSubtotal = document.querySelector('.drawer-subtotal-val');
    const drawerOverlay = document.querySelector('.cart-drawer-overlay');
    const drawer = document.querySelector('.cart-drawer');

    if (!container) return;

    const cart = Storage.getCart();
    const subtotal = this.getSubtotal();

    if (footerSubtotal) {
      footerSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    }

    if (cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🛒</div>
          <p style="font-weight: 700; color: var(--text-main); margin-bottom: 4px;">Your cart is empty</p>
          <p style="font-size: 0.8rem;">Browse our farm produce to fill your basket.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = cart.map(item => `
      <div class="drawer-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="drawer-item-details">
          <div class="drawer-item-title">${item.name}</div>
          <div class="drawer-item-price">$${item.price.toFixed(2)}</div>
          <div class="drawer-item-qty">Qty: ${item.quantity} · ${item.weight}</div>
        </div>
        <button class="drawer-item-remove" data-action="remove">✕</button>
      </div>
    `).join('');

    container.querySelectorAll('.drawer-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemEl = e.target.closest('.drawer-item');
        const id = parseInt(itemEl.dataset.id, 10);
        this.removeItem(id);
      });
    });
  },

  renderCartPage() {
    const tbody = document.querySelector('.cart-table-body');
    const subtotalEl = document.querySelector('.cart-page-subtotal');
    const totalEl = document.querySelector('.cart-page-total');
    const shippingEl = document.querySelector('.cart-page-shipping');
    const freeShippingText = document.querySelector('.free-shipping-goal-text');
    const freeShippingBar = document.querySelector('.free-shipping-progress-fill');

    if (!tbody) return;

    const cart = Storage.getCart();
    const subtotal = this.getSubtotal();
    const freeThreshold = 45.0;
    const isFree = subtotal >= freeThreshold;
    const shipping = subtotal === 0 || isFree ? 0.0 : 4.5;
    const discount = window.appliedDiscount || 0;
    const finalTotal = Math.max(0, subtotal + shipping - discount);

    if (freeShippingText && freeShippingBar) {
      if (isFree) {
        freeShippingText.innerHTML = '🎉 You qualify for <strong>FREE DELIVERY!</strong>';
        freeShippingBar.style.width = '100%';
      } else {
        const remaining = (freeThreshold - subtotal).toFixed(2);
        const percent = Math.min(100, (subtotal / freeThreshold) * 100);
        freeShippingText.innerHTML = `Add <strong>$${remaining}</strong> more to get <strong>FREE SHIPPING!</strong>`;
        freeShippingBar.style.width = `${percent}%`;
      }
    }

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;

    const emptyContainer = document.querySelector('.cart-empty-message');
    const contentContainer = document.querySelector('.cart-content-wrapper');

    if (cart.length === 0) {
      if (emptyContainer) emptyContainer.style.display = 'block';
      if (contentContainer) contentContainer.style.display = 'none';
      return;
    }

    if (emptyContainer) emptyContainer.style.display = 'none';
    if (contentContainer) contentContainer.style.display = 'grid';

    tbody.innerHTML = cart.map(item => `
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
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <div class="qty-stepper" style="width: fit-content;">
            <button class="qty-btn" data-action="decrease">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" data-action="increase">+</button>
          </div>
        </td>
        <td style="font-weight: 700; color: var(--primary);">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
        <td>
          <button class="drawer-item-remove" data-action="delete" style="font-size: 1rem;">✕</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const id = parseInt(row.dataset.id, 10);
        const action = btn.dataset.action;

        if (action === 'increase') {
          this.updateQuantity(id, 1);
        } else if (action === 'decrease') {
          this.updateQuantity(id, -1);
        } else if (action === 'delete') {
          this.removeItem(id);
        }
      });
    });
  },

  init() {
    this.updateBadges();
    this.renderDrawer();
    this.renderCartPage();

    window.addEventListener('cart-updated', () => {
      this.updateBadges();
      this.renderDrawer();
      this.renderCartPage();
    });

    const couponForm = document.querySelector('.coupon-form');
    if (couponForm) {
      couponForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = couponForm.querySelector('.coupon-input');
        const code = input ? input.value.trim().toUpperCase() : '';
        if (code === 'WOODMART15') {
          window.appliedDiscount = 15.0;
          Storage.showToast('Coupon WOODMART15 applied: $15.00 OFF');
          this.renderCartPage();
        } else if (code === 'ORGANIC') {
          window.appliedDiscount = 5.0;
          Storage.showToast('Coupon ORGANIC applied: $5.00 OFF');
          this.renderCartPage();
        } else {
          Storage.showToast('Invalid coupon. Try WOODMART15');
        }
      });
    }
  }
};
