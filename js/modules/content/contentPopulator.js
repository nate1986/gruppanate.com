import { debug, debugError, debugWarn } from '../utils/debug.js';
import { translate, getCurrentLanguage } from '../utils/language.js';
import { createTrackElement } from '../ui/trackElement.js';
import { createLinkButton } from '../ui/linkButton.js';

/**
 * Populates head metadata
 * @param {Object} generalInfo - General site information
 */
export function populateHead(generalInfo) {
  // Set title
  try {
    document.getElementById('site-title').innerText = translate(generalInfo.head.title);
    debug('init', 'Title set:', generalInfo.head.title);
  } catch (e) {
    debugError('init', 'Error setting title:', e);
  }

  // Set meta description
  try {
    document.getElementById('meta-description').content = translate(generalInfo.head.meta.description);
    debug('init', 'Meta description set');
  } catch (e) {
    debugError('init', 'Error setting meta description:', e);
  }

  // Set meta keywords
  try {
    document.getElementById('meta-keywords').content = translate(generalInfo.head.meta.keywords);
    debug('init', 'Meta keywords set');
  } catch (e) {
    debugError('init', 'Error setting meta keywords:', e);
  }

  // Set OG image
  try {
    document.getElementById('og-image').content = generalInfo.head.meta.ogImage;
    debug('init', 'OG image set');
  } catch (e) {
    debugError('init', 'Error setting OG image:', e);
  }

  // Set OG URL
  try {
    document.getElementById('og-url').content = generalInfo.head.meta.ogUrl;
    debug('init', 'OG URL set');
  } catch (e) {
    debugError('init', 'Error setting OG URL:', e);
  }

  // Set canonical
  try {
    document.getElementById('canonical').href = generalInfo.head.meta.canonical;
    debug('init', 'Canonical set');
  } catch (e) {
    debugError('init', 'Error setting canonical:', e);
  }

  // Set favicon
  try {
    document.getElementById('favicon').href = generalInfo.head.favicon;
    debug('init', 'Favicon set');
  } catch (e) {
    debugError('init', 'Error setting favicon:', e);
  }

  // Add styles
  generalInfo.head.styles.forEach(style => {
    try {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      if (style.type) link.type = style.type;
      link.href = style.href;
      document.head.appendChild(link);
      debug('init', 'Style added:', style.href);
    } catch (e) {
      debugError('init', 'Error adding style:', e);
    }
  });

  // Note: Analytics (Google Analytics, Yandex Metrika) are now loaded via analyticsLoader.js
  // This is initialized in main.js before contentPopulator runs
  // Configuration is in js/modules/data/seoConfig.js
  debug('init', 'Analytics are loaded separately via analyticsLoader.js');
}

/**
 * Populates hero logo
 * @param {Object} generalInfo - General site information
 */
export function populateHeroLogo(generalInfo) {
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
          debug('init', 'Hero logo SVG set');
        })
        .catch(error => debugError('init', `Error loading Hero logo SVG for ${lang} from ${svgPath}:`, error));
    } else {
      debugError('init', 'Element #hero-logo not found!');
    }
  } catch (e) {
    debugError('init', 'Error setting hero logo:', e);
  }
}

/**
 * Populates text blocks
 * @param {Object} generalInfo - General site information
 */
export function populateTextBlocks(generalInfo) {
  // Populate left text block
  try {
    document.getElementById('text-block-left').innerHTML = `<p class="text">${translate(generalInfo.textBlock2)}</p>`;
    debug('init', 'Left text block populated');
  } catch (e) {
    debugError('init', 'Error populating text-block-left:', e);
  }

  // Populate right text block
  try {
    document.getElementById('text-block-right').innerHTML = `<p class="text">${translate(generalInfo.textBlock1)}</p>`;
    debug('init', 'Right text block populated');
  } catch (e) {
    debugError('init', 'Error populating text-block-right:', e);
  }

  // Populate album intro text block
  try {
    const textBlockIntro = document.getElementById('text-block-albumintro');
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

  // Populate album info text block
  try {
    const textBlockInfo = document.getElementById('text-block-albuminfo');
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
}

/**
 * Populates slider
 * @param {Object} generalInfo - General site information
 */
export function populateSlider(generalInfo) {
  try {
    const sliderContent = document.getElementById('slider-content');
    debug('init', 'Slider container found:', !!sliderContent);
    if (sliderContent && generalInfo.sliderItems && Array.isArray(generalInfo.sliderItems)) {
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
        debug('init', `Slider item ${index + 1} added`);
      });
      debug('init', 'All slider items added');
    } else {
      debugError('init', 'Slider content or generalInfo.sliderItems not found or not an array!');
    }
  } catch (e) {
    debugError('init', 'Error populating slider:', e);
  }
}

