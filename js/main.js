// src/js/main.js

// Импортируем функцию инициализации аудио-плеера
// Убедитесь, что путь к файлу player.js правильный относительно этого файла.
import initializeAudioPlayer from './modules/audio/player.js';

// Инициализируем все скрипты после полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // Инициализация аудио-плеера
  initializeAudioPlayer();

  // Инициализация Slick Carousel
  // Убедитесь, что jQuery и Slick.js подключены в вашем HTML перед этим скриптом.
  // Например:
  // <script src="js/jquery.min.js"></script>
  // <script src="js/slick.min.js"></script>
  // <script src="js/main.js" type="module"></script>
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
  $(document).on('click', ".tab-item", function () {
    const $currentItem = $(this).closest(".voice-assistant-item");

    // Переключаем класс 'active' и слайдим контент текущего элемента
    $currentItem.toggleClass('active').find(".tab-content").slideToggle();

    // Закрываем все остальные элементы
    $currentItem.siblings(".voice-assistant-item").removeClass('active')
    .find(".tab-content").slideUp();
  });

  // Этот блок кода был в оригинале, но не выполнял никаких действий.
  // Если он не нужен, его можно удалить.
  // let tabActive = document.querySelectorAll('.voice-assistant-item.w-clearfix.active');
  // let tab = document.querySelectorAll('.voice-assistant-item.w-clearfix');
  // tab.forEach((item) => {
  //     // Здесь не было никакой логики
  // });


  // *****BURGER********
  // Используем try-catch для обработки ошибок, если элементы не найдены
  try {
    const body = document.querySelector('body');
    const burgerBtn = document.querySelector('.burger-menu');
    const menuContent = document.querySelector('.dropdown-menu__mobile');

    if (burgerBtn && menuContent && body) {
      burgerBtn.addEventListener('click', function () {
        // Переключаем классы для отображения/скрытия меню и изменения иконки бургера
        menuContent.classList.toggle('flex'); // Предполагается, что 'flex' делает меню видимым
        menuContent.classList.toggle('hide'); // Предполагается, что 'hide' скрывает меню
        burgerBtn.classList.toggle('burger-close'); // Переключаем иконку бургера
        body.classList.toggle('hide'); // Добавляем/удаляем класс 'hide' для body (возможно, для блокировки скролла)
      });
    } else {
      console.warn("Бургер-меню: Один или несколько элементов не найдены (body, .burger-menu, .dropdown-menu__mobile).");
    }
  } catch (e) {
    console.error("Ошибка при инициализации бургер-меню:", e);
  }


  // scrollTo - плавный скролл к секциям
  // Используем делегирование событий для кнопок в .hero-buttons-wrapper
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

  // Отдельная кнопка мобильного меню (возможно, дублирующая функциональность бургера)
  try {
    const mobileBurgerBtn = document.querySelector('.mobile-btn');
    if (mobileBurgerBtn) {
      mobileBurgerBtn.addEventListener('click', function (e) {
        // Переключаем класс 'active' для родительского элемента '.mobile-menu'
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

  // Комментарий 'track' без кода - возможно, это заготовка для будущей функциональности.
});
