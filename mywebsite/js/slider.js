document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector('.kyiv_images');
  const originalSlides = Array.from(document.querySelectorAll('.kyiv_image'));

  let index = 0;
  let intervalId = null;
  let currentVisible = 0;

  // Визначаємо кількість видимих слайдів залежно від ширини екрану
  function getVisibleSlides() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
  }

  // Скидаємо слайдер: прибираємо клони, встановлюємо нову ширину, додаємо нові клони
  function initSlider() {
      const visibleSlides = getVisibleSlides();

      // Зупиняємо автопрокрутку під час ініціалізації
      if (intervalId) clearInterval(intervalId);

      // Видаляємо старі клони (все після оригінальних слайдів)
      while (track.children.length > originalSlides.length) {
          track.removeChild(track.lastChild);
      }

      // Скидаємо позицію без анімації
      track.style.transition = 'none';
      track.style.transform = 'translateX(0)';
      index = 0;

      // Додаємо нові клони (рівно visibleSlides штук)
      for (let i = 0; i < visibleSlides; i++) {
          const clone = originalSlides[i].cloneNode(true);
          track.appendChild(clone);
      }

      currentVisible = visibleSlides;

      // Запускаємо автопрокрутку
      intervalId = setInterval(moveSlide, 3000);
  }

  function moveSlide() {
      const visibleSlides = currentVisible;
      const totalSlides = track.children.length; // оригінали + клони
      const slideWidthPercent = 100 / visibleSlides;

      index++;
      track.style.transition = 'transform 0.5s ease';
      track.style.transform = `translateX(-${index * slideWidthPercent}%)`;

      // Коли доходимо до клонів — тихо скидаємось на початок
      if (index >= originalSlides.length) {
          setTimeout(() => {
              track.style.transition = 'none';
              index = 0;
              track.style.transform = 'translateX(0)';
          }, 500);
      }
  }

  // Дебаунс для resize — не перезапускаємо занадто часто
  let resizeTimer;
  window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
          const newVisible = getVisibleSlides();
          if (newVisible !== currentVisible) {
              initSlider();
          }
      }, 200);
  });

  // Старт
  initSlider();
});