/**
 * Initializes slick slider
 */
export function initSlider() {
  try {
    // Check if slider is already initialized to avoid duplicates
    if (!$(".slick-slider").hasClass('slick-initialized')) {
      const $slider = $(".slick-slider");
      if ($slider.length > 0 && typeof $slider.slick === 'function') {
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
        debug('init', 'Slick slider initialized successfully on page load');
      } else {
        debugError('init', 'Slick slider element not ready during initial load');
        // Retry initialization after a short delay
        setTimeout(() => {
          try {
            if (typeof $(".slick-slider").slick === 'function') {
              $(".slick-slider").slick({
                slidesToShow: 1.2,
                infinite: false,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 1600,
                dots: false,
                arrows: false,
              });
              debug('init', 'Slick slider initialized on retry');
            }
          } catch (retryError) {
            debugError('init', 'Slick slider initialization retry failed:', retryError);
          }
        }, 500);
      }
    } else {
      debug('init', 'Slick slider already initialized, skipping');
    }
  } catch (e) {
    debugError('init', 'Error during initial slick slider setup:', e);
  }
}

/**
 * Populates footer
 * @param {Object} generalInfo - General site information
 */
export async function populateFooter(generalInfo) {
  // Populate footer title
  try {
    const footerTitle = document.getElementById('footer-title');
    if (footerTitle && generalInfo && generalInfo.footer && generalInfo.footer.titleSvg) {
      const lang = getCurrentLanguage();
      const svgFile = translate(generalInfo.footer.titleSvg).file;
      fetch(svgFile)
        .then(response => response.text())
        .then(svgText => {
          footerTitle.innerHTML = svgText;
          debug('init', 'Footer title SVG loaded on initial page load');
        })
        .catch(error => debugError('init', `Error loading footer SVG on initial page load for ${lang}:`, error));
      debug('init', 'Footer title set');
    }
  } catch (e) {
    debugError('init', 'Error setting footer title:', e);
  }

  // Populate footer buttons
  try {
    const footerButtons = document.getElementById('footer-buttons');
    if (footerButtons && generalInfo.footer.buttons && Array.isArray(generalInfo.footer.buttons)) {
      footerButtons.innerHTML = '';
      for (const [index, buttonData] of generalInfo.footer.buttons.entries()) {
        const linkElement = await createLinkButton(buttonData);
        footerButtons.appendChild(linkElement);
        debug('init', `Footer button ${index + 1} added`);
      }
      debug('init', 'All footer buttons added');
    } else {
      debugError('init', 'Element #footer-buttons not found or generalInfo.footer.buttons is not an array!');
    }
  } catch (e) {
    debugError('init', 'Error populating footer buttons:', e);
  }

  // Populate footer email
  try {
    const footerEmail = document.getElementById('footer-email');
    if (footerEmail) {
      const emailText = generalInfo.footer.email;
      footerEmail.innerText = emailText;
      footerEmail.href = `mailto:${emailText}`;
      debug('init', 'Footer email set');
    }
  } catch (e) {
    debugError('init', 'Error setting footer email:', e);
  }

  // Populate footer phone
  try {
    const footerPhone = document.getElementById('footer-phone');
    if (footerPhone) {
      const phoneText = generalInfo.footer.phone;
      footerPhone.innerText = phoneText;
      footerPhone.href = `tel:${phoneText}`;
      debug('init', 'Footer phone set');
    }
  } catch (e) {
    debugError('init', 'Error setting footer phone:', e);
  }
}

/**
 * Populates navigation buttons
 * @param {Object} content - Content data
 */
