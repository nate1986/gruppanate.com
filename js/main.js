/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval("const player = __webpack_require__(/*! ./modules/audio/player.js */ \"./src/js/modules/audio/player.js\");\r\n\r\nplayer();\r\n\r\n\r\n//slick\r\n\r\n$(\".slick-slider\").slick({\r\n    slidesToShow: 1.5,\r\n    infinite: false,\r\n    slidesToScroll: 1,\r\n    autoplay: false,\r\n    autoplaySpeed: 2000,\r\n    dots: false,\r\n    arrows: false,\r\n    responsive: [\r\n        {\r\n            breakpoint: 768,\r\n            settings: {\r\n                slidesToShow: 1.1,\r\n            }\r\n        },\r\n    ]\r\n});\r\n\r\n\r\n$(document).ready(function () {\r\n    $(\".tab-item\").click(function () {\r\n        $(this).closest(\".voice-assistant-item\").toggleClass('active').find(\".tab-content\").slideToggle();\r\n        $(this).closest(\".voice-assistant-item\").prevAll(\".voice-assistant-item\").removeClass('active')\r\n            .find(\".tab-content\").slideUp();\r\n        $(this).closest(\".voice-assistant-item\").nextAll(\".voice-assistant-item\").removeClass('active')\r\n            .find(\".tab-content\").slideUp();\r\n    });\r\n});\r\n\r\n\r\nlet tabActive = document.querySelectorAll('.voice-assistant-item.w-clearfix.active')\r\nlet tab = document.querySelectorAll('.voice-assistant-item.w-clearfix')\r\ntab.forEach((item) => {\r\n\r\n})\r\n\r\n\r\n// *****BURGER********\r\ntry {\r\n    let body = document.querySelector('body')\r\n    let burgerBtn = document.querySelector('.burger-menu');\r\n    let menuContent = document.querySelector('.dropdown-menu__mobile');\r\n\r\n\r\n    burgerBtn.addEventListener('click', function () {\r\n        if (menuContent.classList.contains('flex') === false) {\r\n            menuContent.classList.add('flex');\r\n            burgerBtn.classList.add('burger-close');\r\n            menuContent.classList.remove('hide');\r\n            body.classList.add('hide')\r\n\r\n        } else {\r\n            menuContent.classList.remove('flex');\r\n            burgerBtn.classList.remove('burger-close');\r\n            menuContent.classList.add('hide');\r\n            body.classList.remove('hide')\r\n\r\n        }\r\n    })\r\n} catch (e) {\r\n\r\n}\r\n\r\n\r\n//scrollTo\r\n\r\n$(\".hero-buttons-wrapper .btn:first-child\").click(function () {\r\n    $([document.documentElement, document.body]).animate({\r\n        scrollTop: $(\".playlist\").offset().top\r\n    }, 2000);\r\n});\r\n\r\n$(\".hero-buttons-wrapper .btn:nth-child(2)\").click(function () {\r\n    $([document.documentElement, document.body]).animate({\r\n        scrollTop: $(\".single\").offset().top\r\n    }, 2000);\r\n});\r\n\r\n$(\".hero-buttons-wrapper .btn:nth-child(3)\").click(function () {\r\n    $([document.documentElement, document.body]).animate({\r\n        scrollTop: $(\".slider\").offset().top\r\n    }, 2000);\r\n});\r\n\r\n\r\nlet burgerBtn = document.querySelector('.mobile-btn');\r\n\r\nburgerBtn.addEventListener('click', function (e) {\r\n    burgerBtn.closest('.mobile-menu').classList.toggle('active')\r\n})\r\n\r\n\r\n// track\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://gulp_build/./src/js/main.js?");

/***/ }),

/***/ "./src/js/modules/audio/listItemPlayer.js":
/*!************************************************!*\
  !*** ./src/js/modules/audio/listItemPlayer.js ***!
  \************************************************/
