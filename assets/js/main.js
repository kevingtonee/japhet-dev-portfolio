/* ============================================
   Footer year
   ============================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================
   Sticky header background on scroll
   ============================================ */
const header = document.getElementById('siteHeader');
if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================
   Mobile navigation
   ============================================ */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    const closeNav = () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.classList.contains('open')) return;
        if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
        closeNav();
    });
}

/* ============================================
   Scroll reveal via IntersectionObserver
   (restrained: sections + grid items, observed once)
   ============================================ */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
} else {
    revealEls.forEach((el) => el.classList.add('active'));
}

/* ============================================
   Active nav link on scroll (scroll-spy)
   ============================================ */
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    const setActive = (id) => {
        navAnchors.forEach((a) => {
            const match = a.getAttribute('href') === `#${id}`;
            a.classList.toggle('is-active', match);
        });
    };

    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(entry.target.id);
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((section) => spy.observe(section));
}

/* ============================================
   Contact form — submit to Formspree via fetch for inline feedback
   ============================================ */
const form = document.querySelector('.contact-form');
const status = document.getElementById('formStatus');

const FORM_MESSAGES = {
    name: 'Please enter your name.',
    email: 'Please enter a valid email address.',
    message: 'Tell me a little more about the project (at least 10 characters).',
};

function validateField(field) {
    const group = field.closest('.form-group');
    const errorEl = group ? group.querySelector('.form-error') : null;
    const isValid = field.checkValidity();

    if (group) group.classList.toggle('has-error', !isValid);
    if (errorEl) errorEl.textContent = isValid ? '' : (FORM_MESSAGES[field.name] || 'Please check this field.');

    return isValid;
}

if (form) {
    const fields = form.querySelectorAll('input[required], textarea[required]');

    fields.forEach((field) => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            const group = field.closest('.form-group');
            if (group && group.classList.contains('has-error')) validateField(field);
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let allValid = true;
        fields.forEach((field) => {
            if (!validateField(field)) allValid = false;
        });
        if (!allValid) {
            status.className = 'form-status error';
            status.textContent = 'Please fix the highlighted fields and try again.';
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        status.className = 'form-status';
        status.textContent = 'Sending...';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });
            if (res.ok) {
                form.reset();
                status.className = 'form-status success';
                status.textContent = "Thanks — your message is on its way. I'll reply soon.";
            } else {
                const data = await res.json().catch(() => ({}));
                status.className = 'form-status error';
                status.textContent = data.errors?.[0]?.message || 'Something went wrong. Please email me directly.';
            }
        } catch {
            status.className = 'form-status error';
            status.textContent = 'Network error. Please email me directly at japhetkevingtone@gmail.com.';
        } finally {
            submitBtn.disabled = false;
        }
    });
}
