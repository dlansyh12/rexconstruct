const track = document.getElementById('scrollTrack');

lenis.on('scroll', ({ scroll }) => {
  // perhitungan scroll + loop
  track.style.transform = `translateX(${-scroll * 0.3 % track.scrollWidth}px)`;
});

// Projects Showcase
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
        : new Promise(res => { img.onload = res; img.onerror = res; })));
}

let gap = 24, cardW = 0, step = 0;
const duration = 800;                   // lebih smooth & berat
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

// Touchpad swipe support stabil → 1 gesture = 1 slide
const SWIPE_THRESHOLD = 40;   // sensitivitas geser
let wheelBuffer = 0;
let wheelCooldown = false;

wrapper.addEventListener('wheel', (e) => {
    if (isAnimating || wheelCooldown) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        wheelBuffer += e.deltaX;

        if (Math.abs(wheelBuffer) > SWIPE_THRESHOLD) {
            if (wheelBuffer > 0) {
                index++;
            } else {
                index--;
            }
            setAnimated(index);

            // Lock gesture → cegah double trigger
            wheelCooldown = true;
            wheelBuffer = 0;

            // Cooldown sesuai durasi animasi + buffer
            setTimeout(() => {
                wheelCooldown = false;
            }, duration + 150); 
        }
    }
}, { passive: false });

// mobile
let touchStartX = 0;
let touchBuffer = 0;
let touchCooldown = false;

wrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].pageX;
    touchBuffer = 0;
}, { passive: true });

wrapper.addEventListener('touchmove', (e) => {
    if (isAnimating || touchCooldown || e.touches.length !== 1) return;
    let deltaX = e.touches[0].pageX - touchStartX;
    touchBuffer += deltaX;
    touchStartX = e.touches[0].pageX;
}, { passive: true });

wrapper.addEventListener('touchend', (e) => {
    if (isAnimating || touchCooldown) return;

    if (Math.abs(touchBuffer) > SWIPE_THRESHOLD) {
        if (touchBuffer < 0) {
            index++;
        } else {
            index--;
        }
        setAnimated(index);

        touchCooldown = true;
        touchBuffer = 0;

        setTimeout(() => {
            touchCooldown = false;
        }, duration + 150);
    }
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

// Scroll line animation
const scrollLine = document.getElementById("scroll-line");
if (scrollLine) {
  lenis.on("scroll", ({ scroll }) => {
    const section = scrollLine.closest("section");
    const rect = section.getBoundingClientRect();
    const winH = window.innerHeight;

    // Hitung progress (0 - 1) berdasarkan posisi viewport
    let progress = 0;
    if (rect.top < winH && rect.bottom > 0) {
      const visible = Math.min(winH, rect.bottom) - Math.max(0, rect.top);
      const total = rect.height + winH;
      progress = 1 - (rect.bottom - visible) / total;
      progress = Math.min(Math.max(progress, 0), 1);
    }

    // Update lebar garis (dari kiri → kanan / kanan → kiri)
    scrollLine.style.width = `${progress * 100}%`;
  });
}