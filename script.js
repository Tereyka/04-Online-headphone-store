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