import { Storage } from './storage.js';

export const Menu = {
  init() {
    this.setupMobileHeaderAndBottomBar();
    this.setupAuthDrawer();
    this.setupFooterAccordions();
    this.setupCarouselScrollbars();

    const cartTriggers = document.querySelectorAll('.header-cart-trigger');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartOverlay = document.querySelector('.cart-drawer-overlay');
    const cartClose = document.querySelector('.cart-drawer-close');

    const openCart = (e) => {
      if (e) e.preventDefault();
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
    const railTriggers = document.querySelectorAll('.rail-menu-trigger, .all-categories-btn, .mobile-nav-toggle, .mobile-menu-trigger');
    const leftClosePill = document.querySelector('.left-drawer-pill-header');

    const openLeftMenu = (e) => {
      if (e) e.preventDefault();
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
      btn.addEventListener('click', openLeftMenu);
    });

    const railTriggerBtn = document.querySelector('.rail-menu-trigger');
    if (railTriggerBtn) {
      railTriggerBtn.addEventListener('mouseenter', () => openLeftMenu());
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
      scrollTopBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
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
  },

  setupMobileHeaderAndBottomBar() {
    const headerContainer = document.querySelector('.main-header .container');
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileToggle) {
      mobileToggle.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    }

    if (headerContainer && !headerContainer.querySelector('.mobile-user-trigger')) {
      const userBtn = document.createElement('button');
      userBtn.type = 'button';
      userBtn.className = 'mobile-user-trigger auth-drawer-trigger';
      userBtn.setAttribute('aria-label', 'Sign in');
      userBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
      headerContainer.appendChild(userBtn);
    }

    const topBarLinks = document.querySelectorAll('.top-bar-right a');
    topBarLinks.forEach(link => {
      if (link.textContent.includes('Login')) {
        link.classList.add('auth-drawer-trigger');
      }
    });

    const isSubPage = window.location.pathname.includes('/pages/');
    const wishlistPath = isSubPage ? 'wishlist.html' : 'pages/wishlist.html';
    const bottomBarInner = document.querySelector('.mobile-bottom-bar-inner');
    if (bottomBarInner) {
      const currentCount = Storage.getCart().reduce((sum, item) => sum + item.quantity, 0);
      bottomBarInner.innerHTML = `
        <button type="button" class="mobile-bar-btn mobile-menu-trigger">
          <span class="mobile-bar-icon">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </span>
          <span>Menu</span>
        </button>
        <a href="${wishlistPath}" class="mobile-bar-btn">
          <span class="mobile-bar-icon">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </span>
          <span>Wishlist</span>
        </a>
        <button type="button" class="mobile-bar-btn header-cart-trigger">
          <span class="mobile-bar-icon">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span class="mobile-cart-badge cart-count-badge">${currentCount}</span>
          </span>
          <span>Cart</span>
        </button>
      `;
    }

    const storySection = document.querySelector('.story-circles-section .container');
    if (storySection && !storySection.querySelector('.story-scrollbar-track')) {
      const track = document.createElement('div');
      track.className = 'section-scrollbar-track story-scrollbar-track';
      track.innerHTML = '<div class="section-scrollbar-thumb"></div>';
      storySection.appendChild(track);
    }
  },

  setupAuthDrawer() {
    if (!document.querySelector('.auth-drawer')) {
      const overlay = document.createElement('div');
      overlay.className = 'auth-drawer-overlay';

      const drawer = document.createElement('aside');
      drawer.className = 'auth-drawer';
      drawer.innerHTML = `
        <div class="auth-drawer-header">
          <h3 class="auth-drawer-title">Sign in</h3>
          <button type="button" class="auth-drawer-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            <span>Close</span>
          </button>
        </div>
        <form class="auth-drawer-body">
          <div class="auth-field-group">
            <label class="auth-label">Username or email address <span class="auth-req">*</span></label>
            <input type="text" class="auth-input" required autocomplete="username">
          </div>
          <div class="auth-field-group">
            <label class="auth-label">Password <span class="auth-req">*</span></label>
            <div class="auth-pass-wrap">
              <input type="password" class="auth-input auth-pass-input" required autocomplete="current-password">
              <button type="button" class="auth-pass-eye" aria-label="Show password">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <button type="submit" class="auth-submit-btn">Log In</button>
          <label class="auth-remember-label">
            <input type="checkbox" class="auth-checkbox">
            <span>Remember me</span>
          </label>
          <a href="#lost-password" class="auth-lost-link">Lost your password?</a>
        </form>
        <div class="auth-drawer-create">
          <div class="auth-empty-user-icon">
            <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#ecebe6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <p class="auth-no-account-text">No account yet?</p>
          <a href="#create-account" class="auth-create-btn">Create An Account</a>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.appendChild(drawer);
    }

    const authOverlay = document.querySelector('.auth-drawer-overlay');
    const authDrawer = document.querySelector('.auth-drawer');
    const authClose = document.querySelector('.auth-drawer-close');
    const authTriggers = document.querySelectorAll('.auth-drawer-trigger');
    const passInput = document.querySelector('.auth-pass-input');
    const passEye = document.querySelector('.auth-pass-eye');
    const authForm = document.querySelector('.auth-drawer-body');
    const lostLink = document.querySelector('.auth-lost-link');
    const createBtn = document.querySelector('.auth-create-btn');

    const openAuth = (e) => {
      if (e) e.preventDefault();
      if (authDrawer && authOverlay) {
        authDrawer.classList.add('active');
        authOverlay.classList.add('active');
      }
    };

    const closeAuth = () => {
      if (authDrawer && authOverlay) {
        authDrawer.classList.remove('active');
        authOverlay.classList.remove('active');
      }
    };

    authTriggers.forEach(btn => btn.addEventListener('click', openAuth));
    if (authClose) authClose.addEventListener('click', closeAuth);
    if (authOverlay) authOverlay.addEventListener('click', closeAuth);

    if (passEye && passInput) {
      passEye.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
      });
    }

    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        Storage.showToast('Signed in successfully!');
        authForm.reset();
        closeAuth();
      });
    }

    if (lostLink) {
      lostLink.addEventListener('click', (e) => {
        e.preventDefault();
        Storage.showToast('Password reset link sent to your email.');
      });
    }

    if (createBtn) {
      createBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const titleEl = document.querySelector('.auth-drawer-title');
        const submitEl = document.querySelector('.auth-submit-btn');
        if (titleEl && submitEl) {
          const isRegister = titleEl.textContent === 'Register';
          titleEl.textContent = isRegister ? 'Sign in' : 'Register';
          submitEl.textContent = isRegister ? 'Log In' : 'Register';
          createBtn.textContent = isRegister ? 'Create An Account' : 'Back To Sign In';
        }
      });
    }
  },

  setupFooterAccordions() {
    const footerCols = document.querySelectorAll('.footer-col');
    footerCols.forEach(col => {
      const heading = col.querySelector('h4');
      const linksList = col.querySelector('.footer-links');
      if (heading && linksList) {
        col.classList.add('footer-accordion-col');
        if (!heading.querySelector('.footer-acc-chevron')) {
          const chevron = document.createElement('span');
          chevron.className = 'footer-acc-chevron';
          chevron.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
          heading.appendChild(chevron);
        }
        heading.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            col.classList.toggle('open');
          }
        });
      }
    });
  },

  setupCarouselScrollbars() {
    const pairs = [
      { row: '.story-circles-row', track: '.story-scrollbar-track' },
      { row: '.pop-categories-grid', track: '.categories-section .section-scrollbar-track' }
    ];

    document.querySelectorAll('.home-carousel-section').forEach(sec => {
      const row = sec.querySelector('.home-products-row');
      const track = sec.querySelector('.section-scrollbar-track');
      if (row && track) {
        this.bindScrollThumb(row, track);
      }
    });

    pairs.forEach(({ row, track }) => {
      const rowEl = document.querySelector(row);
      const trackEl = document.querySelector(track);
      if (rowEl && trackEl) {
        this.bindScrollThumb(rowEl, trackEl);
      }
    });
  },

  bindScrollThumb(rowEl, trackEl) {
    const thumb = trackEl.querySelector('.section-scrollbar-thumb');
    if (!thumb) return;

    const updateThumb = () => {
      const maxScroll = rowEl.scrollWidth - rowEl.clientWidth;
      if (maxScroll <= 2) {
        thumb.style.width = '50%';
        thumb.style.transform = 'translateX(0%)';
        return;
      }
      const ratio = Math.max(0.22, Math.min(0.65, rowEl.clientWidth / rowEl.scrollWidth));
      const progress = rowEl.scrollLeft / maxScroll;
      const thumbWidthPct = ratio * 100;
      const maxTranslatePct = ((100 - thumbWidthPct) / thumbWidthPct) * 100;
      thumb.style.width = `${thumbWidthPct}%`;
      thumb.style.transform = `translateX(${progress * maxTranslatePct}%)`;
    };

    rowEl.addEventListener('scroll', updateThumb, { passive: true });
    window.addEventListener('resize', updateThumb);
    setTimeout(updateThumb, 150);
  }
};
