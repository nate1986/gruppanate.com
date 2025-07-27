// src/js/modules/audio/listItemPlayer.js

/**
 * Получает кнопку воспроизведения внутри заданного элемента.
 * @param {HTMLElement} el - Родительский элемент, содержащий кнопку воспроизведения.
 * @returns {HTMLElement|null} Кнопка воспроизведения или null, если не найдена.
 */
const getPlayBtn = (el) => el.querySelector('.play-button');

/**
 * Получает время в формате MM:SS или HH:MM:SS из секунд.
 * @param {number} num - Количество секунд.
 * @returns {string} Отформатированное время.
 */
function getTimeCodeFromNum(num) {
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
}

// Объект для хранения ID интервалов для каждого элемента списка
const listItemIntervals = new WeakMap();

/**
 * Активирует плеер элемента списка и начинает воспроизведение.
 * @param {HTMLAudioElement} audio - Объект Audio для воспроизведения.
 * @param {HTMLElement} element - Элемент списка, к которому относится плеер.
 * @returns {function} Функция для очистки интервала обновления прогресс-бара.
 */
const playItemListPlayer = (audio, element) => {
    const playBtn = getPlayBtn(element);
    if (!playBtn) {
        console.warn('listItemPlayer: Кнопка воспроизведения не найдена для элемента.', element);
        return () => {}; // Возвращаем пустую функцию очистки
    }

    // Очищаем предыдущий интервал для этого элемента, если он существует
    if (listItemIntervals.has(element)) {
        clearInterval(listItemIntervals.get(element));
    }

    playBtn.classList.add('playing'); // Добавляем класс 'playing' для стилизации

    // Обработчик клика по полосе прогресса для перемотки
    const timeline = element.querySelector('.audio-controls-bar');
    if (timeline) {
        // Удаляем старый обработчик, чтобы избежать дублирования
        const oldTimelineHandler = timeline.dataset.timelineHandler;
        if (oldTimelineHandler) {
            timeline.removeEventListener('click', eval(oldTimelineHandler));
        }

        const newTimelineHandler = (e) => {
            const timelineWidth = parseFloat(window.getComputedStyle(timeline).width);
            if (isNaN(timelineWidth) || timelineWidth === 0 || !isFinite(audio.duration) || isNaN(audio.duration)) {
                console.warn('listItemPlayer: Ширина таймлайна или длительность аудио не определены для элемента.', element);
                return;
            }
            const timeToSeek = (e.offsetX / timelineWidth) * audio.duration;
            audio.currentTime = timeToSeek;
        };
        timeline.addEventListener('click', newTimelineHandler, false);
        timeline.dataset.timelineHandler = newTimelineHandler.name || newTimelineHandler.toString(); // Сохраняем ссылку на функцию

    } else {
        console.warn('listItemPlayer: Элемент таймлайна не найден для элемента.', element);
    }

    // Обновление прогресс-бара и времени каждые 500 мс
    const intervalId = setInterval(() => {
        const progressBar = element.querySelector('.audio-controls-bar-current');
        const timeDisplay = element.querySelector('.audio-controls-time');
        if (progressBar && timeDisplay && !isNaN(audio.duration) && isFinite(audio.duration)) {
            progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
            timeDisplay.textContent = getTimeCodeFromNum(audio.currentTime);
        } else if (progressBar && timeDisplay && (isNaN(audio.duration) || !isFinite(audio.duration))) {
            // Если длительность еще не определена, можно показать 0:00
            progressBar.style.width = '0%';
            timeDisplay.textContent = '0:00';
        }
    }, 500);

    listItemIntervals.set(element, intervalId); // Сохраняем ID интервала для этого элемента

    // Возвращаем функцию очистки для использования в player.js
    return () => {
        if (listItemIntervals.has(element)) {
            clearInterval(listItemIntervals.get(element));
            listItemIntervals.delete(element);
        }
    };
};

/**
 * Приостанавливает плеер элемента списка.
 * @param {HTMLElement} element - Элемент списка, к которому относится плеер.
 * @returns {function} Функция для очистки интервала обновления прогресс-бара.
 */
const pauseItemPlayer = (element) => {
    const playBtn = getPlayBtn(element);
    if (playBtn) {
        playBtn.classList.remove('playing'); // Удаляем класс 'playing'
    }
    // Очищаем интервал для этого элемента при паузе
    if (listItemIntervals.has(element)) {
        clearInterval(listItemIntervals.get(element));
        listItemIntervals.delete(element);
    }
    return () => {}; // Возвращаем пустую функцию очистки
};

// Экспортируем функции для использования в других модулях
export { playItemListPlayer, pauseItemPlayer };
