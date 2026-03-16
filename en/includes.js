// Shared nav & footer loader + active page highlighting + mobile menu + scroll effect
(function() {
    function loadHTML(url, targetId, callback) {
        fetch(url)
            .then(r => r.text())
            .then(html => {
                document.getElementById(targetId).innerHTML = html;
                if (callback) callback();
            });
    }

    function highlightActive() {
        const page = location.pathname.split('/').pop() || 'index.html';

        // Highlight active desktop nav link
        document.querySelectorAll('#mainNav .hidden.md\\:flex a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            const linkPage = href.split('#')[0] || 'index.html';
            if (linkPage === page) {
                link.classList.add('font-semibold');
                link.classList.remove('text-white/70');
                link.classList.add('text-white');
            }
        });

        // Highlight Use Cases dropdown trigger if on a use-case page
        if (page.startsWith('use-case-')) {
            const ddTrigger = document.querySelector('.nav-dropdown > a');
            if (ddTrigger) {
                ddTrigger.classList.add('font-semibold');
                ddTrigger.classList.remove('text-white/70');
                ddTrigger.classList.add('text-white');
            }
        }

        // Highlight active mobile link
        document.querySelectorAll('#mobileMenu a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            const linkPage = href.split('#')[0] || 'index.html';
            if (linkPage === page) {
                link.classList.add('font-semibold', 'text-white');
            }
        });
    }

    function initNav() {
        // Mobile menu toggle
        const btn = document.getElementById('mobileMenuBtn');
        const menu = document.getElementById('mobileMenu');
        if (btn && menu) {
            btn.addEventListener('click', () => menu.classList.toggle('hidden'));
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => menu.classList.add('hidden'));
            });
        }

        // Nav scroll effect
        const nav = document.getElementById('mainNav');
        if (nav) {
            window.addEventListener('scroll', () => {
                nav.classList.toggle('nav-scrolled', window.scrollY > 80);
            });
            // Check on load too
            nav.classList.toggle('nav-scrolled', window.scrollY > 80);
        }

        highlightActive();
    }

    // Load nav and footer
    const navTarget = document.getElementById('nav-placeholder');
    const footerTarget = document.getElementById('footer-placeholder');

    let loaded = 0;
    const total = (navTarget ? 1 : 0) + (footerTarget ? 1 : 0);

    function onLoaded() {
        loaded++;
        if (loaded >= total) initNav();
    }

    if (navTarget) loadHTML('nav.html', 'nav-placeholder', onLoaded);
    if (footerTarget) loadHTML('footer.html', 'footer-placeholder', onLoaded);

    // If no placeholders found, still init nav (for inline nav)
    if (total === 0) initNav();
})();
