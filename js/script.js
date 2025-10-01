// Sidebar Open/Close
const menuBtn     = document.getElementById('menu-btn');
const sidebar     = document.getElementById('sidebar-panel');
const overlay     = document.getElementById('sidebar-overlay');
const closeSidebar= document.getElementById('close-sidebar');

function openSidebar() {
sidebar.classList.remove('translate-x-full');
overlay.classList.remove('opacity-0', 'pointer-events-none');
}

function closeSidebarFn() {
sidebar.classList.add('translate-x-full');
overlay.classList.add('opacity-0', 'pointer-events-none');
}

menuBtn.addEventListener('click', openSidebar);
closeSidebar.addEventListener('click', closeSidebarFn);
overlay.addEventListener('click', closeSidebarFn);

// Optional: ESC key to close
document.addEventListener('keydown', e => {
if (e.key === 'Escape') closeSidebarFn();
});

// Lenis smooth scroll
const lenis = new Lenis({
duration: 0.9,
easing: t => 1 - Math.pow(1 - t, 3),
smooth: true,
});
function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// Footer fade-in saat masuk viewport
const footerEl = document.getElementById('site-footer');
if (footerEl) {
const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
    if (entry.isIntersecting) {
        footerEl.classList.remove('opacity-0', 'translate-y-16');
        footerObserver.disconnect();
    }
    });
}, { threshold: 0.2 });
footerObserver.observe(footerEl);
}