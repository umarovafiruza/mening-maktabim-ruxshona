/**
 * Modern Academic - Maktab Veb-sayti JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveLinks();
  initCounters();
  initGalleryLightbox();
  initAchievementTabs();
  initContactForm();
  initStickyNavbar();
});

// 1. Mobile Menu & Dropdowns
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-active');
      navMenu.classList.toggle('is-active');
      document.body.style.overflow = navMenu.classList.contains('is-active') ? 'hidden' : '';
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('is-active')) {
        hamburger.classList.remove('is-active');
        navMenu.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });

    // Mobile dropdown toggle
    const dropdownToggles = document.querySelectorAll('.nav-link.has-dropdown');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 820) {
          e.preventDefault();
          const dropdown = toggle.nextElementSibling;
          if (dropdown && dropdown.classList.contains('dropdown-menu')) {
            dropdown.classList.toggle('is-mobile-open');
          }
        }
      });
    });
  }
}

// 2. Active Link Highlighter
function initActiveLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      const navItem = link.closest('.nav-item');
      if (navItem) {
        navItem.classList.add('active');
      }
    }
  });
}

// 3. Counter Animation for Stats
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const duration = 1600;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current).toLocaleString();
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

// 4. Gallery Filtering & Modal Lightbox
function initGalleryLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal
  let lightbox = document.querySelector('.lightbox-modal');
  if (!lightbox && galleryItems.length > 0) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Yopish">&times;</button>
        <img src="" alt="Kattalashtirilgan rasm" id="lightbox-img">
        <div class="lightbox-caption">
          <span id="lightbox-text"></span>
          <span id="lightbox-category" style="color: var(--accent-gold); font-size: 0.85rem;"></span>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('#lightbox-img');
    const lightboxText = lightbox.querySelector('#lightbox-text');
    const lightboxCat = lightbox.querySelector('#lightbox-category');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-title')?.textContent || '';
        const cat = item.querySelector('.gallery-cat')?.textContent || '';
        if (img) {
          lightboxImg.src = img.src;
          lightboxText.textContent = title;
          lightboxCat.textContent = cat;
          lightbox.classList.add('is-active');
        }
      });
    });

    closeBtn.addEventListener('click', () => lightbox.classList.remove('is-active'));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('is-active');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
        lightbox.classList.remove('is-active');
      }
    });
  }
}

// 5. Achievement Tabs
function initAchievementTabs() {
  const tabBtns = document.querySelectorAll('.achieve-tab-btn');
  const cards = document.querySelectorAll('.achieve-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetCategory = btn.getAttribute('data-target');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (targetCategory === 'all' || cat === targetCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 6. Contact Form handling
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = 'Yuborilmoqda...';

    setTimeout(() => {
      alert('Xabaringiz muvaffaqiyatli qabul qilindi! Tez orada maktab ma\'muriyati siz bilan bog\'lanadi.');
      form.reset();
      btn.disabled = false;
      btn.innerHTML = originalText;
    }, 800);
  });
}

// 7. Sticky Navbar Shadow
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 6px 20px rgba(11, 37, 69, 0.12)';
    } else {
      navbar.style.boxShadow = '0 1px 2px 0 rgba(11, 37, 69, 0.05)';
    }
  });
}
