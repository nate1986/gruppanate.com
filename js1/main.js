// src/js/main.js

// Импортируем функцию инициализации аудио-плеера
import initializeAudioPlayer from './modules/audio/player.js';

// Функция для динамического создания HTML для элемента плеера (как для списка, так и для актуального)
function createPlayerItemHTML(song, isTopical = false) {
  const topicalClass = isTopical ? ' topical-player' : '';
  const wClearfixClass = isTopical ? '' : ' w-clearfix'; // Класс w-clearfix только для обычных элементов списка

  return `
  <div class="voice-assistant-item${wClearfixClass}${topicalClass}" data-audio="${song.audioUrl}">
  <div class="voice-assistant-item-button">
  <button class="play-button" data-song-id="${song.id}"></button>
  </div>
  <span>${isTopical ? 'Latest' : ''}</span>
  <div class="voice-assistant-item-text">
  <p class="title-track">${song.title}</p>
  <p class="name-track">${song.artist}</p>
  <div class="audio-controls">
  <div class="audio-controls-bar">
  <div class="audio-controls-bar-current"></div>
  </div>
  <div class="voice-assistant-item-text-wrap">
  <button class="flex-center tab-item" data-song-id="${song.id}">
  <div class="list-decor"></div>
  <p class="text-3 gray text-show">show lyrics</p>
  <p class="text-3 text-hidden">hide lyrics</p>
  </button>
  <p class="audio-controls-time text-3">0:00</p>
  </div>
  <p class="tab-content text-3">
  <span>${song.lyrics.replace(/\n/g, '<br>')}</span>
  </p>
  ${song.textTrack ? `<div class="text-track"><p class="text-2">${song.textTrack}</p></div>` : ''}
  </div>
  </div>
  </div>
  `;
}

