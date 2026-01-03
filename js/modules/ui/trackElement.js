import { translate, getCurrentLanguage } from '../utils/language.js';
import { generalInfo } from '../data/generalinfo.js';
import { safeGtagEvent, safeGtagReportConversionContent } from '../utils/analytics.js';

/**
 * Creates a track element for the playlist
 * @param {Object} track - The track data
 * @param {string} lang - The current language
 * @returns {HTMLElement} - The track element
 */
export function createTrackElement(track, lang = getCurrentLanguage()) {
  const article = document.createElement('article');
  article.className = 'voice-assistant-item w-clearfix';
  article.dataset.audio = track.audio;

  const title = translate(track.title);
  const name = translate(track.name);
  const author = translate(track.author);
  const lyrics = translate(track.lyrics);

  const trackId = (title || '').replace(/ /g, '');

  article.setAttribute('aria-label', `Track: ${title || ''}`);

  article.innerHTML = `
    <div class="voice-assistant-item-button">
      <button class="play-button" aria-label="Play ${title || ''}" onclick="safeGtagEvent('event', 'content', { 'content_type': 'listen', 'content_id': '${trackId}', 'conversion': 'yes' }); safeGtagReportConversionContent();"></button>
    </div>
    <div class="voice-assistant-item-text">
      <h3 class="title-track">${title}</h3>
      <p class="name-track">${name}</p>
      <div class="audio-controls">
        <div class="timeline-grab-area" role="slider" aria-label="Audio timeline" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="audio-controls-bar">
            <div class="audio-controls-bar-current"></div>
          </div>
        </div>
        <div class="voice-assistant-item-text-wrap">
          <button class="flex-center tab-item" aria-label="Toggle lyrics" onclick="safeGtagEvent('event', 'content', { 'content_type': 'texts', 'content_id': '${trackId}', 'conversion': 'yes' }); safeGtagReportConversionContent();">
            <div class="list-decor"></div>
            <p class="text-3 gray text-show">${translate(generalInfo.footer.lyricsButtons.show)}</p>
            <p class="text-3 text-hidden">${translate(generalInfo.footer.lyricsButtons.hide)}</p>
          </button>
          <time class="audio-controls-time text-3">0:00</time>
        </div>
        <div class="tab-content text-3">
          <p><strong>${author || ''}</strong></p>
          <pre>${lyrics || ''}</pre>
        </div>
        <div class="text-track">
          <p class="text-2">Sample</p>
        </div>
      </div>
    </div>
  `;

  return article;
}
