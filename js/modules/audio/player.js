import {pauseItemPlayer, playItemListPlayer, cleanupItemPlayer} from './listItemPlayer.js';
import { debug, debugWarn, debugError } from '../utils/debug.js';
import createMiniPlayer from './miniPlayer.js';

export default function () {
    // Initialize mini player
    const miniPlayer = createMiniPlayer();
    const audioBlockItems = document.querySelectorAll('.voice-assistant-item');

    const playBtnTopical = document.querySelector('.topical-player .play-button');
    let currentTopicalAudio;
    const topicalUrls = ['https://cdn4.deliciouspears.com/load/258702068/INSTASAMKA_-_ZA_DENGI_DA_(musmore.com).mp3']
    const hasTopicalPlayer = !!playBtnTopical;

    const playData = [];
    let currentPlayedAudio;
    
    // Store a reference to this player instance
    const playerInstance = this;

    const pauseOtherTracks = (audioToKeep = null) => {
        playData.forEach(({audio, element}) => {
            if (audio !== audioToKeep && !audio.paused) {
                audio.pause();
                pauseItemPlayer(element);
            }
        });
    }

    const handlePlayAudio = async (audioData) => {
        const {audio, element} = audioData;
        debug('player', 'handlePlayAudio called');
        pauseTopicalPlayer();

        // Pause other tracks first
        debug('player', 'Pausing other tracks');
        pauseOtherTracks(audio);

        // Extract track info for mini player
        const trackTitle = element.querySelector('.title-track')?.textContent || '';
        const artistName = element.querySelector('.name-track')?.textContent || '';
        
        // Use setTimeout to ensure onclick handlers complete first
        setTimeout(async () => {
            try {
                debug('player', 'Calling playItemListPlayer');
                playItemListPlayer(audio, element)

                debug('player', 'Starting audio playback');
                await audio.play();
                currentPlayedAudio = audio;
                
                // Update mini player with current track
                console.log('PLAYER: Updating mini player with track info', trackTitle, artistName);
                if (miniPlayer && typeof miniPlayer.updateAudioState === 'function') {
                    miniPlayer.updateAudioState(audio, {
                        title: trackTitle,
                        artist: artistName
                    }, true);
                } else {
                    console.error('PLAYER: miniPlayer or updateAudioState not available', miniPlayer);
                }
                
                debug('player', 'Audio playing successfully');
            } catch (e) {
                debugError('player', 'Error in handlePlayAudio:', e);
                // Reset audio state on error
                audio.pause();
                // Don't reset currentTime - let user continue from where they were
                pauseItemPlayer(element)
            }
        }, 100); // Increase timeout to 100ms to ensure gtag completes
    }

    const handlePauseAudio = async (audioData) => {
        const {audio, element} = audioData;
        try {
            pauseItemPlayer(element)
            audio.pause();
            
            // Extract track info for mini player
            const trackTitle = element.querySelector('.title-track')?.textContent || '';
            const artistName = element.querySelector('.name-track')?.textContent || '';
            
            // Update mini player with paused state
            miniPlayer.updateAudioState(audio, {
                title: trackTitle,
                artist: artistName
            }, false);
            
            if (currentPlayedAudio === audio) {
                currentPlayedAudio = null;
            }
        } catch (e) {
            debugError('player', e)
        }
    }

    const handleAudioListItemBtnClick = (src, element) => {
        debug('player', 'handleAudioListItemBtnClick called for element:', element);
        const existingAudioData = playData.find((data) => data.element === element);

        if (!existingAudioData) {
            debug('player', 'No audio data found, creating new Audio');
            const audio = new Audio(src);
            audio.preload = 'auto'; // Ensure audio is preloaded
            audio.load(); // Explicitly load the audio
            audio.dataset.originalSrc = src;
            
            // Add ended event listener to clean up when track finishes
            audio.addEventListener('ended', () => {
                pauseItemPlayer(element);
                
                // Update mini player when track ends
                miniPlayer.handleAudioEnded();
                
                if (currentPlayedAudio === audio) {
                    currentPlayedAudio = null;
                }
                
                // Auto-play next track from the same album
                const albumId = element.dataset.albumId;
                if (albumId) {
                    // Find all tracks from the same album
                    const albumTracks = Array.from(document.querySelectorAll(`.voice-assistant-item[data-album-id="${albumId}"]`));
                    const currentIndex = albumTracks.indexOf(element);
                    
                    // If there's a next track in the album, play it
                    if (currentIndex >= 0 && currentIndex < albumTracks.length - 1) {
                        const nextElement = albumTracks[currentIndex + 1];
                        const nextAudioUrl = nextElement.getAttribute('data-audio');
                        
                        // Small delay to ensure current track cleanup completes
                        setTimeout(() => {
                            handleAudioListItemBtnClick(nextAudioUrl, nextElement);
                        }, 300);
                    }
                }
            });
            
            const newData = {audio, element}
            playData.push(newData);
            return handlePlayAudio(newData)
        }

        debug('player', 'Audio data found, paused:', existingAudioData.audio.paused, 'ended:', existingAudioData.audio.ended, 'readyState:', existingAudioData.audio.readyState);
        
        // If audio ended, reset currentTime to restart from beginning
        if (existingAudioData.audio.ended) {
            existingAudioData.audio.currentTime = 0;
        }
        
        // Check if audio is actually playing (not paused and not ended)
        if (existingAudioData.audio.paused || existingAudioData.audio.ended) {
            return handlePlayAudio(existingAudioData)
        } else {
            return handlePauseAudio(existingAudioData)
        }
    }


    if (audioBlockItems.length) {
        audioBlockItems.forEach((item) => {
            const audioUrl = item.getAttribute('data-audio');
            const playBtn = item.querySelector('.play-button');

            playBtn.addEventListener('click', () => handleAudioListItemBtnClick(audioUrl, item));
        });
    }


    //Topical player
    const playTopical = async (audio) => {
        try {
            await audio.play();
            currentTopicalAudio = audio;
        } catch (e) {
            debugError('player', e)
        }
    }

    function playTopicalPlayer() {
        if (!hasTopicalPlayer) return;
        playBtnTopical.classList.add('playing');

        if (!currentTopicalAudio) {
            const audio = new Audio(topicalUrls[0]);
            audio.preload = 'auto';
            audio.load();
            currentTopicalAudio = audio;
        }

        if (currentTopicalAudio.paused) {
            pauseOtherTracks();
            playTopical(currentTopicalAudio);
        } else {
            pauseTopicalPlayer();
        }
    }

    function pauseTopicalPlayer() {
        if (!hasTopicalPlayer) return;
        playBtnTopical.classList.remove('playing');
        if (currentTopicalAudio) {
            currentTopicalAudio.pause();
        }
    }

    if (hasTopicalPlayer) {
        playBtnTopical.addEventListener('click', playTopicalPlayer);
    }

    // Clean up function for when the player is destroyed
    const cleanup = () => {
        debug('player', 'Cleanup called, stopping all audio and clearing state');
        
        // Stop all audio playback
        playData.forEach(({audio, element}) => {
            try {
                if (audio && !audio.paused) {
                    audio.pause();
                    audio.currentTime = 0;
                }
                cleanupItemPlayer(element);
            } catch (e) {
                debugError('player', 'Error cleaning up audio:', e);
            }
        });
        
        // Reset topical player if it exists
        if (currentTopicalAudio) {
            try {
                currentTopicalAudio.pause();
                currentTopicalAudio.currentTime = 0;
                currentTopicalAudio = null;
            } catch (e) {
                debugError('player', 'Error cleaning up topical audio:', e);
            }
        }
        
        // Clean up mini player
        try {
            miniPlayer.cleanup();
        } catch (e) {
            debugError('player', 'Error cleaning up mini player:', e);
        }
        
        // Clear the playData array to remove references to old DOM elements
        playData.length = 0;
        currentPlayedAudio = null;
    };
    
    // Listen for the cleanup event from language switcher
    window.addEventListener('audioCleanupRequired', () => {
        debug('player', 'Audio cleanup event received');
        cleanup();
    });

    // Export cleanup function if needed
    return { cleanup };
}
