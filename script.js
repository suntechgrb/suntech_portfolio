document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('year');
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.getElementById('themeToggle');
    const langBtn = document.getElementById('currentLang');
    const langDropdown = document.getElementById('langDropdown');

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        });
    });

    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (event) => {
            event.preventDefault();
            langDropdown.classList.toggle('show');
        });
    }

    window.addEventListener('click', (event) => {
        if (!event.target.matches('.lang-btn') && langDropdown) {
            langDropdown.classList.remove('show');
        }
    });

    const applyLanguage = (lang) => {
        const dict = window.translations && window.translations[lang];
        if (!dict) return;

        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            if (dict[key]) {
                element.textContent = dict[key];
            }
        });

        document.querySelectorAll('[data-i18n-content]').forEach((element) => {
            const key = element.getAttribute('data-i18n-content');
            if (dict[key]) {
                element.setAttribute('content', dict[key]);
            }
        });

        if (dict.page_title) {
            document.title = dict.page_title;
        }

        if (langBtn) {
            langBtn.textContent = lang.toUpperCase();
        }

        document.querySelectorAll('.case-media.is-empty').forEach((media) => {
            media.setAttribute('data-empty-text', dict.screenshot_fallback || 'Project screenshot coming soon');
        });

        if (lang === 'ar') {
            document.documentElement.setAttribute('lang', 'ar');
            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('arabic-font');
        } else {
            document.documentElement.setAttribute('lang', lang);
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.classList.remove('arabic-font');
        }

        localStorage.setItem('preferredLang', lang);
    };

    document.querySelectorAll('.lang-dropdown a').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedLang = link.getAttribute('data-lang') || 'fr';
            applyLanguage(selectedLang);
        });
    });

    const savedLang = localStorage.getItem('preferredLang') || 'fr';
    applyLanguage(savedLang);

    document.querySelectorAll('.case-media img').forEach((image) => {
        image.addEventListener('error', () => {
            const parent = image.closest('.case-media');
            if (!parent) return;
            image.style.display = 'none';
            parent.classList.add('is-empty');
            const lang = document.documentElement.getAttribute('lang') || 'fr';
            const fallbackText = window.translations?.[lang]?.screenshot_fallback || 'Project screenshot coming soon';
            parent.setAttribute('data-empty-text', fallbackText);
        });
    });

    document.querySelectorAll('.case-media-carousel').forEach((carousel) => {
        const images = Array.from(carousel.querySelectorAll('img'));
        if (images.length === 0) return;

        let currentIndex = 0;
        const interval = Number(carousel.getAttribute('data-slide-interval')) || 2600;

        const showSlide = (index) => {
            images.forEach((image, imageIndex) => {
                image.classList.toggle('active', imageIndex === index);
            });
        };

        showSlide(currentIndex);

        if (images.length === 1) return;

        let timer = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            showSlide(currentIndex);
        }, interval);

        const pause = () => {
            if (!timer) return;
            clearInterval(timer);
            timer = null;
        };

        const resume = () => {
            if (timer) return;
            timer = setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                showSlide(currentIndex);
            }, interval);
        };

        carousel.addEventListener('mouseenter', pause);
        carousel.addEventListener('mouseleave', resume);
        carousel.addEventListener('touchstart', pause, { passive: true });
        carousel.addEventListener('touchend', resume);
    });

    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (isLight) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

    document.querySelectorAll('.filter-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter') || 'all';
            document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            document.querySelectorAll('.case-card').forEach((card) => {
                const categories = card.getAttribute('data-category') || '';
                const visible = filter === 'all' || categories.includes(filter);
                card.style.display = visible ? 'flex' : 'none';
            });
        });
    });
});
