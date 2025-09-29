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
duration: 0.7,
easing: t => 1 - Math.pow(1 - t, 3),
smooth: true,
});
function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// Looping text
const track = document.getElementById('scrollTrack');
lenis.on('scroll', ({ scroll }) => {
track.style.transform = `translateX(${-scroll * 0.3 % track.scrollWidth}px)`;
});

// Carousel infinite scroll
(function(){
const carousel = document.getElementById('carouselTrack');
const wrapper  = carousel.parentElement;
const nextBtn  = document.getElementById('nextBtn');
const prevBtn  = document.getElementById('prevBtn');

const originalHTML = Array.from(carousel.children).map(el => el.outerHTML);
const N = originalHTML.length;
if (!N) return;

// triple batch [A][A][A] untuk infinite scroll
carousel.innerHTML = '';
for (let b = 0; b < 3; b++) {
    originalHTML.forEach(html => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html.trim();
    carousel.appendChild(tmp.firstChild);
    });
}

function imagesLoaded(parent){
    const imgs = parent.querySelectorAll('img');
    return Promise.all(
    Array.from(imgs).map(img => img.complete
        ? Promise.resolve()
        : new Promise(res => { img.onload = res; img.onerror = res; }))
    );
}

let gap = 24, cardW = 0, step = 0;
const duration = 500;                  
const easing  = 'ease-in-out';              
let index = N;
let isAnimating = false;

function computeSizes(){
    const gapStr = getComputedStyle(carousel).gap || '24px';
    gap = parseFloat(gapStr) || 24;
    cardW = carousel.children[0].getBoundingClientRect().width;
    step  = cardW + gap;
}

function setInstant(i){
    carousel.style.transition = 'none';
    carousel.style.transform  = `translateX(-${i * step}px)`;
}
function setAnimated(i){
    carousel.style.transition = `transform ${duration}ms ${easing}`;
    carousel.style.transform  = `translateX(-${i * step}px)`;
    isAnimating = true;
}

carousel.addEventListener('transitionend', () => {
    if (index >= 2 * N) {
    index -= N;
    setInstant(index);
    void carousel.offsetWidth;
    } else if (index < N) {
    index += N;
    setInstant(index);
    void carousel.offsetWidth;
    }
    setTimeout(() => { isAnimating = false; }, 20);
});

imagesLoaded(carousel).then(() => {
    computeSizes();
    index = N;
    setInstant(index);
    setTimeout(()=> {
    carousel.style.transition = `transform ${duration}ms ${easing}`;
    }, 30);
});

nextBtn.addEventListener('click', () => {
    if (isAnimating) return;
    index++;
    setAnimated(index);
});
prevBtn.addEventListener('click', () => {
    if (isAnimating) return;
    index--;
    setAnimated(index);
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
    computeSizes();
    setInstant(index);
    setTimeout(()=> {
        carousel.style.transition = `transform ${duration}ms ${easing}`;
    }, 20);
    }, 120);
});
})();

// Fade-in teks "Why Rex Construct" saat muncul di viewport
const whyText = document.getElementById('why-text');
if (whyText) {
const observer = new IntersectionObserver(
    (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
        whyText.classList.remove('opacity-0', 'translate-y-8');
        observer.disconnect();
        }
    });
    },
    { threshold: 0.4 }
);
observer.observe(whyText);
}

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