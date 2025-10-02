// scroll track
(function(){
const gallery = document.getElementById('galleryTrack');
let isDown = false;
let startX, scrollLeft;

gallery.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;
});
gallery.addEventListener('mouseleave', () => isDown = false);
gallery.addEventListener('mouseup', () => isDown = false);
gallery.addEventListener('mousemove', e => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - gallery.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast
    gallery.scrollLeft = scrollLeft - walk;
});

// Touch
let startTouchX = 0;
let touchScrollLeft = 0;
gallery.addEventListener('touchstart', e => {
    startTouchX = e.touches[0].pageX;
    touchScrollLeft = gallery.scrollLeft;
});
gallery.addEventListener('touchmove', e => {
    const x = e.touches[0].pageX;
    const walk = (x - startTouchX) * 2;
    gallery.scrollLeft = touchScrollLeft - walk;
});
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

})();  