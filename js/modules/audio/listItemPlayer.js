import { getTimeCodeFromNum } from '../utils/audioUtils.js';
import { debug, debugWarn, debugError } from '../utils/debug.js';

const getPlayBtn = (el) => el.querySelector('.play-button');
const intervals = new Map();
const audioMap = new WeakMap(); // Store audio reference for each element
const timelineListeners = new WeakMap(); // Track timeline listeners
const draggingStates = new WeakMap(); // Track dragging state per timeline
const blobUrlMap = new WeakMap();
const blobFetchPromises = new WeakMap();
const pendingSeekMap = new WeakMap();

const ensureSeekableAudio = async (audio, element, seekTime, trackTitle) => {
    if (!audio) return;

    const seekable = audio.seekable;
    try {
        if (seekable && seekable.length > 0) {
            const lastIndex = seekable.length - 1;
            const seekableEnd = seekable.end(lastIndex);
            const targetTime = Number.isFinite(seekTime) ? seekTime : 0;
            if (Number.isFinite(seekableEnd) && (seekableEnd >= Math.min(audio.duration - 0.5, targetTime))) {
                return; // Already fully seekable to desired point
            }
        }
    } catch (err) {
        debugWarn('audio', '[ListItemPlayer][ensureSeekableAudio] error reading seekable ranges', err);
    }

    if (Number.isFinite(seekTime)) {
        pendingSeekMap.set(audio, seekTime);
    }

    if (blobFetchPromises.has(audio)) {
        return blobFetchPromises.get(audio);
    }

    const originalSrc = audio.dataset?.originalSrc || audio.getAttribute('data-original-src') || audio.src;
    if (!originalSrc || originalSrc.startsWith('blob:')) {
        return;
    }

    const fetchPromise = (async () => {
        debugWarn('audio', '[ListItemPlayer][ensureSeekableAudio] Fetching full audio for seek fallback', {
            trackTitle,
            originalSrc,
            seekTime,
        });
        let response;
        try {
            response = await fetch(originalSrc);
        } catch (error) {
            debugError('audio', '[ListItemPlayer][ensureSeekableAudio] Fetch failed', { trackTitle, error });
            throw error;
        }

        if (!response.ok) {
            const error = new Error(`Failed to fetch audio. Status ${response.status}`);
            debugError('audio', '[ListItemPlayer][ensureSeekableAudio] Fetch not ok', { trackTitle, status: response.status });
            throw error;
        }

        let blob;
        try {
            blob = await response.blob();
        } catch (error) {
            debugError('audio', '[ListItemPlayer][ensureSeekableAudio] Error reading blob', { trackTitle, error });
            throw error;
        }

        const previousBlobUrl = blobUrlMap.get(audio);
        if (previousBlobUrl) {
            URL.revokeObjectURL(previousBlobUrl);
        }

        const blobUrl = URL.createObjectURL(blob);
        blobUrlMap.set(audio, blobUrl);

        const wasPaused = audio.paused;

        const applyPendingSeek = () => {
            audio.removeEventListener('loadedmetadata', applyPendingSeek);
            const pending = pendingSeekMap.get(audio);
            if (Number.isFinite(pending)) {
                try {
                    audio.currentTime = pending;
                    debug('audio', '[ListItemPlayer][ensureSeekableAudio] Applied pending seek', { trackTitle, pending });
                } catch (error) {
                    debugError('audio', '[ListItemPlayer][ensureSeekableAudio] Failed to set pending seek', { trackTitle, error });
                }
            }
            pendingSeekMap.delete(audio);
            if (!wasPaused) {
                audio.play().catch((error) => {
                    debugWarn('audio', '[ListItemPlayer][ensureSeekableAudio] Failed to resume playback after blob swap', { trackTitle, error });
                });
            }
        };

        audio.addEventListener('loadedmetadata', applyPendingSeek, { once: true });

        audio.dataset.seekableSource = 'blob';
        audio.src = blobUrl;
        audio.load();
    })()
        .catch((error) => {
            pendingSeekMap.delete(audio);
            debugError('audio', '[ListItemPlayer][ensureSeekableAudio] Fallback failed', { trackTitle, error });
            throw error;
        })
        .finally(() => {
            blobFetchPromises.delete(audio);
        });

    blobFetchPromises.set(audio, fetchPromise);
    return fetchPromise;
};

