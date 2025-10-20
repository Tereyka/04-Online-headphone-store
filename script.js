// Собираем элементы
const slides  = Array.from(document.querySelectorAll('.headphone-carousel .slide'));
const buttons = Array.from(document.querySelectorAll('.color-options-button'));

// Стартовый "активный" — тот, у кого есть data-active, иначе 0
let current = Math.max(0, slides.findIndex(s => s.hasAttribute('data-active')));

// Проставляем позицию каждому слайду по отношению к current
function updatePositions() {
  const n = slides.length;
  slides.forEach((slide, i) => {
    // 0 — центр, 1 — справа, 2 — слева (для 3 слайдов)
    const delta = (i - current + n) % n;

    if (delta === 0) {
      slide.dataset.pos = 'center';
      slide.setAttribute('data-active', '');
    } else if (delta === 1) {
      slide.dataset.pos = 'right';
      slide.removeAttribute('data-active');
    } else {
      slide.dataset.pos = 'left';
      slide.removeAttribute('data-active');
    }
  });

  // Подсветка активной кнопки
  buttons.forEach((btn, i) => btn.classList.toggle('is-active', i === current));
}

// Слушатели кликов по кнопкам-цветам
buttons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    current = index;     // выбранная кнопка делает соответствующий слайд центральным
    updatePositions();
  });
});

// Дополнительно: стрелки клавиатуры ← →
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { current = (current + 1) % slides.length; updatePositions(); }
  if (e.key === 'ArrowLeft')  { current = (current - 1 + slides.length) % slides.length; updatePositions(); }
});

// Первая инициализация
updatePositions();





function myFunction() {
  document.querySelector('.navigation-list').classList.toggle("show");
}

window.addEventListener('click', function(event) {
  const menu = document.querySelector('.navigation-list');
  const burger = document.querySelector('.burger-button');

  // если клик был НЕ по меню и НЕ по бургеру
  if (!menu.contains(event.target) && !burger.contains(event.target)) {
    menu.classList.remove('show');
  }
})





const slider = document.querySelector('.features-carousel');

let isDown = false;
let startX;
let scrollLeft;

// --- параметры «плавности» для колёсика ---
let targetX = 0;            // куда хотим докрутиться
let rafId = null;           // id активной анимации
const WHEEL_SPEED = 1.4;    // чувствительность к колесику (больше — быстрее)
const EASE = 0.14;          // плавность (0.08–0.2 обычно ок)

// вспомогательная: пределы прокрутки
function clampTarget() {
  const max = slider.scrollWidth - slider.clientWidth;
  if (targetX < 0) targetX = 0;
  if (targetX > max) targetX = max;
}

// анимация к targetX
function animateToTarget() {
  const diff = targetX - slider.scrollLeft;
  if (Math.abs(diff) > 0.5) {
    slider.scrollLeft += diff * EASE;
    rafId = requestAnimationFrame(animateToTarget);
  } else {
    slider.scrollLeft = targetX;
    rafId = null;
  }
}

// --- drag мышью ---
slider.addEventListener('mousedown', e => {
  // при начале драгга останавливаем текущую анимацию
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
  targetX = slider.scrollLeft; // синхронизируем цель с текущей позицией
});

slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('active');
});

slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('active');
});

slider.addEventListener('mousemove', e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const DRAG_SPEED = 1.25;
  const walk = (x - startX) * DRAG_SPEED;
  const next = scrollLeft - walk;
  slider.scrollLeft = next;
  targetX = next; // чтобы после драгга колесо продолжало с текущей точки
});

// --- прокрутка колесиком с плавностью ---
slider.addEventListener('wheel', e => {
  // позволяем горизонтально крутить даже если тачпад даёт deltaX
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

  // предотвращаем вертикальный скролл страницы/контейнера-родителя
  e.preventDefault();

  // накапливаем целевую позицию и запускаем анимацию
  targetX = (rafId ? targetX : slider.scrollLeft) + delta * WHEEL_SPEED;
  clampTarget();
  if (!rafId) animateToTarget();
}, { passive: false });

