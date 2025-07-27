// src/js/modules/audio/mainPlayer.js

/**
 * Получает время в формате MM:SS или HH:MM:SS из секунд.
 * @param {number} num - Количество секунд.
 * @returns {string} Отформатированное время.
 */
const getTimeCodeFromNum = (num) => {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) {
        return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};

// Используем WeakMap для хранения ID интервалов, связанных с каждым экземпляром основного элемента плеера
const mainPlayerIntervals = new WeakMap();
const mainPlayerTimelineHandlers = new WeakMap(); // Для хранения ссылок на функции обработчиков событий

/**
 * Активирует основной плеер и начинает воспроизведение.
 * @param {HTMLAudioElement} audio - Объект Audio для воспроизведения.
 * @param {HTMLElement} mainPlayerElement - Корневой DOM-элемент основного плеера (.main-player).
 * @returns {function} Функция для очистки интервала обновления прогресс-бара.
 */
const playMainPlayer = (audio, mainPlayerElement) => {
    if (!mainPlayerElement) {
        console.warn('playMainPlayer: Корневой элемент основного плеера не предоставлен.');
        return () => {}; // Возвращаем пустую функцию очистки
    }

    // Получаем все необходимые элементы управления внутри переданного корневого элемента
    const playBtn = mainPlayerElement.querySelector('.player .play-button');
    const timeline = mainPlayerElement.querySelector('.audio-controls-bar');
    const progressBar = mainPlayerElement.querySelector('.audio-controls-bar-current');
    const timeDisplay = mainPlayerElement.querySelector('.audio-controls-time');

    // Проверяем, что все элементы найдены
    if (!playBtn || !timeline || !progressBar || !timeDisplay) {
        console.warn('playMainPlayer: Не найдены необходимые элементы управления плеером в:', mainPlayerElement);
        return () => {};
    }

    // Очищаем предыдущий интервал для этого конкретного элемента плеера
    if (mainPlayerIntervals.has(mainPlayerElement)) {
        clearInterval(mainPlayerIntervals.get(mainPlayerElement));
    }

    playBtn.classList.add('playing'); // Добавляем класс 'playing' для стилизации
    mainPlayerElement.classList.add('show'); // Показываем основной плеер

    // Удаляем старый обработчик события timeline, чтобы избежать дублирования
    const oldTimelineHandler = mainPlayerTimelineHandlers.get(mainPlayerElement);
    if (oldTimelineHandler) {
        timeline.removeEventListener('click', oldTimelineHandler);
    }

    const newTimelineHandler = (e) => {
        const timelineWidth = parseFloat(window.getComputedStyle(timeline).width);
        if (isNaN(timelineWidth) || timelineWidth === 0 || !isFinite(audio.duration) || isNaN(audio.duration)) {
            console.warn('mainPlayer: Ширина таймлайна или длительность аудио не определены.');
            return;
        }
        const timeToSeek = (e.offsetX / timelineWidth) * audio.duration;
        audio.currentTime = timeToSeek;
    };
    timeline.addEventListener('click', newTimelineHandler, false);
    mainPlayerTimelineHandlers.set(mainPlayerElement, newTimelineHandler); // Сохраняем ссылку на функцию

    // Обновление прогресс-бара и времени каждые 500 мс
    const intervalId = setInterval(() => {
        if (!isNaN(audio.duration) && isFinite(audio.duration)) {
            progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
            timeDisplay.textContent = getTimeCodeFromNum(audio.currentTime);
        } else {
            progressBar.style.width = '0%';
            timeDisplay.textContent = '0:00'; // Показываем 0:00, если длительность еще не определена
        }
    }, 500);

    mainPlayerIntervals.set(mainPlayerElement, intervalId); // Сохраняем ID интервала для этого элемента

    // Возвращаем функцию очистки для использования в player.js
    return () => {
        if (mainPlayerIntervals.has(mainPlayerElement)) {
            clearInterval(mainPlayerIntervals.get(mainPlayerElement));
            mainPlayerIntervals.delete(mainPlayerElement);
            // Также удаляем обработчик события при очистке
            if (mainPlayerTimelineHandlers.has(mainPlayerElement)) {
                timeline.removeEventListener('click', mainPlayerTimelineHandlers.get(mainPlayerElement));
                mainPlayerTimelineHandlers.delete(mainPlayerElement);
            }
        }
    };
};

/**
 * Приостанавливает основной плеер.
 * @param {HTMLElement} mainPlayerElement - Корневой DOM-элемент основного плеера (.main-player).
 * @returns {function} Пустая функция очистки.
 */
const pauseMainPlayer = (mainPlayerElement) => {
    if (!mainPlayerElement) {
        console.warn('pauseMainPlayer: Корневой элемент основного плеера не предоставлен.');
        return () => {};
    }
    const playBtn = mainPlayerElement.querySelector('.player .play-button');
    if (playBtn) {
        playBtn.classList.remove('playing'); // Удаляем класс 'playing'
    }
    // Очищаем интервал для этого конкретного элемента при паузе
    if (mainPlayerIntervals.has(mainPlayerElement)) {
        clearInterval(mainPlayerIntervals.get(mainPlayerElement));
        mainPlayerIntervals.delete(mainPlayerElement);
        // Также удаляем обработчик события при паузе
        const timeline = mainPlayerElement.querySelector('.audio-controls-bar');
        if (timeline && mainPlayerTimelineHandlers.has(mainPlayerElement)) {
            timeline.removeEventListener('click', mainPlayerTimelineHandlers.get(mainPlayerElement));
            mainPlayerTimelineHandlers.delete(mainPlayerElement);
        }
    }
    return () => {};
};

// Экспортируем функции для использования в других модулях
export { playMainPlayer, pauseMainPlayer };
