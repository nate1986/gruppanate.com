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
    const mainPlayerElement = document.querySelector('.main-player');
    const playBtnMain = mainPlayerElement ? mainPlayerElement.querySelector('.player button.play-button') : null;

    // Получаем кнопку воспроизведения "актуального" плеера
    const topicalPlayerElement = document.querySelector('.topical-player');
    const playBtnTopical = topicalPlayerElement ? topicalPlayerElement.querySelector('.play-button') : null;

    // Единая переменная для хранения текущего воспроизводимого объекта Audio
    let currentPlayingAudioObject = null;
    // Единая переменная для хранения DOM-элемента, связанного с текущим воспроизводимым аудио (для списка или актуального)
    let currentPlayingElement = null;

    // Массив для хранения данных о воспроизводимых аудио из списка
    const playData = [];

    // Переменные для хранения функций очистки интервалов
    let cleanupMainPlayerInterval = () => {};
    let cleanupListItemIntervals = new WeakMap(); // Для каждого элемента списка

    /**
     * Приостанавливает воспроизведение всех аудио на странице.
     * Сбрасывает визуальное состояние плееров и очищает интервалы.
     */
    const pauseAllAudio = () => {
        if (currentPlayingAudioObject) {
            currentPlayingAudioObject.pause();
            currentPlayingAudioObject.onended = null; // Удаляем обработчик onended, чтобы избежать нежелательного сброса
        }

        // Сброс визуального состояния и интервалов для основного плеера
        if (mainPlayerElement) {
            pauseMainPlayer(mainPlayerElement);
            cleanupMainPlayerInterval();
        }

        // Сброс визуального состояния и интервалов для элемента списка, если он был активен
        if (currentPlayingElement && currentPlayingElement.classList.contains('voice-assistant-item') && currentPlayingElement !== topicalPlayerElement) {
            pauseItemPlayer(currentPlayingElement);
            cleanupListItemIntervals.get(currentPlayingElement)?.();
        }

        // Сброс визуального состояния для актуального плеера
        if (playBtnTopical) {
            playBtnTopical.classList.remove('playing');
        }

        // Полностью сбрасываем глобальные переменные состояния
        currentPlayingAudioObject = null;
        currentPlayingElement = null;
    };

    /**
     * Обрабатывает воспроизведение аудио из списка.
     * @param {{audio: HTMLAudioElement, element: HTMLElement}} audioData - Объект с аудио и его DOM-элементом.
     */
    const handlePlayMainPlayer = async (audioData) => {
        const { audio, element } = audioData;

        // Если это тот же трек и он уже играет, ничего не делаем
        if (currentPlayingAudioObject === audio && !audio.paused) {
            return;
        }

        pauseAllAudio(); // Приостанавливаем все остальные аудио перед началом воспроизведения

        try {
            // Вызываем функции воспроизведения и сохраняем их функции очистки
            cleanupListItemIntervals.set(element, playItemListPlayer(audio, element));
            cleanupMainPlayerInterval = playMainPlayer(audio, mainPlayerElement);

            await audio.play(); // Начинаем воспроизведение
            currentPlayingAudioObject = audio; // Устанавливаем текущий воспроизводимый аудио-объект
            currentPlayingElement = element; // Устанавливаем текущий DOM-элемент

            // Добавляем обработчик на окончание воспроизведения, чтобы сбросить состояние
            audio.onended = () => {
                console.log('Audio ended, resetting all players.');
                pauseAllAudio(); // Полностью сбрасываем все плееры по окончании
            };

        } catch (e) {
            // В случае ошибки воспроизведения, сбрасываем состояние плееров
            console.error('Ошибка воспроизведения аудио:', e);
            pauseAllAudio(); // Полностью сбрасываем все плееры при ошибке
        }
    };

    /**
     * Обрабатывает паузу воспроизведения аудио из списка.
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
            // currentPlayingAudioObject остается установленным, чтобы можно было возобновить воспроизведение
        } catch (e) {
            console.error('Ошибка при приостановке аудио:', e);
        }
    };

    // Обработчик клика по основной кнопке воспроизведения
    if (playBtnMain) {
        playBtnMain.addEventListener('click', () => {
            // Если нет текущего воспроизводимого аудио или оно не из списка,
            // то эта кнопка не имеет активного трека для управления.
            if (!currentPlayingAudioObject || !playData.some(data => data.audio === currentPlayingAudioObject)) {
                console.warn('Нет активного трека из списка для управления основным плеером.');
                return;
            }

            const audioData = playData.find((data) => data.audio === currentPlayingAudioObject);

            if (currentPlayingAudioObject.paused) {
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
            currentPlayingAudioObject = audio; // Устанавливаем текущий воспроизводимый аудио-объект
            currentPlayingElement = element; // Устанавливаем текущий DOM-элемент

            // Добавляем обработчик на окончание воспроизведения для актуального плеера
            audio.onended = () => {
                console.log('Topical audio ended, resetting all players.');
                pauseAllAudio(); // Полностью сбрасываем все плееры по окончании
            };

        } catch (e) {
            console.error('Ошибка воспроизведения актуального аудио:', e);
            pauseAllAudio(); // Полностью сбрасываем все плееры при ошибке
        }
    };

    /**
     * Начинает воспроизведение "актуального" плеера.
     */
    function playTopicalPlayer() {
        // При запуске актуального плеера, всегда приостанавливаем все остальные аудио
        pauseAllAudio();

        // Пытаемся получить URL из data-audio атрибута элемента .topical-player
        const topicalAudioUrlFromData = topicalPlayerElement ? topicalPlayerElement.getAttribute('data-audio') : null;
        // Используем URL из data-audio, если он есть, иначе используем хардкодный URL
        const audioToPlayUrl = topicalAudioUrlFromData || 'https://cdn4.deliciouspears.com/load/258702068/INSTASAMKA_-_ZA_DENGI_DA_(musmore.com).mp3';

        // Проверяем, если текущий играющий объект уже является этим актуальным треком
        if (currentPlayingAudioObject && currentPlayingAudioObject.src === new Audio(audioToPlayUrl).src) {
            if (currentPlayingAudioObject.paused) {
                // Если он на паузе, возобновляем воспроизведение
                playTopical(currentPlayingAudioObject, topicalPlayerElement).catch(e => {
                    console.error("Failed to resume topical audio:", e);
                    if (playBtnTopical) playBtnTopical.classList.remove('playing');
                });
            } else {
                // Если уже играет, то ставим на паузу
                pauseAllAudio(); // Вызов pauseAllAudio() сбросит все, включая актуальный плеер
            }
            return; // Выходим, так как действие выполнено
        }

        // Если это новый трек, или currentPlayingAudioObject не установлен,
        // создаем новый объект Audio и запускаем его.
        // Важно: создаем новый Audio объект только если он действительно новый или не существует
        currentPlayingAudioObject = new Audio(audioToPlayUrl);

        if (topicalPlayerElement) {
            playTopical(currentPlayingAudioObject, topicalPlayerElement).catch(e => {
                console.error("Failed to play topical audio:", e);
                if (playBtnTopical) playBtnTopical.classList.remove('playing');
            });
        } else {
            console.warn('Элемент актуального плеера (.topical-player) не найден.');
            if (playBtnTopical) playBtnTopical.classList.remove('playing');
        }
    }

    /**
     * Приостанавливает воспроизведение "актуального" плеера.
     * Эта функция теперь в основном вызывается из pauseAllAudio().
     */
    function pauseTopicalPlayer() {
        if (playBtnTopical) {
            playBtnTopical.classList.remove('playing');
        }
        // currentPlayingAudioObject?.pause(); // Это уже обрабатывается через currentPlayingAudioObject.pause() в pauseAllAudio
        // currentPlayingAudioObject = null; // Это также обрабатывается через currentPlayingAudioObject = null в pauseAllAudio
    }

    // Обработчик клика для кнопки "актуального" плеера
    if (playBtnTopical) {
        playBtnTopical.addEventListener('click', () => {
            // Логика переключения состояния "актуального" плеера
            // playTopicalPlayer() теперь содержит логику для переключения паузы/воспроизведения
            playTopicalPlayer();
        });
    }
     }