const handleSeek = (e, timelineContainer, element) => {
    const currentAudio = audioMap.get(element);
    const trackTitle = element.querySelector('.title-track')?.textContent || 'Unknown';
    const eventType = e?.type;
    const pointerInfo = {
        clientX: e?.clientX,
        pageX: e?.pageX,
        offsetX: e?.offsetX,
        button: e?.button,
        buttons: e?.buttons,
    };

    debug('audio', '[ListItemPlayer][handleSeek:start]', {
        trackTitle,
        eventType,
        pointerInfo,
        audioAttached: Boolean(currentAudio),
        readyState: currentAudio?.readyState,
        duration: currentAudio?.duration,
        paused: currentAudio?.paused,
        currentTime: currentAudio?.currentTime,
    });

    // Guard: ensure we have an audio element
    if (!currentAudio) return;

    // Guard: ensure we have a finite duration before seeking
    if (!Number.isFinite(currentAudio.duration) || currentAudio.duration === 0) {
        debugWarn('audio', 'Skip seeking, duration not ready for track:', trackTitle, 'duration:', currentAudio?.duration);
        return;
    }

    const doSeek = (seekTime, context) => {
        const seekableRanges = [];
        for (let i = 0; i < currentAudio.seekable.length; i++) {
            seekableRanges.push({
                start: currentAudio.seekable.start(i),
                end: currentAudio.seekable.end(i),
            });
        }

        const bufferedRanges = [];
        for (let i = 0; i < currentAudio.buffered.length; i++) {
            bufferedRanges.push({
                start: currentAudio.buffered.start(i),
                end: currentAudio.buffered.end(i),
            });
        }

        debug('audio', '[ListItemPlayer][handleSeek:doSeek]', {
            trackTitle,
            seekTime,
            duration: currentAudio.duration,
            currentTimeBefore: currentAudio.currentTime,
            context,
            seekableRanges,
            bufferedRanges,
        });

        ensureSeekableAudio(currentAudio, element, seekTime, trackTitle).catch((error) => {
            debugError('audio', '[ListItemPlayer][handleSeek:doSeek] ensureSeekableAudio failed', { trackTitle, error });
        });

        // Pause interval while seeking
        if (intervals.has(element)) {
            clearInterval(intervals.get(element));
            intervals.delete(element);
            debug('audio', '[ListItemPlayer][handleSeek:doSeek] Cleared interval before seek', { trackTitle });
        }

        try {
            currentAudio.currentTime = seekTime;
        } catch (error) {
            debugWarn('audio', '[ListItemPlayer][handleSeek:setCurrentTime:error]', {
                trackTitle,
                seekTime,
                error,
            });
            return;
        }
        debug('audio', '[ListItemPlayer][handleSeek:setCurrentTime]', {
            trackTitle,
            seekTime,
            actualCurrentTime: currentAudio.currentTime,
            paused: currentAudio.paused,
        });

        const updateUI = () => {
            const progressBar = element.querySelector('.audio-controls-bar-current');
            if (progressBar && Number.isFinite(currentAudio.duration) && currentAudio.duration !== 0) {
                progressBar.style.width = (currentAudio.currentTime / currentAudio.duration) * 100 + '%';
            }
            const timeElement = element.querySelector('.audio-controls-time');
            if (timeElement) {
                timeElement.textContent = getTimeCodeFromNum(currentAudio.currentTime);
            }
        }

        // Update immediately
        updateUI();

        // Once seek completes, restart interval
        const onSeeked = () => {
            currentAudio.removeEventListener('seeked', onSeeked);
            debug('audio', '[ListItemPlayer][handleSeek:seeked]', {
                trackTitle,
                currentTimeAfter: currentAudio.currentTime,
                paused: currentAudio.paused,
            });
            const intervalId = setInterval(() => {
                if (!draggingStates.get(timelineContainer)) {
                    updateUI();
                }
            }, 500);
            intervals.set(element, intervalId);
            debug('audio', '[ListItemPlayer][handleSeek:seeked] Restarted interval', { trackTitle });
        }
        currentAudio.addEventListener('seeked', onSeeked);
    }

    // If metadata not ready yet, wait for it once and then seek
    if (currentAudio.readyState < 1) { // HAVE_METADATA = 1
        const onMeta = () => {
            currentAudio.removeEventListener('loadedmetadata', onMeta);
            const rect = timelineContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const seekTime = Math.max(0, Math.min(clickX, rect.width)) / rect.width * currentAudio.duration;
            debug('audio', '[ListItemPlayer][handleSeek:metadata-loaded]', {
                trackTitle,
                rect,
                clickX,
                seekTime,
            });
            doSeek(seekTime, 'metadata-loaded');
        };
        currentAudio.addEventListener('loadedmetadata', onMeta);
        return;
    }

    const rect = timelineContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const timelineWidth = rect.width || rect.right - rect.left;
    debug('audio', '[ListItemPlayer][handleSeek:pre-calc]', {
        trackTitle,
        rect,
        clickX,
        timelineWidth,
    });
    if (timelineWidth <= 0) {
        debugWarn('audio', 'Timeline width is zero, abort seek');
        return;
    }
    const clampedX = Math.max(0, Math.min(clickX, timelineWidth));
    const ratio = clampedX / timelineWidth;
    const timeToSeek = Math.min(currentAudio.duration * ratio, Math.max(currentAudio.duration - 0.1, 0));
    debug('audio', '[ListItemPlayer][handleSeek:calculated]', {
        trackTitle,
        clampedX,
        ratio,
        timeToSeek,
        duration: currentAudio.duration,
    });
    doSeek(timeToSeek, 'immediate');
};

