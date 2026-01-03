import { debug, debugError, debugWarn } from './debug.js';
import { getCurrentLanguage, translate } from './language.js';
import { bindTabFunctionality } from '../ui/tabFunctionality.js';
import { createTrackElement } from '../ui/trackElement.js';
import { createLinkButton } from '../ui/linkButton.js';

/**
 * Refreshes content when language is switched
 * @param {Object} generalInfo - General site information
 * @param {Object} neboysyaAlbum - Neboysya album data
 * @param {Object} etologiaAlbum - Etologia album data
 * @param {Object} adu1Album - ADU1 album data
 * @param {Object} adu2Album - ADU2 album data
 * @param {Function} playerInit - Function to initialize player
 */
export async function refreshContent(generalInfo, neboysyaAlbum, etologiaAlbum, adu1Album, adu2Album, playerInit) {
  debug('init', 'Refreshing content for language update');
  
  // Stop all audio playback before refreshing content
  try {
    // Pause any currently playing audio
    const allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        debug('init', 'Paused audio during language switch');
      }
    });
    
    // Reset play buttons to non-playing state
    document.querySelectorAll('.play-button.playing').forEach(button => {
      button.classList.remove('playing');
    });
    
    // Reset audio controls UI
    document.querySelectorAll('.audio-controls-bar-current').forEach(bar => {
      bar.style.width = '0%';
    });
    
    document.querySelectorAll('.audio-controls-time').forEach(time => {
      time.textContent = '0:00';
    });
    
    // We can't directly access player.cleanup since it's not a global variable
    // Instead, we'll create a custom event that the player can listen for
    const cleanupEvent = new CustomEvent('audioCleanupRequired');
    window.dispatchEvent(cleanupEvent);
    debug('init', 'Dispatched audio cleanup event during language switch');
  } catch (e) {
    debugError('init', 'Error stopping audio during language switch:', e);
  }
  
  // Re-populate head
  try {
    document.getElementById('site-title').innerText = translate(generalInfo.head.title);
    debug('init', 'Title set:', generalInfo.head.title);
  } catch (e) {
    debugError('init', 'Error setting title:', e);
  }
  
  try {
    document.getElementById('meta-description').content = translate(generalInfo.head.meta.description);
    debug('init', 'Meta description set');
  } catch (e) {
    debugError('init', 'Error setting meta description:', e);
  }
  
  try {
    document.getElementById('meta-keywords').content = translate(generalInfo.head.meta.keywords);
    debug('init', 'Meta keywords set');
  } catch (e) {
    debugError('init', 'Error setting meta keywords:', e);
  }
  
  try {
    document.getElementById('og-image').content = generalInfo.head.meta.ogImage;
    debug('init', 'OG image set');
  } catch (e) {
    debugError('init', 'Error setting OG image:', e);
  }
  
  try {
    document.getElementById('og-url').content = generalInfo.head.meta.ogUrl;
    debug('init', 'OG URL set');
  } catch (e) {
    debugError('init', 'Error setting OG URL:', e);
  }
  
  try {
    document.getElementById('canonical').href = generalInfo.head.meta.canonical;
    debug('init', 'Canonical set');
  } catch (e) {
    debugError('init', 'Error setting canonical:', e);
  }
  
  try {
    document.getElementById('favicon').href = generalInfo.head.favicon;
    debug('init', 'Favicon set');
  } catch (e) {
    debugError('init', 'Error setting favicon:', e);
  }
  
  // Re-populate hero logo
  try {
    const heroLogo = document.getElementById('hero-logo');
    if (heroLogo) {
      const lang = getCurrentLanguage();
      const svgPath = translate(generalInfo.logo);
      fetch(svgPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(svgText => {
          heroLogo.innerHTML = svgText;
          debug('init', 'Hero logo SVG refreshed');
        })
        .catch(error => debugError('init', `Error loading Hero logo SVG for ${lang} from ${svgPath}:`, error));
    } else {
      debugError('init', 'Element #hero-logo not found during refresh!');
    }
  } catch (e) {
    debugError('init', 'Error setting hero logo during refresh:', e);
  }
  
  // Re-populate text blocks
  try {
    document.getElementById('text-block-left').innerHTML = `<p class="text">${translate(generalInfo.textBlock2)}</p>`;
    debug('init', 'Left text block populated');
  } catch (e) {
    debugError('init', 'Error populating text-block-left:', e);
  }
  
  try {
    document.getElementById('text-block-right').innerHTML = `<p class="text">${translate(generalInfo.textBlock1)}</p>`;
    debug('init', 'Right text block populated');
  } catch (e) {
    debugError('init', 'Error populating text-block-right:', e);
  }
  
  try {
    const textBlockIntro = document.getElementById('text-block-albumintro');
    textBlockIntro.innerHTML = '';
    translate(generalInfo.textAlbumIntro).forEach(paragraph => {
      const p = document.createElement('p');
      p.className = 'text';
      p.innerHTML = paragraph;
      textBlockIntro.appendChild(p);
    });
    debug('init', 'Central albumintro text block populated');
  } catch (e) {
    debugError('init', 'Error populating text-block-albumintro:', e);
  }
  
  try {
    const textBlockInfo = document.getElementById('text-block-albuminfo');
    textBlockInfo.innerHTML = '';
    translate(generalInfo.textAlbumInfo).forEach(paragraph => {
      const p = document.createElement('p');
      p.className = 'text';
      p.innerHTML = paragraph;
      textBlockInfo.appendChild(p);
    });
    debug('init', 'Central albuminfo text block populated');
  } catch (e) {
    debugError('init', 'Error populating text-block-albuminfo:', e);
  }
  
  // Re-populate slider with null check - SIMPLIFIED APPROACH
  try {
    const sliderContent = document.getElementById('slider-content');
    if (sliderContent && generalInfo && generalInfo.sliderItems && Array.isArray(generalInfo.sliderItems)) {
      debug('init', 'Updating slider content for language change...');
      
      // Find existing slider elements and update their content
      const existingElements = sliderContent.querySelectorAll('.element');
      if (existingElements.length === generalInfo.sliderItems.length) {
        // Update existing elements instead of recreating
        generalInfo.sliderItems.forEach((item, index) => {
          if (existingElements[index]) {
            const textElement = existingElements[index].querySelector('.text-2');
            const titleElement = existingElements[index].querySelector('.text.text-24');
            
            if (textElement) {
              textElement.innerHTML = translate(item.text);
            }
            if (titleElement) {
              titleElement.innerHTML = translate(item.title);
            }
            debug('init', `Updated slider item ${index + 1}: ${translate(item.title)}`);
          }
        });
        debug('init', 'Slider content updated without reinitialization');
        
        // Just refresh the existing slider
        setTimeout(() => {
          try {
            if (typeof $(".slick-slider").slick === 'function') {
              $(".slick-slider").slick('setOption', {
                slidesToShow: 1.2,
                infinite: false,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 1600,
                dots: false,
                arrows: false,
              }, true);
              debug('init', 'Slick slider refreshed with new content');
            }
          } catch (refreshError) {
            debugError('init', 'Error refreshing slick slider:', refreshError);
          }
        }, 100);
      } else {
        // If element count doesn't match, do full recreation (fallback)
        debug('init', 'Element count mismatch, doing full slider recreation...');
        
        if (typeof $(".slick-slider").slick === 'function') {
          try {
            $(".slick-slider").slick('unslick');
            debug('init', 'Slick slider destroyed for full recreation');
          } catch (destroyError) {
            debugWarn('init', 'Could not destroy slider, continuing...');
          }
        }
        
        sliderContent.innerHTML = '';
        generalInfo.sliderItems.forEach((item, index) => {
          const element = document.createElement('div');
          element.className = 'element';
          element.innerHTML = `
            <div class="img-overlay">
              <picture>
                <source srcset="${item.image}" type="image/webp">
                <img src="${item.image.replace('.webp', '.png')}" alt="${item.alt || ''}" loading="lazy">
              </picture>
            </div>
            <div class="slider-info">
              <p class="text-2">${translate(item.text)}</p>
              <p class="text text-24">${translate(item.title)}</p>
              <div class="start-year">${item.year}</div>
            </div>
          `;
          sliderContent.appendChild(element);
          debug('init', `Recreated slider item ${index + 1}: ${translate(item.title)}`);
        });
        
        // Reinitialize with longer delay
        setTimeout(() => {
          try {
            const $slider = $(".slick-slider");
            if ($slider.length > 0) {
              $slider.slick({
                slidesToShow: 1.2,
                infinite: false,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 1600,
                dots: false,
                arrows: false,
                responsive: [
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 1.1,
                    }
                  },
                ]
              });
              debug('init', 'Slick slider fully reinitialized after recreation');
            } else {
              debugError('init', 'Slick slider container not found after recreation');
            }
          } catch (initError) {
            debugError('init', 'Error fully reinitializing slick slider:', initError);
          }
        }, 500);
      }
    } else {
      debugError('init', 'Slider data not available during language refresh');
    }
  } catch (e) {
    debugError('init', 'Error during slider language update:', e);
  }
  
  // Re-apply translations to navigation buttons using IDs
  try {
    const navButtons = [
      {id: 'nav-current-desktop', text: generalInfo.footer.navButtons.current},
      {id: 'nav-current-mobile', text: generalInfo.footer.navButtons.current},
      {id: 'nav-archive-desktop', text: generalInfo.footer.navButtons.archive},
      {id: 'nav-archive-mobile', text: generalInfo.footer.navButtons.archive},
      {id: 'nav-remasters-desktop', text: generalInfo.footer.navButtons.remasters},
      {id: 'nav-remasters-mobile', text: generalInfo.footer.navButtons.remasters}
    ];
    
    navButtons.forEach(({id, text}) => {
      const button = document.getElementById(id);
      if (button) {
        button.innerText = translate(text);
      }
    });
    debug('init', 'Navigation buttons translated');
  } catch (e) {
    debugError('init', 'Error translating navigation buttons:', e);
  }
  
  // Re-populate footer with null checks
  try {
    const footerTitle = document.getElementById('footer-title');
    if (footerTitle && generalInfo && generalInfo.footer && generalInfo.footer.titleSvg) {
      const lang = getCurrentLanguage();
      const svgFile = translate(generalInfo.footer.titleSvg).file; // Get the SVG file path
      fetch(svgFile)
        .then(response => response.text())
        .then(svgText => {
          footerTitle.innerHTML = svgText;
          debug('init', 'Footer title SVG refreshed');
        })
        .catch(error => debugError('init', `Error loading footer SVG for ${lang}:`, error));
      debug('init', 'Footer title set');
    }
  } catch (e) {
    debugError('init', 'Error setting footer title:', e);
  }
  
  try {
    const footerButtons = document.getElementById('footer-buttons');
    if (footerButtons && generalInfo && generalInfo.footer && generalInfo.footer.buttons && Array.isArray(generalInfo.footer.buttons)) {
      footerButtons.innerHTML = '';
      for (const [index, buttonData] of generalInfo.footer.buttons.entries()) {
        const linkElement = await createLinkButton(buttonData);
        if (linkElement instanceof Node) { // Ensure it's a valid DOM Node
          footerButtons.appendChild(linkElement);
          debug('init', `Footer button ${index + 1} added`);
        } else {
          debugError('init', `Invalid linkElement for footer button ${index + 1}:`, linkElement);
        }
      }
      debug('init', 'All footer buttons added');
    } else {
      debugError('init', 'Footer buttons element or data not available during refresh!');
    }
  } catch (e) {
    debugError('init', 'Error populating footer buttons:', e);
  }
  
  // Re-populate footer email and phone
  try {
    const footerEmail = document.getElementById('footer-email');
    if (footerEmail) {
      const emailText = generalInfo.footer.email;
      footerEmail.innerText = emailText;
      footerEmail.href = `mailto:${emailText}`;
      debug('init', 'Footer email set:', emailText);
    }
  } catch (e) {
    debugError('init', 'Error setting footer email:', e);
  }
  
  try {
    const footerPhone = document.getElementById('footer-phone');
    if (footerPhone) {
      const phoneText = generalInfo.footer.phone;
      footerPhone.innerText = phoneText;
      footerPhone.href = `tel:${phoneText}`;
      debug('init', 'Footer phone set:', phoneText);
    }
  } catch (e) {
    debugError('init', 'Error setting footer phone:', e);
  }
  
  // Update album titles if they exist
  try {
    if (typeof adu1Album !== 'undefined' && adu1Album.title) {
      const adu1Title = document.getElementById('adu1-album');
      if (adu1Title && Array.isArray(translate(adu1Album.title))) {
        adu1Title.innerHTML = '';
        translate(adu1Album.title).forEach(paragraph => {
          const p = document.createElement('p');
          p.className = 'text';
          p.innerHTML = paragraph;
          adu1Title.appendChild(p);
        });
      }
    }
    if (typeof adu2Album !== 'undefined' && adu2Album.title) {
      const adu2Title = document.getElementById('adu2-album');
      if (adu2Title && Array.isArray(translate(adu2Album.title))) {
        adu2Title.innerHTML = '';
        translate(adu2Album.title).forEach(paragraph => {
          const p = document.createElement('p');
          p.className = 'text';
          p.innerHTML = paragraph;
          adu2Title.appendChild(p);
        });
      }
    }
    if (typeof neboysyaAlbum !== 'undefined' && neboysyaAlbum.title) {
      const neboysyaTitle = document.getElementById('neboysya-album');
      if (neboysyaTitle) {
        neboysyaTitle.innerText = translate(neboysyaAlbum.title);
      }
    }
    if (typeof etologiaAlbum !== 'undefined' && etologiaAlbum.title) {
      const etologiaTitle = document.getElementById('etologia-album');
      if (etologiaTitle) {
        etologiaTitle.innerHTML = ''; // Clear existing content
        translate(etologiaAlbum.title).forEach(paragraph => {
          const p = document.createElement('p');
          p.className = 'text';
          p.innerHTML = paragraph;
          etologiaTitle.appendChild(p);
        });
      }
    }
    debug('init', 'Album titles updated');
  } catch (e) {
    debugError('init', 'Error updating album titles:', e);
  }

  // Re-populate adu1 tracks
  try {
    const adu1Items = document.getElementById('adu1-items');
    if (adu1Items && typeof adu1Album !== 'undefined' && adu1Album.tracks) {
      const lang = getCurrentLanguage();
      adu1Items.innerHTML = '';
      adu1Album.tracks.forEach((track) => {
        const trackElement = createTrackElement(track, lang);
        adu1Items.appendChild(trackElement);
      });
      adu1Items.dataset.populated = 'true';
      debug('init', 'adu1 tracks refreshed with translation');
    }
  } catch (e) {
    debugError('init', 'Error refreshing adu1 tracks:', e);
  }
  
  // Re-populate adu2 tracks
  try {
    const adu2Items = document.getElementById('adu2-items');
    if (adu2Items && typeof adu2Album !== 'undefined' && adu2Album.tracks) {
      const lang = getCurrentLanguage();
      adu2Items.innerHTML = '';
      adu2Album.tracks.forEach((track) => {
        const trackElement = createTrackElement(track, lang);
        adu2Items.appendChild(trackElement);
      });
      adu2Items.dataset.populated = 'true';
      debug('init', 'adu2 tracks refreshed with translation');
    }
  } catch (e) {
    debugError('init', 'Error refreshing adu2 tracks:', e);
  }

  // Re-populate neboysya tracks
  try {
    const neboysyaItems = document.getElementById('neboysya-items');
    if (neboysyaItems && typeof neboysyaAlbum !== 'undefined' && neboysyaAlbum.tracks) {
      const lang = getCurrentLanguage();
      neboysyaItems.innerHTML = '';
      neboysyaAlbum.tracks.forEach((track) => {
        const trackElement = createTrackElement(track, lang);
        neboysyaItems.appendChild(trackElement);
      });
      neboysyaItems.dataset.populated = 'true';
      debug('init', 'neboysya tracks refreshed with translation');
    }
  } catch (e) {
    debugError('init', 'Error refreshing neboysya tracks:', e);
  }

  // Re-populate etologia tracks
  try {
    const etologiaItems = document.getElementById('etologia-items');
    if (etologiaItems && typeof etologiaAlbum !== 'undefined' && etologiaAlbum.tracks) {
      const lang = getCurrentLanguage();
      etologiaItems.innerHTML = '';
      etologiaAlbum.tracks.forEach((track) => {
        const trackElement = createTrackElement(track, lang);
        etologiaItems.appendChild(trackElement);
      });
      etologiaItems.dataset.populated = 'true';
      debug('init', 'etologia tracks refreshed with translation');
    }
  } catch (e) {
    debugError('init', 'Error refreshing etologia tracks:', e);
  }
  
  // Re-bind tab functionality after ALL content is refreshed
  bindTabFunctionality();
  
  // Re-initialize audio player after content refresh
  try {
    debug('init', 'Re-initializing audio player after language switch');
    playerInit();
    debug('init', 'Audio player re-initialized successfully');
  } catch (e) {
    debugError('init', 'Error re-initializing audio player after language switch:', e);
  }

  // Re-populate neboysya and etologia slogan SVGs
  try {
    const neboysyaSloganSvg = document.getElementById('neboysya-sloganSvg');
    if (neboysyaSloganSvg) {
      const lang = getCurrentLanguage();
      const svgPath = translate(neboysyaAlbum.sloganSvg);
      fetch(svgPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(svgText => {
          neboysyaSloganSvg.innerHTML = svgText;
          debug('init', 'Neboysya slogan SVG refreshed');
        })
        .catch(error => debugError('init', `Error loading Neboysya slogan SVG for ${lang} from ${svgPath}:`, error));
    }
  } catch (e) {
    debugError('init', 'Error refreshing neboysya slogan SVG:', e);
  }
  
  try {
    const etologiaSloganSvg = document.getElementById('etologia-sloganSvg');
    if (etologiaSloganSvg) {
      const lang = getCurrentLanguage();
      const svgPath = translate(etologiaAlbum.sloganSvg);
      fetch(svgPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(svgText => {
          etologiaSloganSvg.innerHTML = svgText;
          debug('init', 'Etologia slogan SVG refreshed');
        })
        .catch(error => debugError('init', `Error loading etologia slogan SVG for ${lang} from ${svgPath}:`, error));
    } else {
      debugError('init', 'Element #etologia-sloganSvg not found!');
    }
  } catch (e) {
    debugError('init', 'Error setting etologia slogan SVG:', e);
  }
}