export function populateNavButtons(content) {
  try {
    const navButtons = [
      {id: 'nav-current-desktop', text: content.nav.current},
      {id: 'nav-current-mobile', text: content.nav.current},
      {id: 'nav-archive-desktop', text: content.nav.archive},
      {id: 'nav-archive-mobile', text: content.nav.archive},
      {id: 'nav-remasters-desktop', text: content.nav.remasters},
      {id: 'nav-remasters-mobile', text: content.nav.remasters}
    ];
    
    navButtons.forEach(({id, text}) => {
      const button = document.getElementById(id);
      if (button) {
        button.innerText = translate(text);
      }
    });
    debug('init', 'Navigation buttons translated during initial load');
  } catch (e) {
    debugError('init', 'Error translating navigation buttons during initial load:', e);
  }
}

/**
 * Populates album section
 * @param {string} albumId - Album ID
 * @param {Object} albumData - Album data
 */
export async function populateAlbum(albumId, albumData) {
  // Set album title
  try {
    const albumTitle = document.getElementById(`${albumId}-album`);
    if (albumTitle) {
      if (Array.isArray(translate(albumData.title))) {
        albumTitle.innerHTML = '';
        translate(albumData.title).forEach(paragraph => {
          const p = document.createElement('p');
          p.className = 'text';
          p.innerHTML = paragraph;
          albumTitle.appendChild(p);
        });
      } else {
        albumTitle.innerText = translate(albumData.title);
      }
      debug('init', `${albumId} title set`);
    } else {
      debugError('init', `Element #${albumId}-album not found!`);
    }
  } catch (e) {
    debugError('init', `Error setting ${albumId} title:`, e);
  }

  // Populate slogan SVG if it exists
  if (albumData.sloganSvg) {
    try {
      const sloganSvg = document.getElementById(`${albumId}-sloganSvg`);
      if (sloganSvg) {
        const lang = getCurrentLanguage();
        const svgPath = translate(albumData.sloganSvg);
        fetch(svgPath)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
          })
          .then(svgText => {
            sloganSvg.innerHTML = svgText;
            debug('init', `${albumId} slogan SVG set`);
          })
          .catch(error => debugError('init', `Error loading ${albumId} slogan SVG for ${lang} from ${svgPath}:`, error));
      } else {
        debugError('init', `Element #${albumId}-sloganSvg not found!`);
      }
    } catch (e) {
      debugError('init', `Error setting ${albumId} slogan SVG:`, e);
    }
  }

  // Populate tracks
  try {
    const playlistItems = document.getElementById(`${albumId}-items`);
    if (playlistItems) {
      // Prevent duplicate population if the script somehow runs twice
      if (playlistItems.dataset.populated === 'true') {
        debugWarn('init', `${albumId} playlist already populated – skipping duplicate run`);
      } else {
        debug('init', `Found ${albumId}-items, populating tracks...`);
        const lang = getCurrentLanguage();
        albumData.tracks.forEach((track, index) => {
          const trackElement = createTrackElement(track, lang, albumId);
          playlistItems.appendChild(trackElement);
          debug('init', `Track ${index + 1} added to playlist`);
        });
        playlistItems.dataset.populated = 'true';
        debug('init', 'All tracks added to playlist');
      }
    } else {
      debugError('init', `Element #${albumId}-items not found!`);
    }
  } catch (e) {
    debugError('init', `Error populating ${albumId} playlist:`, e);
  }

  // Populate links if they exist
  if (albumData.links) {
    try {
      const albumLinks = document.getElementById(`${albumId}-links`);
      if (albumLinks) {
        for (const link of albumData.links) {
          const linkElement = await createLinkButton(link);
          if (linkElement instanceof Node) {
            albumLinks.appendChild(linkElement);
            debug('init', `${albumId} link ${albumData.links.indexOf(link) + 1} added`);
          } else {
            debugError('init', `Invalid linkElement for ${albumId} link ${albumData.links.indexOf(link) + 1}:`, linkElement);
          }
        }
        debug('init', `All ${albumId} links added`);
      } else {
        debugError('init', `Element #${albumId}-links not found!`);
      }
    } catch (e) {
      debugError('init', `Error populating ${albumId} links:`, e);
    }
  }
}

