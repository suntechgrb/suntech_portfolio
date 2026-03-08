/**
 * Portfolio Interaction Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year in Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle hamburger animation (optional)
            hamburger.classList.toggle('is-active');
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('is-active');
            }
        });
    });

    // 4. Scroll Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Language Switcher & i18n
    const langBtn = document.getElementById('currentLang');
    const langDropdown = document.querySelector('.lang-dropdown');

    // Toggle Dropdown
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            langDropdown.classList.toggle('show');
        });
    }

    // Close dropdown on outside click
    window.addEventListener('click', (e) => {
        if (!e.target.matches('.lang-btn')) {
            if (langDropdown && langDropdown.classList.contains('show')) {
                langDropdown.classList.remove('show');
            }
        }
    });

    // Change Language
    const setLanguage = (lang) => {
        const t = window.translations[lang];
        if (!t) return;

        // Update DOM elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (key === 'page_title') {
                    document.title = t[key];
                } else if (key === 'hero_title_1') {
                    el.innerHTML = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });

        // Update Button text
        if (langBtn) langBtn.textContent = lang.toUpperCase();

        // Update RTL/LTR & Font
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
            document.body.classList.add('arabic-font');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', lang);
            document.body.classList.remove('arabic-font');
        }

        // Save preference
        localStorage.setItem('preferredLang', lang);
    };

    // Attach click events to lang options
    document.querySelectorAll('.lang-dropdown a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = e.target.getAttribute('data-lang');
            setLanguage(selectedLang);
        });
    });

    // Initialize Language
    const savedLang = localStorage.getItem('preferredLang') || 'fr';
    setLanguage(savedLang);

    // 6. Theme Toggle Logic
    const themeBtn = document.getElementById('themeToggle');

    // Initial check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            if (newTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});
