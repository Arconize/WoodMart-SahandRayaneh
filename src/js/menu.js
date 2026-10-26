export const Menu = {
  init() {
    const cartTriggers = document.querySelectorAll('.header-cart-trigger');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartOverlay = document.querySelector('.cart-drawer-overlay');
    const cartClose = document.querySelector('.cart-drawer-close');

    const openCart = () => {
      if (cartDrawer && cartOverlay) {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
      }
    };

    const closeCart = () => {
      if (cartDrawer && cartOverlay) {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
      }
    };

    cartTriggers.forEach(btn => btn.addEventListener('click', openCart));
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-menu-drawer');
    const mobileClose = document.querySelector('.mobile-menu-close');

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        mobileDrawer.classList.add('active');
        if (cartOverlay) cartOverlay.classList.add('active');
      });
    }

    if (mobileClose && mobileDrawer) {
      mobileClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
      });
    }

    const categoriesBtn = document.querySelector('.categories-btn');
    const categoriesMenu = document.querySelector('.categories-menu');

    if (categoriesBtn && categoriesMenu) {
      categoriesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        categoriesMenu.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!categoriesBtn.contains(e.target) && !categoriesMenu.contains(e.target)) {
          categoriesMenu.classList.remove('active');
        }
      });
    }

    const filterToggleBtn = document.querySelector('.mobile-filter-toggle-btn');
    const sidebar = document.querySelector('.shop-sidebar');

    if (filterToggleBtn && sidebar) {
      filterToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active-mobile');
      });
    }
  }
};