export const playItemListPlayer = (audio, element) => {
    const playBtn = getPlayBtn(element)
    const trackTitle = element.querySelector('.title-track')?.textContent || 'Unknown';
    debug('audio', 'playItemListPlayer called for track:', trackTitle, 'playBtn:', playBtn, 'has playing class:', playBtn?.classList.contains('playing'));
    debug('audio', '[ListItemPlayer][play] storing audio reference', { trackTitle, audioSrc: audio?.src, duration: audio?.duration, readyState: audio?.readyState });
    if (playBtn) {
        playBtn.classList.add('playing');
        debug('audio', 'Added playing class, now has:', playBtn.classList.contains('playing'));
    }

    // Store audio reference for this element
    audioMap.set(element, audio);
    debug('audio', '[ListItemPlayer][play] audioMap size', audioMap);

    // click and drag on timeline to skip around - only add listener once per element
    const timelineContainer = element.querySelector('.audio-controls-bar');
    const timelineHitArea = element.querySelector('.timeline-grab-area') || timelineContainer;
    if (timelineContainer && timelineHitArea && !timelineListeners.has(element)) {
        debug('audio', '[ListItemPlayer][timeline:init]', {
            trackTitle,
            timelineSelector: '.audio-controls-bar',
            timelineFound: Boolean(timelineContainer),
            hitSelector: '.timeline-grab-area',
            hitAreaFound: Boolean(timelineHitArea),
            element,
        });
        // Initialize dragging state
        draggingStates.set(timelineContainer, false);

        // Click handler
        const clickHandler = (e) => {
            const trackTitle = element.querySelector('.title-track')?.textContent || 'Unknown';
            debug('audio', '[ListItemPlayer][timeline:click]', {
                trackTitle,
                dragging: draggingStates.get(timelineContainer),
                currentTime: audioMap.get(element)?.currentTime,
                duration: audioMap.get(element)?.duration,
                eventTarget: e.target,
                targetClass: e.target?.className,
                listenerAttachedTo: timelineHitArea.className,
                composedPath: e.composedPath ? e.composedPath().map((node) => node?.className || node?.nodeName) : undefined,
            });
            e.stopImmediatePropagation();
            e.stopPropagation(); // Prevent event bubbling
            e.preventDefault(); // Prevent default behavior
            if (!draggingStates.get(timelineContainer)) {
                handleSeek(e, timelineContainer, element);
            }
        };

        // Mouse down handler - start dragging
        const mouseDownHandler = (e) => {
            debug('audio', '[ListItemPlayer][timeline:mousedown]', {
                trackTitle,
                dragging: draggingStates.get(timelineContainer),
                currentTime: audioMap.get(element)?.currentTime,
                duration: audioMap.get(element)?.duration,
                eventTarget: e.target,
                targetClass: e.target?.className,
                listenerAttachedTo: timelineHitArea.className,
                composedPath: e.composedPath ? e.composedPath().map((node) => node?.className || node?.nodeName) : undefined,
            });
            e.stopImmediatePropagation();
            e.stopPropagation(); // Prevent event bubbling
            e.preventDefault(); // Prevent default behavior
            draggingStates.set(timelineContainer, true);
            handleSeek(e, timelineContainer, element);
        };

        // Mouse move handler - handle dragging
        const mouseMoveHandler = (e) => {
            const isDragging = draggingStates.get(timelineContainer);
            if (isDragging) {
                // Only prevent default if we're actually dragging on this timeline
                // Check if mouse is over the timeline element to avoid blocking scroll elsewhere
                const rect = timelineContainer.getBoundingClientRect();
                const isOverTimeline = e.clientX >= rect.left && e.clientX <= rect.right &&
                                      e.clientY >= rect.top && e.clientY <= rect.bottom;
                
                if (isOverTimeline) {
                    debug('audio', '[ListItemPlayer][timeline:mousemove]', {
                        trackTitle,
                        clientX: e.clientX,
                        currentTime: audioMap.get(element)?.currentTime,
                        eventTarget: e.target,
                        targetClass: e.target?.className,
                        listenerAttachedTo: timelineHitArea.className,
                    });
                    handleSeek(e, timelineContainer, element);
                    e.preventDefault();
                } else {
                    // Mouse left the timeline area, stop dragging
                    draggingStates.set(timelineContainer, false);
                }
            }
        };

        // Mouse up handler - stop dragging
        const mouseUpHandler = () => {
            debug('audio', '[ListItemPlayer][timeline:mouseup]', {
                trackTitle,
                currentTime: audioMap.get(element)?.currentTime,
            });
            draggingStates.set(timelineContainer, false);
        };

        // Mouse leave handler - stop dragging when leaving timeline
        const mouseLeaveHandler = () => {
            debug('audio', '[ListItemPlayer][timeline:mouseleave]', {
                trackTitle,
                currentTime: audioMap.get(element)?.currentTime,
            });
            draggingStates.set(timelineContainer, false);
        };

        // Add all event listeners
        timelineHitArea.addEventListener('click', clickHandler, true); // capture true
        timelineHitArea.addEventListener('mousedown', mouseDownHandler, true); // capture true
        document.addEventListener('mousemove', mouseMoveHandler, false);
        document.addEventListener('mouseup', mouseUpHandler, false);
        timelineHitArea.addEventListener('mouseleave', mouseLeaveHandler, false);

        // Add listener for mini player state changes
        const handleMiniPlayerStateChange = (event) => {
            const { paused, trackSrc } = event.detail;
            const currentTrackSrc = audioMap.get(element)?.src;

            // Check if the event is for the currently playing track in this list item
            if (trackSrc && currentTrackSrc && trackSrc === currentTrackSrc) {
                const playBtn = getPlayBtn(element);
                if (playBtn) {
                    if (paused) {
                        playBtn.classList.remove('playing');
                    } else {
                        playBtn.classList.add('playing');
                    }
                }
            }
        };
        document.addEventListener('miniPlayerStateChange', handleMiniPlayerStateChange);

        // Store listener info to prevent duplicate listeners
        timelineListeners.set(element, {
            clickHandler,
            mouseDownHandler,
            mouseMoveHandler,
            mouseUpHandler,
            mouseLeaveHandler,
            handleMiniPlayerStateChange,
            timeline: timelineContainer,
            hitArea: timelineHitArea
        });
    }

    // Clear existing interval for this element if any
    if (intervals.has(element)) {
        clearInterval(intervals.get(element));
    }

    // Create new interval and store it
    const intervalId = setInterval(() => {
        const progressBar = element.querySelector('.audio-controls-bar-current');
        if (progressBar && !draggingStates.get(timelineContainer) && Number.isFinite(audio.duration) && audio.duration !== 0) { // Don't update while dragging
            progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
            const timeElement = element.querySelector('.audio-controls-time');
            if (timeElement) {
                timeElement.textContent = getTimeCodeFromNum(audio.currentTime);
            }
        }
    }, 500);
    intervals.set(element, intervalId);
}