// Инициализируем все скрипты после полной загрузки DOM
document.addEventListener('DOMContentLoaded', async () => {
  let songsData = [];
  try {
    const response = await fetch('songs.json'); // Путь к вашему JSON файлу
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    songsData = await response.json();
    console.log('Songs data loaded:', songsData);
  } catch (error) {
    console.error('Error loading songs data:', error);
    // Можно отобразить сообщение об ошибке пользователю или использовать запасные данные
    return; // Прекращаем выполнение, если данные не загружены
  }

  const topicalPlayerContainer = document.getElementById('topical-player-insert-point');
  const playlistItemsContainer = document.getElementById('playlist-items-insert-point');

  if (!topicalPlayerContainer || !playlistItemsContainer) {
    console.error('Containers for dynamic content not found. Please add <div id="topical-player-insert-point"> and <div id="playlist-items-insert-point"> to your HTML.');
    return;
  }

  let topicalSong = null;
  let listSongsHTML = '';

  songsData.forEach(song => {
    if (song.isTopical) {
      topicalSong = song;
    } else {
      listSongsHTML += createPlayerItemHTML(song);
    }
  });

  // Если актуальная песня не была явно помечена, возьмем первую
  if (!topicalSong && songsData.length > 0) {
    topicalSong = songsData[0];
    // Если первая песня также является частью списка, нужно ее оттуда удалить или пометить
    // Для простоты, если topicalSong не был найден, мы просто берем первый трек
    // и он будет отображен как актуальный, но также может остаться в списке, если не исключен.
    // Более сложная логика может потребоваться, если актуальная песня должна быть уникальной.
  }

  if (topicalSong) {
    topicalPlayerContainer.innerHTML = createPlayerItemHTML(topicalSong, true);
  } else {
    console.warn('Topical song not found in data.');
  }

  playlistItemsContainer.innerHTML = listSongsHTML;


  // Инициализация аудио-плеера (после того как HTML создан)
  initializeAudioPlayer();


  // Инициализация Slick Carousel
  if (typeof $ !== 'undefined' && $.fn && $.fn.slick) {
    $(".slick-slider").slick({
      slidesToShow: 1.5,
      infinite: false,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 2000,
      dots: false,
      arrows: false,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1.1,
          }
        },
      ]
    });
  } else {
    console.warn("Slick Carousel или jQuery не загружены. Слайдер не будет инициализирован.");
  }


  // Логика для табов (аккордеона)
  // Используем делегирование событий для лучшей производительности
  // Теперь обработчики добавляются к динамически созданным элементам
  $(document).on('click', ".tab-item", function () {
    const $currentItem = $(this).closest(".voice-assistant-item");

    // Переключаем класс 'active' и слайдим контент текущего элемента
    $currentItem.toggleClass('active').find(".tab-content").slideToggle();

    // Закрываем все остальные элементы
    $currentItem.siblings(".voice-assistant-item").removeClass('active')
    .find(".tab-content").slideUp();

    // Добавляем gtag вызов для табов
    const songId = $(this).data('song-id');
    if (typeof gtag === 'function') {
      gtag('event', 'content', { 'content_type': 'texts', 'content_id': songId, 'conversion': 'yes'});
      // gtag_report_conversion_content(); // Если эта функция глобальная и нужна
    }
  });


  // *****BURGER********
  try {
    const body = document.querySelector('body');
    const burgerBtn = document.querySelector('.burger-menu');
    const menuContent = document.querySelector('.dropdown-menu__mobile');

    if (burgerBtn && menuContent && body) {
      burgerBtn.addEventListener('click', function () {
        menuContent.classList.toggle('flex');
        menuContent.classList.toggle('hide');
        burgerBtn.classList.toggle('burger-close');
        body.classList.toggle('hide');
      });
    } else {
      console.warn("Бургер-меню: Один или несколько элементов не найдены (body, .burger-menu, .dropdown-menu__mobile).");
    }
  } catch (e) {
    console.error("Ошибка при инициализации бургер-меню:", e);
  }


  // scrollTo - плавный скролл к секциям
  $(document).on('click', ".hero-buttons-wrapper .btn:first-child", function () {
    const targetElement = $(".playlist");
    if (targetElement.length) {
      $([document.documentElement, document.body]).animate({
        scrollTop: targetElement.offset().top
      }, 2000);
    } else {
      console.warn("Элемент .playlist не найден для прокрутки.");
    }
  });

  $(document).on('click', ".hero-buttons-wrapper .btn:nth-child(2)", function () {
    const targetElement = $(".single");
    if (targetElement.length) {
      $([document.documentElement, document.body]).animate({
        scrollTop: targetElement.offset().top
      }, 2000);
    } else {
      console.warn("Элемент .single не найден для прокрутки.");
    }
  });

  $(document).on('click', ".hero-buttons-wrapper .btn:nth-child(3)", function () {
    const targetElement = $(".slider");
    if (targetElement.length) {
      $([document.documentElement, document.body]).animate({
        scrollTop: targetElement.offset().top
      }, 2000);
    } else {
      console.warn("Элемент .slider не найден для прокрутки.");
    }
  });

  // Отдельная кнопка мобильного меню
  try {
    const mobileBurgerBtn = document.querySelector('.mobile-btn');
    if (mobileBurgerBtn) {
      mobileBurgerBtn.addEventListener('click', function (e) {
        const mobileMenu = mobileBurgerBtn.closest('.mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.toggle('active');
        } else {
          console.warn(".mobile-btn: Родительский элемент .mobile-menu не найден.");
        }
      });
    } else {
      console.warn("Кнопка мобильного меню (.mobile-btn) не найдена.");
    }
  } catch (e) {
    console.error("Ошибка при инициализации кнопки мобильного меню:", e);
  }

  // Добавляем gtag вызов для кнопок play-button
  $(document).on('click', ".play-button", function () {
    const songId = $(this).data('song-id');
    if (typeof gtag === 'function') {
      gtag('event', 'content', { 'content_type': 'listen', 'content_id': songId, 'conversion': 'yes' });
      // gtag_report_conversion_content(); // Если эта функция глобальная и нужна
    }
  });

});