/**
 * Populates about page content
 * @param {Object} aboutData - About page data
 */
export function populateAbout(aboutData) {
  // Populate press release content
  try {
    const pressReleaseContainer = document.getElementById('press-release-content');
    if (pressReleaseContainer) {
      pressReleaseContainer.innerHTML = '';
      
      // Intro paragraphs
      aboutData.pressRelease.intro.forEach(paragraph => {
        const p = document.createElement('p');
        p.className = 'text';
        p.innerHTML = translate(paragraph);
        pressReleaseContainer.appendChild(p);
      });
      
      // Side A
      const sideATitle = document.createElement('p');
      sideATitle.className = 'text';
      sideATitle.innerHTML = translate(aboutData.pressRelease.sideA.title);
      pressReleaseContainer.appendChild(sideATitle);
      
      aboutData.pressRelease.sideA.tracks.forEach(track => {
        // Only add the text, title is already included in the text
        const trackText = document.createElement('p');
        trackText.className = 'text';
        trackText.innerHTML = translate(track.text);
        pressReleaseContainer.appendChild(trackText);
      });
      
      // Side B
      const sideBTitle = document.createElement('p');
      sideBTitle.className = 'text';
      sideBTitle.innerHTML = translate(aboutData.pressRelease.sideB.title);
      pressReleaseContainer.appendChild(sideBTitle);
      
      aboutData.pressRelease.sideB.tracks.forEach(track => {
        // Only add the text, title is already included in the text
        const trackText = document.createElement('p');
        trackText.className = 'text';
        trackText.innerHTML = translate(track.text);
        pressReleaseContainer.appendChild(trackText);
      });
      
      debug('init', 'Press release content populated');
    }
  } catch (e) {
    debugError('init', 'Error populating press release content:', e);
  }
  
  // Populate team section
  try {
    const teamContainer = document.getElementById('team-content');
    if (teamContainer) {
      teamContainer.innerHTML = '';
      
      // Project team
      const projectTeamTitle = document.createElement('p');
      projectTeamTitle.className = 'text';
      projectTeamTitle.textContent = translate(aboutData.team.projectTeam.title);
      teamContainer.appendChild(projectTeamTitle);
      
      const projectTeamList = document.createElement('p');
      projectTeamList.className = 'text';
      const teamMembers = aboutData.team.projectTeam.members.map(member => 
        `<b>${member.name}</b> - ${translate(member.role)}`
      ).join('<br>');
      projectTeamList.innerHTML = teamMembers;
      teamContainer.appendChild(projectTeamList);
      
      // Musicians
      const musicianSections = [
        aboutData.team.musicians.drummers,
        aboutData.team.musicians.bassists,
        aboutData.team.musicians.guitarists,
        aboutData.team.musicians.keyboardists,
        aboutData.team.musicians.saxophone,
        aboutData.team.musicians.mandolin,
        aboutData.team.musicians.percussion,
        aboutData.team.musicians.session,
        aboutData.team.musicians.vocalists
      ];
      
      musicianSections.forEach(section => {
        const sectionTitle = document.createElement('p');
        sectionTitle.className = 'text';
        sectionTitle.textContent = translate(section.title);
        teamContainer.appendChild(sectionTitle);
        
        const sectionList = document.createElement('p');
        sectionList.className = 'text';
        const members = section.members.map(member => {
          if (member.bands) {
            return `<b>${member.name}</b> - ${member.bands}`;
          } else if (member.instrument) {
            return `<b>${member.name}</b> - ${translate(member.instrument)}`;
          } else {
            return `<b>${member.name}</b>`;
          }
        }).join('<br>');
        sectionList.innerHTML = members;
        teamContainer.appendChild(sectionList);
      });
      
      debug('init', 'Team content populated');
    }
  } catch (e) {
    debugError('init', 'Error populating team content:', e);
  }
  
  // Populate navigation button
  try {
    const homeButton = document.getElementById('home-button');
    if (homeButton) {
      homeButton.textContent = translate(aboutData.navigation.homeButton);
      debug('init', 'Home button populated');
    }
  } catch (e) {
    debugError('init', 'Error populating home button:', e);
  }
}
