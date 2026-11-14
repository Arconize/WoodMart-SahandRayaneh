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

    const leftDrawer = document.querySelector('.left-sidebar-drawer');
    const leftOverlay = document.querySelector('.left-sidebar-overlay');
    const railTriggers = document.querySelectorAll('.rail-menu-trigger, .all-categories-btn, .mobile-nav-toggle');
    const leftClosePill = document.querySelector('.left-drawer-pill-header');

    const openLeftMenu = () => {
      if (leftDrawer && leftOverlay) {
        leftDrawer.classList.add('active');
        leftOverlay.classList.add('active');
      }
    };

    const closeLeftMenu = () => {
      if (leftDrawer && leftOverlay) {
        leftDrawer.classList.remove('active');
        leftOverlay.classList.remove('active');
      }
    };

    railTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openLeftMenu();
      });
    });

    const railTriggerBtn = document.querySelector('.rail-menu-trigger');
    if (railTriggerBtn) {
      railTriggerBtn.addEventListener('mouseenter', openLeftMenu);
    }

    if (leftDrawer) {
      leftDrawer.addEventListener('mouseleave', closeLeftMenu);
    }

    if (leftClosePill) leftClosePill.addEventListener('click', closeLeftMenu);
    if (leftOverlay) leftOverlay.addEventListener('click', closeLeftMenu);

    const filterToggleBtn = document.querySelector('.mobile-filter-toggle-btn');
    const sidebar = document.querySelector('.shop-sidebar');

    if (filterToggleBtn && sidebar) {
      filterToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active-mobile');
      });
    }

    const scrollTopBtn = document.querySelector('.scroll-top-float');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const seoReadMoreBtn = document.querySelector('.seo-read-more-btn');
    const seoFadeWrap = document.querySelector('.seo-fade-wrap');
    if (seoReadMoreBtn && seoFadeWrap) {
      seoReadMoreBtn.addEventListener('click', () => {
        const expanded = seoFadeWrap.classList.toggle('expanded');
        seoReadMoreBtn.innerHTML = expanded ? 'Read Less ⌃' : 'Read More ⌄';
      });
    }
  }
};
