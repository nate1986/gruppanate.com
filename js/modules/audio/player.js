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
    // Получаем кнопку воспроизведения основного плеера
    const playBtnMain = document.querySelector('.player button.play-button');
    // Получаем кнопку воспроизведения "актуального" плеера
    const playBtnTopical = document.querySelector('.topical-player .play-button');

    let currentTopicalAudio; // Текущий воспроизводимый трек "актуального" плеера
    // URL для "актуального" трека (пока только один)
    const topicalUrls = ['https://cdn4.deliciouspears.com/load/258702068/INSTASAMKA_-_ZA_DENGI_DA_(musmore.com).mp3'];

    // Массив для хранения данных о воспроизводимых аудио (объект Audio и соответствующий DOM-элемент)
    const playData = [];
    let currentPlayedAudio = null; // Текущий воспроизводимый аудио-объект

    // Переменные для хранения функций очистки интервалов
    let cleanupMainPlayer = () => {};
    let cleanupListItemPlayer = new WeakMap(); // Для каждого элемента списка

    /**
     * Приостанавливает воспроизведение всех аудио и сбрасывает состояние плееров.
     */
    const pauseFullMainPlayer = () => {
        // Находим аудио, которое в данный момент не на паузе
        const playedAudioData = playData.find(({ audio }) => audio && !audio.paused);
        if (playedAudioData) {
            playedAudioData.audio.pause(); // Приостанавливаем аудио
            pauseItemPlayer(playedAudioData.element); // Сбрасываем состояние плеера элемента списка
            cleanupListItemPlayer.get(playedAudioData.element)?.(); // Вызываем функцию очистки для элемента списка
            pauseMainPlayer(); // Сбрасываем состояние основного плеера
            cleanupMainPlayer(); // Вызываем функцию очистки для основного плеера
        }
    };

    /**
     * Обрабатывает воспроизведение аудио, включая сброс других плееров.
     * @param {{audio: HTMLAudioElement, element: HTMLElement}} audioData - Объект с аудио и его DOM-элементом.
     */
    const handlePlayMainPlayer = async (audioData) => {
        const { audio, element } = audioData;
        pauseTopicalPlayer(); // Приостанавливаем "актуальный" плеер перед началом воспроизведения основного

        try {
            // Вызываем функции воспроизведения и сохраняем их функции очистки
            cleanupListItemPlayer.set(element, playItemListPlayer(audio, element));
            cleanupMainPlayer = playMainPlayer(audio);

            // Приостанавливаем все другие воспроизводимые аудио в списке
            playData.forEach((data) => {
                if (data.audio && data.audio !== audio && !data.audio.paused) {
                    data.audio.pause();
                    pauseItemPlayer(data.element);
                    cleanupListItemPlayer.get(data.element)?.(); // Вызываем функцию очистки для других элементов
                }
            });

            await audio.play(); // Начинаем воспроизведение
            currentPlayedAudio = audio; // Устанавливаем текущий воспроизводимый аудио-объект
        } catch (e) {
            // В случае ошибки воспроизведения, сбрасываем состояние плееров
            pauseItemPlayer(element);
            cleanupListItemPlayer.get(element)?.();
            pauseMainPlayer();
            cleanupMainPlayer();
            console.error('Ошибка воспроизведения аудио:', e);
        }
    };

    /**
     * Обрабатывает паузу воспроизведения аудио.
     * @param {{audio: HTMLAudioElement, element: HTMLElement}} audioData - Объект с аудио и его DOM-элементом.
     */
    const handlePauseMainPlayer = async (audioData) => {
        const { audio, element } = audioData;
        try {
            pauseItemPlayer(element); // Сбрасываем состояние плеера элемента списка
            cleanupListItemPlayer.get(element)?.(); // Вызываем функцию очистки для элемента списка
            pauseMainPlayer(); // Сбрасываем состояние основного плеера
            cleanupMainPlayer(); // Вызываем функцию очистки для основного плеера
            audio.pause(); // Приостанавливаем аудио
        } catch (e) {
            console.error('Ошибка при приостановке аудио:', e);
        }
    };

    // Обработчик клика по основной кнопке воспроизведения
    if (playBtnMain) {
        playBtnMain.addEventListener('click', () => {
            // Находим данные текущего воспроизводимого аудио
            const audioData = playData.find((data) => data.audio === currentPlayedAudio);
            if (!audioData) {
                console.warn('Нет данных для воспроизведения в основном плеере.');
                return;
            }

            if (currentPlayedAudio.paused) {
                // Если аудио на паузе, возобновляем воспроизведение
                return handlePlayMainPlayer(audioData);
            } else {
                // Если аудио воспроизводится, ставим на паузу
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
        // Ищем, есть ли уже данные для этого элемента в массиве playData
        let audioData = playData.find((data) => data.element === element);

        if (!audioData) {
            // Если данных нет, создаем новый объект Audio и добавляем его в playData
            const audio = new Audio(src);
            const newData = { audio, element };
            playData.push(newData);
            audioData = newData; // Устанавливаем audioData для дальнейшего использования
        }

        if (audioData.audio.paused) {
            // Если аудио на паузе, возобновляем воспроизведение
            return handlePlayMainPlayer(audioData);
        } else {
            // Если аудио воспроизводится, ставим на паузу
            return handlePauseMainPlayer(audioData);
        }
    };

    // Добавляем обработчики событий для всех элементов аудио-списка
    if (audioBlockItems.length) {
        audioBlockItems.forEach((item) => {
            const audioUrl = item.getAttribute('data-audio'); // Получаем URL аудио из атрибута data-audio
            const playBtn = item.querySelector('.play-button'); // Получаем кнопку воспроизведения элемента

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
     */
    const playTopical = async (audio) => {
        if (!playBtnTopical) {
            console.warn('Кнопка актуального плеера не найдена.');
            return;
        }
        try {
            await audio.play();
            currentTopicalAudio = audio; // Устанавливаем текущий воспроизводимый "актуальный" трек
            playBtnTopical.classList.add('playing'); // Добавляем класс 'playing'
        } catch (e) {
            console.error('Ошибка воспроизведения актуального аудио:', e);
            playBtnTopical.classList.remove('playing'); // Сбрасываем состояние кнопки
        }
    };

    /**
     * Начинает воспроизведение "актуального" плеера.
     */
    function playTopicalPlayer() {
        pauseFullMainPlayer(); // Приостанавливаем основной плеер перед началом воспроизведения "актуального"

        if (!currentTopicalAudio) {
            // Если нет текущего "актуального" аудио, создаем новый объект Audio
            return playTopical(new Audio(topicalUrls[0])).catch(_ => {
                if (playBtnTopical) playBtnTopical.classList.remove('playing');
            });
        }

        // Если есть текущее "актуальное" аудио, возобновляем его
        return playTopical(currentTopicalAudio).catch(_ => {
            if (playBtnTopical) playBtnTopical.classList.remove('playing');
        });
    }

    /**
     * Приостанавливает воспроизведение "актуального" плеера.
     */
    function pauseTopicalPlayer() {
        if (playBtnTopical) {
            playBtnTopical.classList.remove('playing');
        }
        currentTopicalAudio?.pause(); // Приостанавливаем текущий "актуальный" трек, если он существует
    }

    // Закомментированный код для кнопки "актуального" плеера
    // Если вы хотите активировать эту функциональность, раскомментируйте блок ниже.
    if (playBtnTopical) {
        playBtnTopical.addEventListener('click', () => {
            if (currentTopicalAudio && !currentTopicalAudio.paused) {
                return pauseTopicalPlayer();
            }
            pauseFullMainPlayer();
            return playTopicalPlayer();
        });
    }
     }
