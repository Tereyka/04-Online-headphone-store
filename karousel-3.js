const slider2 = document.querySelector('.image-carousel');

let isDown2 = false;
let startX2;
let scrollLeftTemp;

// --- параметры «плавности» для колёсика ---
let targetX2 = 0;            // куда хотим докрутиться
let rafId2 = null;           // id активной анимации
const WHEEL_SPEED_SECOND = 1.4;    // чувствительность к колесику (больше — быстрее)
const EASE_SECOND = 0.08;          // плавность (0.08–0.2 обычно ок)

// вспомогательная: пределы прокрутки
function clampTarget2() {
  const max = slider2.scrollWidth - slider2.clientWidth;
  if (targetX2 < 0) targetX2 = 0;
  if (targetX2 > max) targetX2 = max;
}

// анимация к targetX2
function animateToTarget2() {
  const diff = targetX2 - slider2.scrollLeft;
  if (Math.abs(diff) > 0.5) {
    slider2.scrollLeft += diff * EASE_SECOND;
    rafId2 = requestAnimationFrame(animateToTarget2);
  } else {
    slider2.scrollLeft = targetX2;
    rafId2 = null;
  }
}

// --- drag мышью ---
slider2.addEventListener('mousedown', e => {
  // при начале драгга останавливаем текущую анимацию
  if (rafId2) {
    cancelAnimationFrame(rafId2);
    rafId2 = null;
  }
  isDown2 = true;
  slider2.classList.add('active');
  startX2 = e.pageX - slider2.offsetLeft;
  scrollLeftTemp = slider2.scrollLeft;
  targetX2 = slider2.scrollLeft; // синхронизируем цель с текущей позицией
});

slider2.addEventListener('mouseleave', () => {
  isDown2 = false;
  slider2.classList.remove('active');
});

slider2.addEventListener('mouseup', () => {
  isDown2 = false;
  slider2.classList.remove('active');
});

slider2.addEventListener('mousemove', e => {
  if (!isDown2) return;
  e.preventDefault();
  const x = e.pageX - slider2.offsetLeft;
  const DRAG_SPEED = 0.9;
  const walk = (x - startX2) * DRAG_SPEED;
  const next = scrollLeftTemp - walk;
  slider2.scrollLeft = next;
  targetX2 = next; // чтобы после драгга колесо продолжало с текущей точки
});

// --- прокрутка колесиком с плавностью ---
slider2.addEventListener('wheel', e => {
  // позволяем горизонтально крутить даже если тачпад даёт deltaX
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

  // предотвращаем вертикальный скролл страницы/контейнера-родителя
  e.preventDefault();

  // накапливаем целевую позицию и запускаем анимацию
  targetX2 = (rafId2 ? targetX2 : slider2.scrollLeft) + delta * WHEEL_SPEED_SECOND;
  clampTarget2();
  if (!rafId2) animateToTarget2();
}, { passive: false });