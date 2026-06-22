(function () {
    'use strict';

    // ── Navbar ───────────────────────────────────────────────────────────────
    const navbar    = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');

    function syncNavbar() {
        if (window.scrollY > 60) {
            navbar.classList.replace('at-top', 'scrolled');
        } else {
            navbar.classList.replace('scrolled', 'at-top');
        }
    }
    syncNavbar();
    window.addEventListener('scroll', syncNavbar, { passive: true });

    // ── Mobile menu ──────────────────────────────────────────────────────────
    const spans = navToggle.querySelectorAll('span');

    function openMenu() {
        navLinks.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    }

    function closeMenu() {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }

    navToggle.addEventListener('click', () =>
        navLinks.classList.contains('open') ? closeMenu() : openMenu()
    );
    document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));
    document.addEventListener('click', e => { if (!navbar.contains(e.target)) closeMenu(); });

    // ── Scroll reveal ────────────────────────────────────────────────────────
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (!entry.isIntersecting) return;
            setTimeout(() => entry.target.classList.add('revealed'), i * 80);
            revealObs.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // ── Contact form ─────────────────────────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn  = contactForm.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Sending…';
            btn.disabled    = true;

            try {
                const res = await fetch(contactForm.action, {
                    method:  'POST',
                    body:    new FormData(contactForm),
                    headers: { Accept: 'application/json' }
                });
                if (!res.ok) throw new Error();
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
            } catch {
                btn.textContent = orig;
                btn.disabled    = false;
                alert('There was an issue sending your message. Please try again or contact us directly.');
            }
        });
    }

    // ── Smooth scroll ────────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id  = a.getAttribute('href');
            if (id === '#') return;
            const el = document.querySelector(id);
            if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
}());