/***/ (function(module) {

eval("const getPlayBtn = (el) => el.querySelector('.play-button');\r\n\r\nconst playItemListPlayer = (audio, element) => {\r\n    const playBtn = getPlayBtn(element)\r\n    playBtn.classList.add('playing');\r\n\r\n   // click on timeline to skip around\r\n        const timeline = element.querySelector('.audio-controls-bar');\r\n        timeline.addEventListener('click', (e) => {\r\n                const timelineWidth = window.getComputedStyle(timeline).width;\r\n                const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;\r\n                audio.currentTime = timeToSeek;\r\n            },\r\n            false\r\n        );\r\n\r\n    setInterval(() => {\r\n        const progressBar = element.querySelector('.audio-controls-bar-current');\r\n        progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';\r\n        element.querySelector('.audio-controls-time').textContent =\r\n            getTimeCodeFromNum(audio.currentTime);\r\n    }, 500);\r\n\r\n\r\n    //         /*turn seconds into minutes*/\r\n    function getTimeCodeFromNum (num) {\r\n        let seconds = parseInt(num);\r\n        let minutes = parseInt(seconds / 60);\r\n        seconds -= minutes * 60;\r\n        const hours = parseInt(minutes / 60);\r\n        minutes -= hours * 60;\r\n\r\n        if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;\r\n        return `${String(hours).padStart(2, 0)}:${minutes}:${String(\r\n            seconds % 60\r\n        ).padStart(2, 0)}`;\r\n    }\r\n\r\n}\r\n\r\nconst pauseItemPlayer = (element) => {\r\n    const playBtn = getPlayBtn(element)\r\n    playBtn.classList.remove('playing');\r\n    // clearInterval(interval)\r\n}\r\n\r\nmodule.exports = { playItemListPlayer, pauseItemPlayer };\r\n\r\n\r\n\n\n//# sourceURL=webpack://gulp_build/./src/js/modules/audio/listItemPlayer.js?");

/***/ }),

/***/ "./src/js/modules/audio/mainPlayer.js":
/*!********************************************!*\
  !*** ./src/js/modules/audio/mainPlayer.js ***!
  \********************************************/
/***/ (function(module) {

eval("const mainPLayer = document.querySelector('.main-player');\r\nconst playBtn = mainPLayer.querySelector('.play-button');\r\n\r\n\r\n\r\nconst playMainPlayer = (audio) => {\r\n    playBtn.classList.add('playing');\r\n    const element = playBtn.closest('.main-player')\r\n    mainPLayer.classList.add('show');\r\n\r\n            // click on timeline to skip around\r\n        const timeline = element.querySelector('.audio-controls-bar');\r\n        timeline.addEventListener('click', (e) => {\r\n                const timelineWidth = window.getComputedStyle(timeline).width;\r\n                const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;\r\n                audio.currentTime = timeToSeek;\r\n            },\r\n            false\r\n        );\r\n\r\n        setInterval(() => {\r\n            const progressBar = element.querySelector('.audio-controls-bar-current');\r\n            if(progressBar){\r\n                progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';\r\n                element.querySelector('.audio-controls-time').textContent =\r\n                    getTimeCodeFromNum(audio.currentTime);\r\n            }\r\n        }, 500);\r\n\r\n\r\n    //         /*turn seconds into minutes*/\r\n    const getTimeCodeFromNum = (num) => {\r\n        let seconds = parseInt(num);\r\n        let minutes = parseInt(seconds / 60);\r\n        seconds -= minutes * 60;\r\n        const hours = parseInt(minutes / 60);\r\n        minutes -= hours * 60;\r\n\r\n        if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;\r\n        return `${String(hours).padStart(2, 0)}:${minutes}:${String(\r\n            seconds % 60\r\n        ).padStart(2, 0)}`;\r\n    }\r\n\r\n\r\n}\r\n\r\nconst pauseMainPlayer = () => {\r\n    playBtn.classList.remove('playing');\r\n    // clearInterval(interval)\r\n}\r\n\r\nmodule.exports = { playMainPlayer, pauseMainPlayer };\r\n\r\n\r\n\n\n//# sourceURL=webpack://gulp_build/./src/js/modules/audio/mainPlayer.js?");

/***/ }),