export const pauseItemPlayer = (element) => {
    const playBtn = getPlayBtn(element)
    debug('audio', 'pauseItemPlayer called, playBtn:', playBtn, 'has playing class:', playBtn?.classList.contains('playing'));
    if (playBtn) {
        playBtn.classList.remove('playing');
        debug('audio', 'Removed playing class, now has:', playBtn.classList.contains('playing'));
    }

    // Clear the interval when pausing
    if (intervals.has(element)) {
        clearInterval(intervals.get(element));
        intervals.delete(element);
    }
    
    // Reset dragging state for this element's timeline
    const timelineContainer = element.querySelector('.audio-controls-bar');
    if (timelineContainer && draggingStates.has(timelineContainer)) {
        draggingStates.set(timelineContainer, false);
    }
}

// Clean up function to remove listeners when needed
export const cleanupItemPlayer = (element) => {
    pauseItemPlayer(element);

    // Remove timeline listeners
    const listenerInfo = timelineListeners.get(element);
    if (listenerInfo) {
        const { timeline, clickHandler, mouseDownHandler, mouseMoveHandler, mouseUpHandler, mouseLeaveHandler, handleMiniPlayerStateChange } = listenerInfo;

        timeline.removeEventListener('click', clickHandler);
        timeline.removeEventListener('mousedown', mouseDownHandler);
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        timeline.removeEventListener('mouseleave', mouseLeaveHandler);
        
        // Remove mini player state change listener
        if (handleMiniPlayerStateChange) {
            document.removeEventListener('miniPlayerStateChange', handleMiniPlayerStateChange);
        }

        timelineListeners.delete(element);
        draggingStates.delete(timeline);
    }

    // Clean up audio reference
    audioMap.delete(element);
}
