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
        return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

// Объект для хранения ID интервалов для каждого элемента списка
const listItemIntervals = new WeakMap();
const listItemTimelineHandlers = new WeakMap(); // Для хранения ссылок на функции обработчиков событий

/**
 * Активирует плеер элемента списка и начинает воспроизведение.
 * @param {HTMLAudioElement} audio - Объект Audio для воспроизведения.
 * @param {HTMLElement} element - Элемент списка, к которому относится плеер.
 * @returns {function} Функция для очистки интервала обновления прогресс-бара.
 */
const playItemListPlayer = (audio, element) => {
    // Получаем все необходимые элементы управления внутри переданного корневого элемента
    const playBtn = getPlayBtn(element);
    const timeline = element.querySelector('.audio-controls-bar');
    const progressBar = element.querySelector('.audio-controls-bar-current');
    const timeDisplay = element.querySelector('.audio-controls-time');

    // Проверяем, что все элементы найдены
    if (!playBtn || !timeline || !progressBar || !timeDisplay) {
        console.warn('playItemListPlayer: Не найдены необходимые элементы управления плеером в:', element);
        return () => {};
    }

    // Очищаем предыдущий интервал для этого элемента, если он существует
    if (listItemIntervals.has(element)) {
        clearInterval(listItemIntervals.get(element));
    }

    playBtn.classList.add('playing'); // Добавляем класс 'playing' для стилизации

    // Удаляем старый обработчик события timeline, чтобы избежать дублирования
    const oldHandler = listItemTimelineHandlers.get(element);
    if (oldHandler) {
        timeline.removeEventListener('click', oldHandler);
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
    listItemTimelineHandlers.set(element, newTimelineHandler); // Сохраняем ссылку на функцию

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

    listItemIntervals.set(element, intervalId); // Сохраняем ID интервала для этого элемента

    // Возвращаем функцию очистки для использования в player.js
    return () => {
        if (listItemIntervals.has(element)) {
            clearInterval(listItemIntervals.get(element));
            listItemIntervals.delete(element);
            // Также удаляем обработчик события при очистке
            if (listItemTimelineHandlers.has(element)) {
                timeline.removeEventListener('click', listItemTimelineHandlers.get(element));
                listItemTimelineHandlers.delete(element);
            }
        }
    };
};

/**
 * Приостанавливает плеер элемента списка.
 * @param {HTMLElement} element - Элемент списка, к которому относится плеер.
 * @returns {function} Пустая функция очистки.
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
        // Также удаляем обработчик события при паузе
        const timeline = element.querySelector('.audio-controls-bar');
        if (timeline && listItemTimelineHandlers.has(element)) {
            timeline.removeEventListener('click', listItemTimelineHandlers.get(element));
            listItemTimelineHandlers.delete(element);
        }
    }
    return () => {};
};

// Экспортируем функции для использования в других модулях
export { playItemListPlayer, pauseItemPlayer };
