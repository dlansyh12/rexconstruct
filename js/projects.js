// Gallery Showcase
(function(){
const gallery = document.getElementById('galleryTrack');
if (!gallery) return;

const original = Array.from(gallery.children).map(el => el.outerHTML);
const N = original.length;
if (!N) return;

let cardW = 0, gap = 0, step = 0;
function computeSizes() {
    cardW = gallery.children[0].getBoundingClientRect().width;
    gap   = parseFloat(getComputedStyle(gallery).gap || '16');
    step  = cardW + gap;
}

function setCenter() {
    computeSizes();
    gallery.scrollLeft = N * step; // batch tengah
}

function checkLoop() {
    if (gallery.scrollLeft < N * step * 0.5) {
    gallery.scrollLeft += N * step;
    } else if (gallery.scrollLeft > N * step * 2.5) {
    gallery.scrollLeft -= N * step;
    }
}

function smoothScrollTo(target) {
    gallery.style.scrollBehavior = 'smooth';
    gallery.scrollTo({ left: target, behavior: 'smooth' });
    // reset setelah animasi biar drag normal
    setTimeout(()=> gallery.style.scrollBehavior = 'auto', 400);
}

// drag & touch vars
let isDown = false, startX, scrollLeft, hasDragged = false;

gallery.addEventListener('mousedown', e => {
    isDown = true;
    hasDragged = false;
    startX = e.pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;
});
gallery.addEventListener('mouseleave', () => isDown = false);
gallery.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    snapToNearest();
});
gallery.addEventListener('mousemove', e => {
    if(!isDown) return;
    e.preventDefault();
    hasDragged = true;
    const x = e.pageX - gallery.offsetLeft;
    const walk = (x - startX);
    gallery.scrollLeft = scrollLeft - walk;
    checkLoop();
});

// Touch
let startTouchX = 0, touchScrollLeft = 0;
gallery.addEventListener('touchstart', e => {
    startTouchX = e.touches[0].pageX;
    touchScrollLeft = gallery.scrollLeft;
}, { passive: true });
gallery.addEventListener('touchmove', e => {
    const x = e.touches[0].pageX;
    const walk = (x - startTouchX);
    gallery.scrollLeft = touchScrollLeft - walk;
    checkLoop();
}, { passive: true });
gallery.addEventListener('touchend', () => {
    snapToNearest();
});

// snap ke kartu terdekat
function snapToNearest() {
    computeSizes();
    let i = Math.round(gallery.scrollLeft / step);
    smoothScrollTo(i * step);
}

function initLooping() {
    // reset isi
    gallery.innerHTML = '';
    // triple batch
    for (let b = 0; b < 3; b++) {
    original.forEach(html => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html.trim();
        gallery.appendChild(tmp.firstChild);
    });
    }
    setCenter();
}

function destroyLooping() {
    gallery.innerHTML = original.join('');
}

function updateMode() {
    if (window.innerWidth < 768) {
    initLooping();
    } else {
    destroyLooping();
    }
}

window.addEventListener('resize', updateMode);
updateMode();

})();           

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
let touchEndX = 0;
let touchCooldown = false;

wrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].pageX;
    touchEndX = touchStartX;
}, { passive: true });

wrapper.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    touchEndX = e.touches[0].pageX;
}, { passive: true });

wrapper.addEventListener('touchend', () => {
    if (isAnimating || touchCooldown) return;

    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0) {
            index++; // geser ke kanan
        } else {
            index--; // geser ke kiri
        }
        setAnimated(index);

        // Lock gesture
        touchCooldown = true;

        setTimeout(() => {
            touchCooldown = false;
        }, duration + 150);
    }

    // reset supaya gesture berikutnya fresh
    touchStartX = 0;
    touchEndX = 0;
});

})();