/***/ "./src/js/modules/audio/player.js":
/*!****************************************!*\
  !*** ./src/js/modules/audio/player.js ***!
  \****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("const {pauseMainPlayer, playMainPlayer} = __webpack_require__(/*! ./mainPlayer */ \"./src/js/modules/audio/mainPlayer.js\");\r\nconst {pauseItemPlayer, playItemListPlayer} = __webpack_require__(/*! ./listItemPlayer */ \"./src/js/modules/audio/listItemPlayer.js\");\r\n\r\nmodule.exports = function () {\r\n    const audioBlockItems = document.querySelectorAll('.voice-assistant-item');\r\n    const playBtnMain = document.querySelector('.player button.play-button');\r\n\r\n    const playBtnTopical = document.querySelector('.topical-player .play-button');\r\n    let currentTopicalAudio;\r\n    const topicalUrls = ['https://cdn4.deliciouspears.com/load/258702068/INSTASAMKA_-_ZA_DENGI_DA_(musmore.com).mp3']\r\n\r\n    const playData = [];\r\n    let currentPlayedAudio;\r\n\r\n    const pauseFullMainPlayer = () => {\r\n        const playedAudioData = playData.find(({audio}) => !audio.paused);\r\n        if (playedAudioData) {\r\n            playedAudioData.audio.pause();\r\n            pauseItemPlayer(playedAudioData.element)\r\n            pauseMainPlayer()\r\n        }\r\n    }\r\n\r\n    const handlePlayMainPlayer = async (audioData) => {\r\n        const {audio, element} = audioData;\r\n        pauseTopicalPlayer();\r\n        try {\r\n            playItemListPlayer(audio, element)\r\n            playMainPlayer(audio)\r\n\r\n            playData.forEach((data) => {\r\n                if (data.audio !== audio && !data.audio.paused) {\r\n                    data.audio.pause()\r\n                    pauseItemPlayer(data.element)\r\n                }\r\n            })\r\n\r\n            await audio.play();\r\n            currentPlayedAudio = audio;\r\n        } catch (e) {\r\n            pauseItemPlayer(element)\r\n            pauseMainPlayer()\r\n            console.error(e)\r\n        }\r\n    }\r\n\r\n    const handlePauseMainPlayer = async (audioData) => {\r\n        const {audio, element} = audioData;\r\n        try {\r\n            pauseItemPlayer(element)\r\n            pauseMainPlayer()\r\n            audio.pause();\r\n        } catch (e) {\r\n            console.error(e)\r\n        }\r\n    }\r\n\r\n    playBtnMain.addEventListener('click', () => {\r\n        const audioData = playData.find((data) => data.audio === currentPlayedAudio);\r\n        if (!audioData) return;\r\n\r\n        if (currentPlayedAudio.paused) {\r\n            return handlePlayMainPlayer(audioData)\r\n        } else {\r\n            return handlePauseMainPlayer(audioData)\r\n        }\r\n    });\r\n\r\n    const handleAudioListItemBtnClick = (src, element) => {\r\n        const audioData = playData.find((data) => data.element === element);\r\n\r\n        if (!audioData) {\r\n            const audio = new Audio(src);\r\n            const newData = {audio, element}\r\n            playData.push(newData);\r\n            return handlePlayMainPlayer(newData)\r\n        }\r\n\r\n        if (audioData.audio.paused) {\r\n            return handlePlayMainPlayer(audioData)\r\n        } else {\r\n            return handlePauseMainPlayer(audioData)\r\n        }\r\n    }\r\n\r\n\r\n    if (audioBlockItems.length) {\r\n        audioBlockItems.forEach((item) => {\r\n            const audioUrl = item.getAttribute('data-audio');\r\n            const playBtn = item.querySelector('.play-button');\r\n\r\n            playBtn.addEventListener('click', () => handleAudioListItemBtnClick(audioUrl, item));\r\n        });\r\n    }\r\n\r\n\r\n    //Topical player\r\n    const playTopical = async (audio) => {\r\n        try {\r\n            await audio.play();\r\n            currentTopicalAudio = audio;\r\n        } catch (e) {\r\n            console.error(e)\r\n        }\r\n    }\r\n\r\n    function playTopicalPlayer() {\r\n        playBtnTopical.classList.add('playing');\r\n\r\n        if (!currentTopicalAudio) {\r\n            return playTopical(new Audio(topicalUrls[0])).catch(_ => playBtnTopical.classList.remove('playing'));\r\n        }\r\n\r\n        return playTopical(currentTopicalAudio).catch(_ => playBtnTopical.classList.remove('playing'));\r\n    }\r\n\r\n    function pauseTopicalPlayer() {\r\n        playBtnTopical.classList.remove('playing');\r\n        currentTopicalAudio?.pause();\r\n    }\r\n\r\n    // playBtnTopical.addEventListener('click', () => {\r\n    //     if (currentTopicalAudio && !currentTopicalAudio.paused) {\r\n    //         return pauseTopicalPlayer();\r\n    //     }\r\n    //\r\n    //     pauseFullMainPlayer();\r\n    //     return playTopicalPlayer();\r\n    // })\r\n}\r\n\r\n\n\n//# sourceURL=webpack://gulp_build/./src/js/modules/audio/player.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/main.js");
/******/ 	
/******/ })()
;