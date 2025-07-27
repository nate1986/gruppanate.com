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
        // Если часов нет, возвращаем MM:SS
        return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
    }
    // Иначе возвращаем HH:MM:SS
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};

// Получаем основной элемент плеера и кнопку воспроизведения
const mainPLayer = document.querySelector('.main-player');
const playBtn = mainPLayer ? mainPLayer.querySelector('.play-button') : null;

// Переменная для хранения ID интервала, чтобы его можно было очистить
let mainPlayerIntervalId = null;

/**
 * Активирует основной плеер и начинает воспроизведение.
 * @param {HTMLAudioElement} audio - Объект Audio для воспроизведения.
 * @returns {function} Функция для очистки интервала обновления прогресс-бара.
 */
const playMainPlayer = (audio) => {
    if (!playBtn || !mainPLayer) {
        console.warn('mainPlayer: Элементы плеера не найдены.');
        return () => {}; // Возвращаем пустую функцию очистки
    }

    // Очищаем предыдущий интервал, если он существует
    if (mainPlayerIntervalId) {
        clearInterval(mainPlayerIntervalId);
    }

    playBtn.classList.add('playing'); // Добавляем класс 'playing' для стилизации
    mainPLayer.classList.add('show'); // Показываем основной плеер

    // Обработчик клика по полосе прогресса для перемотки
    const timeline = mainPLayer.querySelector('.audio-controls-bar');
    if (timeline) {
        // Удаляем старый обработчик, чтобы избежать дублирования
        // Это упрощенный подход, для более сложного управления событиями можно использовать Named Functions
        const oldTimelineHandler = timeline.dataset.timelineHandler;
        if (oldTimelineHandler) {
            timeline.removeEventListener('click', eval(oldTimelineHandler));
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
        timeline.dataset.timelineHandler = newTimelineHandler.name || newTimelineHandler.toString(); // Сохраняем ссылку на функцию

    } else {
        console.warn('mainPlayer: Элемент таймлайна не найден.');
    }

    // Обновление прогресс-бара и времени каждые 500 мс
    mainPlayerIntervalId = setInterval(() => {
        const progressBar = mainPLayer.querySelector('.audio-controls-bar-current');
        const timeDisplay = mainPLayer.querySelector('.audio-controls-time');
        if (progressBar && timeDisplay && !isNaN(audio.duration) && isFinite(audio.duration)) {
            progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
            timeDisplay.textContent = getTimeCodeFromNum(audio.currentTime);
        } else if (progressBar && timeDisplay && (isNaN(audio.duration) || !isFinite(audio.duration))) {
            // Если длительность еще не определена, можно показать 0:00
            progressBar.style.width = '0%';
            timeDisplay.textContent = '0:00';
        }
    }, 500);

    // Возвращаем функцию очистки для использования в player.js
    return () => {
        if (mainPlayerIntervalId) {
            clearInterval(mainPlayerIntervalId);
            mainPlayerIntervalId = null;
        }
    };
};

/**
 * Приостанавливает основной плеер.
 * @returns {function} Функция для очистки интервала обновления прогресс-бара.
 */
const pauseMainPlayer = () => {
    if (playBtn) {
        playBtn.classList.remove('playing'); // Удаляем класс 'playing'
    }
    // Очищаем интервал при паузе
    if (mainPlayerIntervalId) {
        clearInterval(mainPlayerIntervalId);
        mainPlayerIntervalId = null;
    }
    return () => {}; // Возвращаем пустую функцию очистки
};

// Экспортируем функции для использования в других модулях
export { playMainPlayer, pauseMainPlayer };
