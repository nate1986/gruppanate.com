// src/js/modules/audio/player.js

// Импортируем функции из других модулей
import { pauseMainPlayer, playMainPlayer } from './mainPlayer.js';
import { pauseItemPlayer, playItemListPlayer } from './listItemPlayer.js';

/**
 * Инициализирует функциональность аудио-плеера на странице.
 * Обрабатывает воспроизведение, паузу и переключение между треками.
 */
export default function initializeAudioPlayer() {
    // Получаем все элементы блоков аудио-списка
    const audioBlockItems = document.querySelectorAll('.voice-assistant-item');

    // Получаем DOM-элементы основного плеера и его кнопку
    // Эти запросы теперь выполняются внутри initializeAudioPlayer, которая вызывается после DOMContentLoaded
    const mainPlayerElement = document.querySelector('.main-player');
    const playBtnMain = mainPlayerElement ? mainPlayerElement.querySelector('.player button.play-button') : null;

    // Получаем кнопку воспроизведения "актуального" плеера
    const topicalPlayerElement = document.querySelector('.topical-player');
    const playBtnTopical = topicalPlayerElement ? topicalPlayerElement.querySelector('.play-button') : null;

    let currentTopicalAudio = null; // Текущий воспроизводимый трек "актуального" плеера
    let currentTopicalAudioData = null; // Данные для текущего актуального аудио

    // Массив для хранения данных о воспроизводимых аудио (объект Audio и соответствующий DOM-элемент)
    const playData = [];
    let currentPlayedAudio = null; // Текущий воспроизводимый аудио-объект из списка

    // Переменные для хранения функций очистки интервалов
    let cleanupMainPlayerInterval = () => {};
    let cleanupListItemIntervals = new WeakMap(); // Для каждого элемента списка

    /**
     * Приостанавливает воспроизведение всех аудио и сбрасывает состояние плееров.
     */
    const pauseFullMainPlayer = () => {
        // Приостанавливаем текущий воспроизводимый аудио-трек из списка
        if (currentPlayedAudio && !currentPlayedAudio.paused) {
            currentPlayedAudio.pause();
            const playedAudioData = playData.find(data => data.audio === currentPlayedAudio);
            if (playedAudioData) {
                pauseItemPlayer(playedAudioData.element);
                cleanupListItemIntervals.get(playedAudioData.element)?.();
            }
        }
        // Приостанавливаем основной плеер
        if (mainPlayerElement) {
            pauseMainPlayer(mainPlayerElement);
            cleanupMainPlayerInterval();
        }
        // Сбрасываем текущий воспроизводимый трек из списка
        currentPlayedAudio = null;
    };

    /**
     * Обрабатывает воспроизведение аудио, включая сброс других плееров.
     * @param {{audio: HTMLAudioElement, element: HTMLElement}} audioData - Объект с аудио и его DOM-элементом.
     */
    const handlePlayMainPlayer = async (audioData) => {
        const { audio, element } = audioData;

        // Если это тот же трек и он уже играет, ничего не делаем
        if (currentPlayedAudio === audio && !audio.paused) {
            return;
        }

        pauseTopicalPlayer(); // Приостанавливаем "актуальный" плеер перед началом воспроизведения основного
        pauseFullMainPlayer(); // Приостанавливаем любой другой играющий трек из списка

        try {
            // Вызываем функции воспроизведения и сохраняем их функции очистки
            cleanupListItemIntervals.set(element, playItemListPlayer(audio, element));
            cleanupMainPlayerInterval = playMainPlayer(audio, mainPlayerElement); // Передаем mainPlayerElement

            await audio.play(); // Начинаем воспроизведение
            currentPlayedAudio = audio; // Устанавливаем текущий воспроизводимый аудио-объект только после успешного play()
        } catch (e) {
            // В случае ошибки воспроизведения, сбрасываем состояние плееров
            console.error('Ошибка воспроизведения аудио:', e);
            pauseItemPlayer(element);
            cleanupListItemIntervals.get(element)?.();
            pauseMainPlayer(mainPlayerElement);
            cleanupMainPlayerInterval();
            currentPlayedAudio = null; // Сбрасываем, так как воспроизведение не удалось
        }
    };

    /**
     * Обрабатывает паузу воспроизведения аудио.
     * @param {{audio: HTMLAudioElement, element: HTMLElement}} audioData - Объект с аудио и его DOM-элементом.
     */
    const handlePauseMainPlayer = async (audioData) => {
        const { audio, element } = audioData;
        try {
            audio.pause(); // Приостанавливаем аудио
            pauseItemPlayer(element); // Сбрасываем состояние плеера элемента списка
            cleanupListItemIntervals.get(element)?.(); // Вызываем функцию очистки для элемента списка
            pauseMainPlayer(mainPlayerElement); // Сбрасываем состояние основного плеера, передавая ему элемент
            cleanupMainPlayerInterval(); // Вызываем функцию очистки для основного плеера
            currentPlayedAudio = null; // Сбрасываем, так как трек на паузе
        } catch (e) {
            console.error('Ошибка при приостановке аудио:', e);
        }
    };

    // Обработчик клика по основной кнопке воспроизведения
    if (playBtnMain) {
        playBtnMain.addEventListener('click', () => {
            const audioData = playData.find((data) => data.audio === currentPlayedAudio);
            if (!audioData) {
                console.warn('Нет данных для воспроизведения в основном плеере.');
                return;
            }

            if (currentPlayedAudio.paused) {
                return handlePlayMainPlayer(audioData);
            } else {
                return handlePauseMainPlayer(audioData);
            }
        });
    } else {
        console.warn('Кнопка основного плеера (.player button.play-button) не найдена.');
    }


    /**
     * Обрабатывает клик по кнопке воспроизведения элемента списка.
     * @param {string} src - URL аудиофайла.
     * @param {HTMLElement} element - DOM-элемент элемента списка.
     */
    const handleAudioListItemBtnClick = (src, element) => {
        let audioData = playData.find((data) => data.element === element);

        if (!audioData) {
            const audio = new Audio(src);
            const newData = { audio, element };
            playData.push(newData);
            audioData = newData;
        }

        if (audioData.audio.paused) {
            return handlePlayMainPlayer(audioData);
        } else {
            return handlePauseMainPlayer(audioData);
        }
    };

    // Добавляем обработчики событий для всех элементов аудио-списка
    if (audioBlockItems.length) {
        audioBlockItems.forEach((item) => {
            const audioUrl = item.getAttribute('data-audio');
            const playBtn = item.querySelector('.play-button');

            if (audioUrl && playBtn) {
                playBtn.addEventListener('click', () => handleAudioListItemBtnClick(audioUrl, item));
            } else {
                console.warn('Элемент аудио-списка не имеет data-audio атрибута или кнопки воспроизведения:', item);
            }
        });
    }


    // Функции для "актуального" плеера
    /**
     * Воспроизводит аудио для "актуального" плеера.
     * @param {HTMLAudioElement} audio - Объект Audio для воспроизведения.
     * @param {HTMLElement} element - Корневой DOM-элемент актуального плеера.
     */
    const playTopical = async (audio, element) => {
        if (!playBtnTopical || !element) {
            console.warn('Кнопка актуального плеера или его элемент не найдены.');
            return;
        }
        try {
            playBtnTopical.classList.add('playing'); // Добавляем класс 'playing'
            await audio.play();
            currentTopicalAudio = audio; // Устанавливаем текущий воспроизводимый "актуальный" трек
            currentTopicalAudioData = { audio, element }; // Сохраняем данные актуального плеера
        } catch (e) {
            console.error('Ошибка воспроизведения актуального аудио:', e);
            playBtnTopical.classList.remove('playing'); // Сбрасываем состояние кнопки
            currentTopicalAudio = null;
            currentTopicalAudioData = null;
        }
    };

    /**
     * Начинает воспроизведение "актуального" плеера.
     */
    function playTopicalPlayer() {
        pauseFullMainPlayer(); // Приостанавливаем основной плеер перед началом воспроизведения "актуального"

        const topicalAudioUrl = topicalPlayerElement ? topicalPlayerElement.getAttribute('data-audio') : null;

        if (!topicalAudioUrl) {
            console.warn('Актуальный плеер не имеет атрибута data-audio.');
            if (playBtnTopical) playBtnTopical.classList.remove('playing');
            return;
        }

        if (!currentTopicalAudio || currentTopicalAudio.src !== new Audio(topicalAudioUrl).src) {
            // Если нет текущего "актуального" аудио или URL изменился, создаем новый объект Audio
            currentTopicalAudio = new Audio(topicalAudioUrl);
        }

        if (topicalPlayerElement) {
            playTopical(currentTopicalAudio, topicalPlayerElement).catch(_ => {
                // Ошибка уже логируется внутри playTopical
                if (playBtnTopical) playBtnTopical.classList.remove('playing');
            });
        }
    }

    /**
     * Приостанавливает воспроизведение "актуального" плеера.
     */
    function pauseTopicalPlayer() {
        if (playBtnTopical) {
            playBtnTopical.classList.remove('playing');
        }
        currentTopicalAudio?.pause(); // Приостанавливаем текущий "актуальный" трек, если он существует
        currentTopicalAudio = null; // Сбрасываем актуальный трек
        currentTopicalAudioData = null; // Сбрасываем данные актуального плеера
    }

    // Обработчик клика для кнопки "актуального" плеера
    if (playBtnTopical) {
        playBtnTopical.addEventListener('click', () => {
            if (currentTopicalAudio && !currentTopicalAudio.paused) {
                return pauseTopicalPlayer();
            }
            // Если актуальный плеер запускается, приостанавливаем основной
            pauseFullMainPlayer();
            return playTopicalPlayer();
        });
    }
     }
