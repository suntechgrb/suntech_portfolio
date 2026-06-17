const COOKIE_CONSENT_KEY = 'cookieConsent';
const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600&family=Cairo:wght@400;500;600&display=swap';

const loadGoogleFonts = () => {
    if (document.getElementById('google-fonts-link')) return;

    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    const fontsLink = document.createElement('link');
    fontsLink.id = 'google-fonts-link';
    fontsLink.rel = 'stylesheet';
    fontsLink.href = GOOGLE_FONTS_URL;
    fontsLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontsLink);
};

const getCookieConsent = () => localStorage.getItem(COOKIE_CONSENT_KEY);

const setCookieConsent = (value) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    if (value === 'accepted') {
        loadGoogleFonts();
    }
};

const showCookieBanner = () => {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    banner.classList.add('visible');
    banner.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cookie-banner-open');
};

const hideCookieBanner = () => {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    banner.classList.remove('visible');
    banner.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cookie-banner-open');
};

const initCookieConsent = () => {
    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('cookieAccept');
    const rejectBtn = document.getElementById('cookieReject');
    const settingsBtn = document.getElementById('cookieSettingsBtn');

    if (!banner || !acceptBtn || !rejectBtn) return;

    const savedConsent = getCookieConsent();
    if (savedConsent === 'accepted') {
        loadGoogleFonts();
        hideCookieBanner();
    } else if (savedConsent === 'rejected') {
        hideCookieBanner();
    } else {
        showCookieBanner();
    }

    acceptBtn.addEventListener('click', () => {
        setCookieConsent('accepted');
        hideCookieBanner();
    });

    rejectBtn.addEventListener('click', () => {
        setCookieConsent('rejected');
        hideCookieBanner();
    });

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            showCookieBanner();
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
        const rel = link.getAttribute('rel') || '';
        if (!rel.includes('noopener')) {
            link.setAttribute('rel', rel ? `${rel} noopener noreferrer` : 'noopener noreferrer');
        }
    });

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

    const heroSection = document.querySelector('.hero');
    const backToTop = document.getElementById('backToTop');
    const projectModal = document.getElementById('projectModal');
    const projectModalTitle = document.getElementById('projectModalTitle');
    const projectModalSector = document.getElementById('projectModalSector');
    const projectModalImage = document.getElementById('projectModalImage');
    const projectModalMetrics = document.getElementById('projectModalMetrics');
    const projectModalStack = document.getElementById('projectModalStack');
    const projectModalDesc = document.getElementById('projectModalDesc');

    const applyImagePerfHints = () => {
        document.querySelectorAll('img').forEach((img) => {
            const isHero = Boolean(img.closest('.hero-media'));
            const isLogo = Boolean(img.classList.contains('logo-img'));
            const hasHighPriority = img.getAttribute('fetchpriority') === 'high';

            if (!isHero && !isLogo && !hasHighPriority) {
                if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
                if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
            }

            if (!img.hasAttribute('width')) img.setAttribute('width', '1200');
            if (!img.hasAttribute('height')) img.setAttribute('height', '750');
        });
    };

    const applyCaseResultBadges = () => {
        document.querySelectorAll('.case-card').forEach((card) => {
            const media = card.querySelector('.case-media');
            if (!media) return;
            if (media.querySelector('.case-result-badge')) return;
            const firstMetric = card.querySelector('.case-metric');
            if (!firstMetric) return;

            const badge = document.createElement('span');
            badge.className = 'case-result-badge';
            badge.textContent = firstMetric.textContent || '';
            media.appendChild(badge);
        });
    };

    const updateNavbarState = () => {
        if (!navbar) return;
        const scrollY = window.scrollY;
        const isHome = document.body.classList.contains('page-home');

        if (isHome && heroSection) {
            const pastHero = heroSection.getBoundingClientRect().bottom <= 0;
            navbar.classList.toggle('show-logo', pastHero);
            navbar.classList.toggle('scrolled', pastHero);
        } else {
            navbar.classList.toggle('scrolled', scrollY > 40);
            navbar.classList.add('show-logo');
        }
    };

    updateNavbarState();
    window.addEventListener('scroll', updateNavbarState, { passive: true });
    window.addEventListener('resize', updateNavbarState);

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

        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (dict[key]) {
                element.setAttribute('placeholder', dict[key]);
            }
        });

        document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
            const key = element.getAttribute('data-i18n-aria');
            if (dict[key]) {
                element.setAttribute('aria-label', dict[key]);
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
    initCookieConsent();
    applyImagePerfHints();
    applyCaseResultBadges();

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
    if (savedTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
    } else {
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

    const revealSelectors = '.pain-card, .service-card-link, .case-card, .process-step, .testimonial-card, .review-form-wrap, .hero-proof-stat';

    const projectTypeSelect = document.getElementById('projectType');
    const formSubmitNext = document.getElementById('formSubmitNext');
    const reviewSubmitNext = document.getElementById('reviewSubmitNext');
    const leadForm = document.getElementById('leadForm');
    const formSuccess = document.getElementById('formSuccess');
    const reviewForm = document.getElementById('reviewForm');
    const reviewSuccess = document.getElementById('reviewSuccess');

    if (formSubmitNext) {
        const returnUrl = new URL(window.location.href.split('#')[0]);
        returnUrl.searchParams.set('sent', '1');
        returnUrl.hash = 'contact';
        formSubmitNext.value = returnUrl.toString();
    }

    const showFormSuccess = () => {
        if (leadForm) leadForm.hidden = true;
        if (formSuccess) formSuccess.hidden = false;
    };

    const showFormError = (message) => {
        if (!leadForm) return;
        let errorEl = document.getElementById('formError');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.id = 'formError';
            errorEl.className = 'form-error';
            leadForm.prepend(errorEl);
        }
        errorEl.textContent = message;
        errorEl.removeAttribute('hidden');
    };

    if (leadForm) {
        leadForm.addEventListener('submit', (event) => {
            const name = leadForm.querySelector('input[name="name"]');
            const email = leadForm.querySelector('input[name="email"]');
            const projectType = leadForm.querySelector('select[name="project_type"]');
            const message = leadForm.querySelector('textarea[name="message"]');

            const emailOk = email && email.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
            const nameOk = name && name.value && name.value.trim().length >= 2;
            const typeOk = projectType && projectType.value;
            const msgOk = message && message.value && message.value.trim().length >= 10;

            if (!nameOk || !emailOk || !typeOk || !msgOk) {
                event.preventDefault();
                showFormError('Please fill in your name, a valid email, project type, and a short description.');
                const firstInvalid = [nameOk ? null : name, emailOk ? null : email, typeOk ? null : projectType, msgOk ? null : message].find(Boolean);
                if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
            }
        });
    }

    if (reviewSubmitNext) {
        const reviewReturnUrl = new URL(window.location.href.split('#')[0]);
        reviewReturnUrl.searchParams.set('review_sent', '1');
        reviewReturnUrl.hash = 'give-review';
        reviewSubmitNext.value = reviewReturnUrl.toString();
    }

    const showReviewSuccess = () => {
        if (reviewForm) reviewForm.hidden = true;
        if (reviewSuccess) reviewSuccess.hidden = false;
    };

    const scrollToSection = (target) => {
        if (!target) return;
        const el = target.classList.contains('section-shell') || target.id === 'contact'
            ? target
            : target.closest('.section-shell, #contact, section[id]');
        if (!el) return;

        const navbarEl = document.getElementById('navbar');
        const chaptersEl = document.getElementById('chaptersNav');
        let offset = navbarEl ? navbarEl.offsetHeight : 64;
        if (chaptersEl && chaptersEl.classList.contains('is-visible')) {
            offset += chaptersEl.offsetHeight;
        }
        offset += 12;

        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    };

    const initChaptersNav = () => {
        const chaptersNav = document.getElementById('chaptersNav');
        const chaptersProgress = document.getElementById('chaptersProgress');
        const heroIntro = document.querySelector('.hero-intro');
        if (!chaptersNav || !heroIntro) return;

        const chapterLinks = Array.from(chaptersNav.querySelectorAll('.chapter-link'));
        const sections = [
            'needs',
            'services',
            'projects',
            'process',
            'testimonials',
            'contact'
        ]
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        const syncNavMetrics = () => {
            const navbarEl = document.getElementById('navbar');
            if (navbarEl) {
                document.documentElement.style.setProperty('--nav-height', `${navbarEl.offsetHeight}px`);
            }
            const height = chaptersNav.classList.contains('is-visible') ? chaptersNav.offsetHeight : 0;
            document.documentElement.style.setProperty('--chapters-height', `${height}px`);
        };

        const updateVisibility = () => {
            const show = window.scrollY > 160 || heroIntro.getBoundingClientRect().bottom <= 100;
            chaptersNav.classList.toggle('is-visible', show);
            document.body.classList.toggle('chapters-visible', show);
            syncNavMetrics();
        };

        const setActiveChapter = (id) => {
            chapterLinks.forEach((link) => {
                const isActive = link.dataset.chapter === id;
                link.classList.toggle('is-active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        const updateProgress = () => {
            if (!chaptersProgress || sections.length < 2) return;
            const first = sections[0];
            const last = sections[sections.length - 1];
            const start = first.offsetTop;
            const end = last.offsetTop + last.offsetHeight;
            const range = end - start;
            if (range <= 0) return;
            const pct = Math.min(100, Math.max(0, ((window.scrollY - start + 120) / range) * 100));
            chaptersProgress.style.width = `${pct}%`;
        };

        const updateActiveChapter = () => {
            if (!chaptersNav.classList.contains('is-visible')) return;

            const navbarEl = document.getElementById('navbar');
            let offset = navbarEl ? navbarEl.offsetHeight : 64;
            offset += chaptersNav.offsetHeight + 24;

            let currentId = sections[0]?.id;
            sections.forEach((section) => {
                if (section.getBoundingClientRect().top <= offset) {
                    currentId = section.id;
                }
            });

            setActiveChapter(currentId);
            updateProgress();

            const activeLink = chapterLinks.find((link) => link.dataset.chapter === currentId);
            const inner = chaptersNav.querySelector('.chapters-nav-inner');
            if (activeLink && inner) {
                const linkLeft = activeLink.offsetLeft;
                const linkWidth = activeLink.offsetWidth;
                const innerWidth = inner.clientWidth;
                const scrollTarget = linkLeft - innerWidth / 2 + linkWidth / 2;
                inner.scrollTo({ left: scrollTarget, behavior: 'smooth' });
            }
        };

        let scrollTicking = false;
        const onScroll = () => {
            if (scrollTicking) return;
            scrollTicking = true;
            requestAnimationFrame(() => {
                updateVisibility();
                updateActiveChapter();
                scrollTicking = false;
            });
        };

        chapterLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
            });
        });

        updateVisibility();
        updateActiveChapter();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => {
            syncNavMetrics();
            updateActiveChapter();
        });
    };

    initChaptersNav();

    const openAccordionForTarget = scrollToSection;

    if (new URLSearchParams(window.location.search).get('sent') === '1') {
        showFormSuccess();
    }

    if (new URLSearchParams(window.location.search).get('review_sent') === '1') {
        showReviewSuccess();
        const giveReview = document.getElementById('give-review');
        if (giveReview) {
            scrollToSection(giveReview);
            giveReview.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    document.querySelectorAll('.pain-card[data-project-type]').forEach((card) => {
        card.addEventListener('click', () => {
            const type = card.getAttribute('data-project-type');
            if (projectTypeSelect && type) {
                projectTypeSelect.value = type;
            }
        });
    });

    document.querySelectorAll('.reveal').forEach((section) => {
        section.querySelectorAll(revealSelectors).forEach((item, index) => {
            item.classList.add('reveal-item');
            item.style.setProperty('--reveal-delay', `${Math.min(index * 0.06, 0.45)}s`);
        });
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const hash = link.getAttribute('href');
            if (!hash || hash.length < 2) return;
            const target = document.querySelector(hash);
            if (target) {
                event.preventDefault();
                openAccordionForTarget(target);
            }
        });
    });

    if (window.location.hash) {
        const hashTarget = document.querySelector(window.location.hash);
        if (hashTarget) {
            openAccordionForTarget(hashTarget);
        }
    }

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

            const url = new URL(window.location.href);
            if (filter === 'all') {
                url.searchParams.delete('filter');
            } else {
                url.searchParams.set('filter', filter);
            }
            window.history.replaceState({}, '', url.toString());

            window.requestAnimationFrame(() => {
                const projectsTrack = document.getElementById('projectsTrack');
                if (projectsTrack) projectsTrack.scrollTo({ left: 0, behavior: 'smooth' });
                if (typeof updateProjectsCarousel === 'function') updateProjectsCarousel();
            });
        });
    });

    let updateProjectsCarousel = () => {};

    const applyFilterFromUrl = () => {
        const filter = new URLSearchParams(window.location.search).get('filter') || 'all';
        const button = document.querySelector(`.filter-btn[data-filter="${filter}"]`) || document.querySelector('.filter-btn[data-filter="all"]');
        if (button) button.click();
    };
    applyFilterFromUrl();

    const initProjectsCarousel = () => {
        const track = document.getElementById('projectsTrack');
        const progress = document.getElementById('projectsScrollProgress');
        const prevBtn = document.querySelector('.projects-nav-prev');
        const nextBtn = document.querySelector('.projects-nav-next');
        if (!track) return;

        const getScrollStep = () => {
            const visibleCard = Array.from(track.querySelectorAll('.case-card')).find(
                (card) => card.style.display !== 'none'
            );
            return visibleCard ? visibleCard.offsetWidth + 18 : 360;
        };

        const updateCarouselUi = () => {
            const max = track.scrollWidth - track.clientWidth;
            const atStart = track.scrollLeft <= 4;
            const atEnd = track.scrollLeft >= max - 4;

            if (prevBtn) prevBtn.disabled = atStart;
            if (nextBtn) nextBtn.disabled = atEnd || max <= 0;

            if (progress) {
                const pct = max > 0 ? (track.scrollLeft / max) * 100 : 100;
                progress.style.width = `${pct}%`;
            }
        };

        const scrollCarousel = (direction) => {
            track.scrollBy({ left: direction * getScrollStep(), behavior: 'smooth' });
        };

        if (prevBtn) prevBtn.addEventListener('click', () => scrollCarousel(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => scrollCarousel(1));

        track.addEventListener('scroll', updateCarouselUi, { passive: true });
        window.addEventListener('resize', updateCarouselUi);

        let isDragging = false;
        let startX = 0;
        let startScroll = 0;

        track.addEventListener('pointerdown', (event) => {
            if (event.pointerType === 'touch') return;
            isDragging = true;
            startX = event.clientX;
            startScroll = track.scrollLeft;
            track.classList.add('is-dragging');
            track.setPointerCapture(event.pointerId);
        });

        track.addEventListener('pointermove', (event) => {
            if (!isDragging) return;
            track.scrollLeft = startScroll - (event.clientX - startX) * 1.15;
        });

        const endDrag = (event) => {
            if (!isDragging) return;
            isDragging = false;
            track.classList.remove('is-dragging');
            if (event.pointerId !== undefined) {
                try { track.releasePointerCapture(event.pointerId); } catch (_) { /* noop */ }
            }
            updateCarouselUi();
        };

        track.addEventListener('pointerup', endDrag);
        track.addEventListener('pointercancel', endDrag);
        track.addEventListener('pointerleave', endDrag);

        updateCarouselUi();
        updateProjectsCarousel = updateCarouselUi;
    };

    initProjectsCarousel();

    const initProjectModal = () => {
        if (!projectModal || !projectModalImage || !projectModalTitle) return;

        let currentImages = [];
        let currentIndex = 0;
        let lastFocused = null;

        const updateModalImage = () => {
            if (!projectModalImage || currentImages.length === 0) return;
            const img = currentImages[currentIndex];
            projectModalImage.src = img.src;
            projectModalImage.alt = img.alt || '';
        };

        const openModal = (card) => {
            if (!card) return;

            lastFocused = document.activeElement;

            const titleEl = card.querySelector('h3');
            const sectorEl = card.querySelector('.project-category');
            const descEl = card.querySelector('.case-desc');
            const metricEls = Array.from(card.querySelectorAll('.case-metric'));
            const stackEls = Array.from(card.querySelectorAll('.case-stack span'));

            if (projectModalTitle) projectModalTitle.textContent = titleEl?.textContent || '';
            if (projectModalSector) projectModalSector.textContent = sectorEl?.textContent || '';
            if (projectModalDesc) projectModalDesc.textContent = descEl?.textContent || '';

            if (projectModalMetrics) {
                projectModalMetrics.innerHTML = '';
                metricEls.forEach((m) => {
                    const span = document.createElement('span');
                    span.className = 'case-metric';
                    span.textContent = m.textContent || '';
                    projectModalMetrics.appendChild(span);
                });
            }

            if (projectModalStack) {
                projectModalStack.innerHTML = '';
                stackEls.forEach((s) => {
                    const span = document.createElement('span');
                    span.textContent = s.textContent || '';
                    projectModalStack.appendChild(span);
                });
            }

            const carouselImages = Array.from(card.querySelectorAll('.case-media-carousel img'));
            const singleImage = card.querySelector('.case-media img');
            currentImages = carouselImages.length ? carouselImages : (singleImage ? [singleImage] : []);
            currentIndex = Math.max(0, currentImages.findIndex((img) => img.classList.contains('active')));
            if (currentIndex < 0) currentIndex = 0;
            updateModalImage();

            projectModal.classList.add('is-open');
            projectModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
        };

        const closeModal = () => {
            projectModal.classList.remove('is-open');
            projectModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
        };

        const next = () => {
            if (currentImages.length <= 1) return;
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateModalImage();
        };

        const prev = () => {
            if (currentImages.length <= 1) return;
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateModalImage();
        };

        projectModal.querySelectorAll('[data-modal-close]').forEach((el) => {
            el.addEventListener('click', closeModal);
        });

        const prevBtn = projectModal.querySelector('.project-modal-prev');
        const nextBtn = projectModal.querySelector('.project-modal-next');
        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);

        window.addEventListener('keydown', (event) => {
            if (!projectModal.classList.contains('is-open')) return;
            if (event.key === 'Escape') closeModal();
            if (event.key === 'ArrowRight') next();
            if (event.key === 'ArrowLeft') prev();
        });

        document.querySelectorAll('.case-card').forEach((card) => {
            card.setAttribute('tabindex', '0');
            card.addEventListener('click', (event) => {
                const interactive = event.target.closest('a, button');
                if (interactive) return;
                openModal(card);
            });

            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    const interactive = event.target.closest('a, button');
                    if (interactive) return;
                    event.preventDefault();
                    openModal(card);
                }
            });
        });
    };

    initProjectModal();

    if (backToTop) {
        const updateBackToTop = () => {
            const visible = window.scrollY > 400;
            backToTop.hidden = !visible;
        };

        updateBackToTop();
        window.addEventListener('scroll', updateBackToTop, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const animateCounter = (el, target, suffix = '') => {
        const duration = 1300;
        const start = performance.now();
        const from = 0;
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const tick = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const value = Math.round(from + (target - from) * easeOutCubic(progress));
            el.textContent = `${value}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = Number(el.getAttribute('data-target')) || 0;
            const suffix = el.getAttribute('data-suffix') || '';
            animateCounter(el, target, suffix);
            observer.unobserve(el);
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -30% 0px' });

    document.querySelectorAll('[data-counter][data-target]').forEach((el) => counterObserver.observe(el));
});
