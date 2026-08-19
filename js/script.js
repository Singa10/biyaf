/* ---------- Mobile nav ---------- */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

if (navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
if (navClose) navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
document.querySelectorAll('.nav-link').forEach(link =>
  link.addEventListener('click', () => navMenu.classList.remove('show-menu'))
);

/* ---------- Theme Toggle (Dark/Light Mode) ---------- */
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Get saved theme from localStorage or default to 'dark'
const getCurrentTheme = () => localStorage.getItem('theme') || 'dark';

// Apply theme on page load
const applyTheme = (theme) => {
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// Initialize theme on page load
applyTheme(getCurrentTheme());

// Theme toggle button handler
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });
}

/* ---------- Header shadow on scroll ---------- */
const header = document.getElementById('header');
const shadowHeader = () => {
  window.scrollY >= 40 ? header.classList.add('shadow-header') : header.classList.remove('shadow-header');
};
window.addEventListener('scroll', shadowHeader);
shadowHeader();

/* ---------- Scroll-up button ---------- */
const scrollBtn = document.getElementById('scroll-up');
const toggleScrollBtn = () => {
  window.scrollY >= 350 ? scrollBtn.classList.add('show-scroll') : scrollBtn.classList.remove('show-scroll');
};
if (scrollBtn) window.addEventListener('scroll', toggleScrollBtn);

/* ---------- Active nav link by current page ---------- */
(() => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active-link');
    }
  });
})();

/* ---------- Scroll reveal ---------- */
if (window.ScrollReveal) {
  const sr = ScrollReveal({
    origin: 'bottom',
    distance: '40px',
    duration: 900,
    delay: 100,
    easing: 'cubic-bezier(.4,.1,.2,1)',
    reset: false
  });
  sr.reveal('.reveal', { interval: 120 });
}

/* ---------- Animated stat counters ---------- */
const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let start = 0;
      const duration = 1400;
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

/* ---------- Project filters (projects.html) ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
  const cards = document.querySelectorAll('[data-category]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('project-hidden', !match);
      });
    });
  });
}

/* ---------- Contact form (front-end only feedback) ---------- */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message Sent';
    btn.disabled = true;
    contactForm.reset();
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 2600);
  });
}

/* ---------- Language Selector ---------- */
const langSelector = document.getElementById('lang-selector');
const langTrigger = document.getElementById('lang-trigger');
const langDropdown = document.getElementById('lang-dropdown');
const currentLangDisplay = document.getElementById('current-lang');

if (langSelector && langTrigger && langDropdown) {
  // Language labels
  const langLabels = {
    en: 'EN',
    am: 'አማ',
    om: 'OM'
  };

  // Update current language display
  const updateCurrentLangDisplay = () => {
    const currentLang = Translations.currentLang;
    currentLangDisplay.textContent = langLabels[currentLang] || 'EN';
  };

  // Toggle dropdown
  langTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    langSelector.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!langSelector.contains(e.target)) {
      langSelector.classList.remove('active');
    }
  });

  // Language option click handlers
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', () => {
      const selectedLang = option.getAttribute('data-lang');
      
      // Update active state
      document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
      });
      option.classList.add('active');
      
      // Set language
      Translations.setLanguage(selectedLang);
      
      // Update display
      updateCurrentLangDisplay();
      
      // Close dropdown
      langSelector.classList.remove('active');
    });
  });

  // Initialize display
  updateCurrentLangDisplay();

  // Listen for language changes from other sources
  window.addEventListener('languageChanged', updateCurrentLangDisplay);
}
