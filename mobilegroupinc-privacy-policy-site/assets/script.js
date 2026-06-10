(function () {
  const root = document.documentElement;
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const printButton = document.querySelector('[data-print]');
  const progressBar = document.getElementById('reading-progress-bar');
  const year = document.getElementById('current-year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const storedTheme = window.localStorage.getItem('mgi-privacy-theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    root.dataset.theme = storedTheme;
  }

  function closeMobileNav() {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.classList.remove('nav-open');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('open', !isOpen);
      document.body.classList.toggle('nav-open', !isOpen);
    });

    navLinks.addEventListener('click', function (event) {
      if (event.target.matches('a')) {
        closeMobileNav();
      }
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = nextTheme;
      window.localStorage.setItem('mgi-privacy-theme', nextTheme);
    });
  }

  if (printButton) {
    printButton.addEventListener('click', function () {
      window.print();
    });
  }

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', async function () {
      const value = button.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(value);
        const original = button.textContent;
        button.textContent = 'Copied';
        window.setTimeout(function () {
          button.textContent = original;
        }, 1600);
      } catch (error) {
        button.textContent = value;
      }
    });
  });

  function updateProgress() {
    if (!progressBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max <= 0 ? 0 : (window.scrollY / max) * 100;
    progressBar.style.width = value + '%';
  }

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  const sectionLinks = Array.from(document.querySelectorAll('.toc a, .nav-links a'));
  const sections = sectionLinks
    .map(function (link) {
      const id = link.getAttribute('href');
      return id && id.startsWith('#') ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        sectionLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-34% 0px -58% 0px', threshold: 0.01 });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMobileNav();
    }
  });
})();
