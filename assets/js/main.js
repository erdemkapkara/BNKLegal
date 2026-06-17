(function () {
    'use strict';

    // ── Navbar scroll behaviour ──────────────────────────────────────────────
    const navbar    = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');

    function syncNavbar() {
        if (window.scrollY > 60) {
            navbar.classList.replace('transparent', 'scrolled');
        } else {
            navbar.classList.replace('scrolled', 'transparent');
        }
    }
    syncNavbar();
    window.addEventListener('scroll', syncNavbar, { passive: true });

    // ── Mobile menu ──────────────────────────────────────────────────────────
    const toggleSpans = navToggle.querySelectorAll('span');

    function openMenu() {
        navLinks.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        toggleSpans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        toggleSpans[1].style.opacity   = '0';
        toggleSpans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    }

    function closeMenu() {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        toggleSpans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }

    navToggle.addEventListener('click', () => {
        navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) closeMenu();
    });

    // ── Scroll reveal ────────────────────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (!entry.isIntersecting) return;
            setTimeout(() => entry.target.classList.add('revealed'), i * 90);
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ── Active nav link on scroll ────────────────────────────────────────────
    const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-cta)');
    const sections   = document.querySelectorAll('section[id]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navLinkEls.forEach(link => {
                const active = link.getAttribute('href') === `#${id}`;
                link.style.color = active ? 'var(--gold-light)' : '';
            });
        });
    }, { threshold: 0.45 });

    sections.forEach(s => sectionObserver.observe(s));

    // ── Contact form ─────────────────────────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Guard: warn if form action is still the placeholder
            if (contactForm.action.includes('YOUR_FORM_ID')) {
                alert('Form is not yet configured. Please set up a Formspree account and replace YOUR_FORM_ID in index.html.');
                return;
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<span>Sending…</span><i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;

            try {
                const res = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { Accept: 'application/json' }
                });
                if (!res.ok) throw new Error('Network response was not ok');
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
            } catch {
                btn.innerHTML = orig;
                btn.disabled  = false;
                alert('There was an issue sending your message. Please try again or contact us directly.');
            }
        });
    }

    // ── Smooth scroll for all internal anchors ───────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}());
