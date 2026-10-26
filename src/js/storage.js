export const Storage = {
  getCart() {
    try {
      const data = localStorage.getItem('wm_cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setCart(cart) {
    try {
      localStorage.setItem('wm_cart', JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }));
    } catch (e) {
      console.error(e);
    }
  },

  getWishlist() {
    try {
      const data = localStorage.getItem('wm_wishlist');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setWishlist(wishlist) {
    try {
      localStorage.setItem('wm_wishlist', JSON.stringify(wishlist));
      window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { wishlist } }));
    } catch (e) {
      console.error(e);
    }
  },

  showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✓</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
};
