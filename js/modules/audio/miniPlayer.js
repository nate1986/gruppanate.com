import { getTimeCodeFromNum } from '../utils/audioUtils.js';
import { debug, debugWarn, debugError } from '../utils/debug.js';

// Mini Player module
export default function() {
    const miniPlayer = document.getElementById('mini-player');
    const miniPlayerArtist = document.getElementById('mini-player-artist');
    const miniPlayerTrack = document.getElementById('mini-player-track');
    const miniPlayerProgress = document.getElementById('mini-player-progress');
    const miniPlayerTime = document.getElementById('mini-player-time');
    const miniPlayerPlayPause = document.getElementById('mini-player-playpause');
    const miniPlayerProgressContainer = document.getElementById('mini-player-progress-container');
    
    let currentAudio = null;
    let updateInterval = null;
    let isDragging = false;
    
    // Initialize the mini player
    function init() {
        debug('miniPlayer', 'Initializing mini player');
        
        // Add click event for play/pause button
        miniPlayerPlayPause.addEventListener('click', togglePlayPause);
        
        // Add timeline seek functionality
        miniPlayerProgressContainer.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        // Hide mini player initially
        hideMiniPlayer();
    }
    
    // Show mini player with track info
    function showMiniPlayer(audio, trackInfo) {
        debug('miniPlayer', 'Showing mini player', trackInfo);
        console.log('MINI PLAYER: Showing mini player', trackInfo, audio);
        
        if (!miniPlayer) {
            console.error('MINI PLAYER: miniPlayer element not found');
            return;
        }
        
        currentAudio = audio;
        
        // Update track info
        if (miniPlayerArtist) miniPlayerArtist.textContent = trackInfo.artist || '';
        else console.error('MINI PLAYER: miniPlayerArtist element not found');
        
        if (miniPlayerTrack) miniPlayerTrack.textContent = trackInfo.title || '';
        else console.error('MINI PLAYER: miniPlayerTrack element not found');
        
        // Check the play button
        if (!miniPlayerPlayPause) {
            console.error('MINI PLAYER: miniPlayerPlayPause element not found');
        } else {
            console.log('MINI PLAYER: Play button found', miniPlayerPlayPause);
        }
        
        // Show the mini player
        miniPlayer.classList.add('visible');
        
        // Update play/pause button state
        updatePlayPauseState();
        
        // Start progress update interval
        startProgressInterval();
        
        // Double-check button state after a short delay
        setTimeout(() => {
            console.log('MINI PLAYER: Delayed button state check');
            updatePlayPauseState();
        }, 200);
    }
    
    // Hide mini player
    function hideMiniPlayer() {
        debug('miniPlayer', 'Hiding mini player');
        
        miniPlayer.classList.remove('visible');
        stopProgressInterval();
        currentAudio = null;
    }
    
    // Toggle play/pause
    function togglePlayPause() {
        if (!currentAudio) return;
        
        debug('miniPlayer', 'Toggle play/pause', { paused: currentAudio.paused });
        
        if (currentAudio.paused) {
            currentAudio.play().catch(err => {
                debugError('miniPlayer', 'Error playing audio:', err);
            });
        } else {
            currentAudio.pause();
        }
        
        updatePlayPauseState();
    }
    
    // Update play/pause button state
    function updatePlayPauseState() {
        if (!currentAudio) return;
        
        console.log('MINI PLAYER: Updating play/pause state', { 
            paused: currentAudio.paused,
            buttonExists: !!miniPlayerPlayPause,
            hasClass: miniPlayerPlayPause ? miniPlayerPlayPause.classList.contains('playing') : 'N/A'
        });
        
        if (currentAudio.paused) {
            miniPlayerPlayPause.classList.remove('playing');
        } else {
            miniPlayerPlayPause.classList.add('playing');
        }

        // Dispatch a custom event to notify other players of the state change
        const event = new CustomEvent('miniPlayerStateChange', {
            detail: {
                paused: currentAudio.paused,
                trackSrc: currentAudio.src,
                trackInfo: currentAudio.trackInfo || null
            }
        });
        document.dispatchEvent(event);
        
        // Force a repaint to ensure the button updates visually
        miniPlayerPlayPause.style.display = 'none';
        miniPlayerPlayPause.offsetHeight; // Trigger a reflow
        miniPlayerPlayPause.style.display = '';
    }
    
    // Start progress update interval
    function startProgressInterval() {
        stopProgressInterval();
        
        updateProgress();
        
        updateInterval = setInterval(() => {
            if (!isDragging) {
                updateProgress();
            }
        }, 100); // Update more frequently for smoother progress
    }
    
    // Stop progress update interval
    function stopProgressInterval() {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
    }
    
    // Update progress bar and time
    function updateProgress() {
        if (!currentAudio || !Number.isFinite(currentAudio.duration) || currentAudio.duration === 0) return;
        
        const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
        
        // Update the progress bar width
        miniPlayerProgress.style.width = `${progress}%`;
        
        miniPlayerTime.textContent = getTimeCodeFromNum(currentAudio.currentTime);
    }
    
    // Handle mouse down on progress bar
    function handleMouseDown(e) {
        if (!currentAudio) return;
        
        isDragging = true;
        handleSeek(e);
    }
    
    // Handle mouse move for seeking
    function handleMouseMove(e) {
        if (!isDragging || !currentAudio) return;
        
        handleSeek(e);
    }
    
    // Handle mouse up to end seeking
    function handleMouseUp() {
        isDragging = false;
    }
    
    // Handle seeking in the progress bar
    function handleSeek(e) {
        if (!currentAudio || !Number.isFinite(currentAudio.duration) || currentAudio.duration === 0) return;
        
        const rect = miniPlayerProgressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const containerWidth = rect.width;
        
        if (containerWidth <= 0) return;
        
        const ratio = Math.max(0, Math.min(clickX / containerWidth, 1));
        const seekTime = ratio * currentAudio.duration;
        
        // Add error handling for seeking
        try {
            currentAudio.currentTime = seekTime;
            updateProgress();
        } catch (error) {
            debugError('miniPlayer', 'Error seeking audio:', error);
        }
    }
    
    // Update mini player when audio state changes
    function updateAudioState(audio, trackInfo, isPlaying) {
        debug('miniPlayer', 'Updating audio state', { trackInfo, isPlaying });
        
        if (isPlaying) {
            showMiniPlayer(audio, trackInfo);
        } else if (currentAudio === audio) {
            updatePlayPauseState();
        }
    }
    
    // Handle audio ended event
    function handleAudioEnded() {
        updatePlayPauseState();
    }
    
    // Clean up resources
    function cleanup() {
        debug('miniPlayer', 'Cleaning up mini player');
        
        stopProgressInterval();
        
        // Remove event listeners
        miniPlayerPlayPause.removeEventListener('click', togglePlayPause);
        miniPlayerProgressContainer.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        
        // Hide mini player
        hideMiniPlayer();
    }
    
    // Initialize on creation
    console.log('MINI PLAYER: Initializing mini player module');
    init();
    
    // Return public API
    console.log('MINI PLAYER: Returning public API');
    return {
        updateAudioState,
        handleAudioEnded,
        cleanup
    };
}
