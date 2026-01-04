/**
 * SEO Configuration File
 * =====================
 * 
 * This file contains ALL search engine and analytics configuration.
 * Managers can easily update this file to change what search engines see.
 * 
 * IMPORTANT: After making changes, clear browser cache and test!
 */

export const seoConfig = {
  // ============================================
  // GOOGLE ANALYTICS & SEARCH CONSOLE
  // ============================================
  google: {
    // Google Analytics 4 (GA4) Measurement ID
    // Get this from: https://analytics.google.com/
    analyticsId: 'G-PGFWWX9CHN',
    
    // Google Ads Conversion ID (optional)
    // Get this from: https://ads.google.com/
    adsId: 'AW-11151945413',
    
    // Google Ads Conversion Labels
    // These track specific conversion events
    conversionLabels: {
      content: 'McszCPuL1a4YEMXd1MUp',  // Content engagement conversion
      external: 'jXsNCP6L1a4YEMXd1MUp'   // External link conversion
    },
    
    // Google Search Console Verification
    // Add your verification meta tag content here
    // Get this from: https://search.google.com/search-console
    searchConsoleVerification: '', // Example: 'abc123def456...'
    
    // Google Tag Manager Container ID (optional)
    // If you use GTM instead of direct GA, add it here
    tagManagerId: '' // Example: 'GTM-XXXXXXX'
  },

  // ============================================
  // YANDEX METRIKA
  // ============================================
  yandex: {
    // Yandex Metrika Counter ID
    // Get this from: https://metrika.yandex.ru/
    metrikaId: 93604819,
    
    // Yandex Webmaster Verification
    // Add your verification meta tag content here
    // Get this from: https://webmaster.yandex.ru/
    webmasterVerification: '' // Example: 'abc123def456...'
  },

  // ============================================
  // SITE METADATA (What search engines see)
  // ============================================
  site: {
    // Main site URL (used for canonical, OG tags, etc.)
    baseUrl: 'https://gruppanate.com',
    
    // Site name (appears in search results)
    name: {
      ru: 'Святослав Задерий и Группа НАТЕ!',
      en: 'Sviatoslav Zaderyi and Band NATE!'
    },
    
    // Default language
    defaultLanguage: 'ru',
    
    // Supported languages
    languages: ['ru', 'en'],
    
    // Site description (appears in search results)
    description: {
      ru: 'Святослав Задерий и Группа НАТЕ! - Музыка для взрослых - Официальный сайт. Легендарная ленинградская рок-группа, основанная в 1987 году.',
      en: 'Sviatoslav Zaderyi and Band NATE! - Music for adults - Official website. Legendary Leningrad rock band founded in 1987.'
    },
    
    // Keywords (less important for SEO now, but still used)
    keywords: {
      ru: 'Святослав Задерий, Группа НАТЕ!, рок-группа, музыка, ленинградский рок, русский рок, советский рок, альбом Музыка для взрослых',
      en: 'Sviatoslav Zaderyi, Band NATE!, rock band, music, Leningrad rock, Russian rock, Soviet rock, Music for adults album'
    },
    
    // Open Graph default image (for social media sharing)
    ogImage: 'https://gruppanate.com/img/og.webp',
    
    // Site author/organization
    author: {
      name: 'Группа НАТЕ!',
      alternateName: 'Band NATE!'
    },
    
    // Contact information (for structured data)
    contact: {
      email: 'gruppanate@gmail.com',
      phone: '+917822054627'
    },
    
    // Social media profiles (for structured data)
    social: {
      spotify: 'https://open.spotify.com/artist/1CHvDyvTP45UHjjAPnpvCV',
      yandex: 'https://music.yandex.ru/artist/15977367/',
      youtube: 'https://www.youtube.com/@gruppanate',
      twitter: 'https://twitter.com/SZaderiy',
      instagram: 'https://www.instagram.com/gruppanate/'
    }
  },

  // ============================================
  // STRUCTURED DATA (Schema.org)
  // ============================================
  structuredData: {
    // Music Group information
    musicGroup: {
      name: 'Группа НАТЕ!',
      alternateName: 'Group NATE!',
      foundingDate: '1987',
      foundingLocation: {
        name: 'Ленинград',
        alternateName: 'Leningrad, Saint Petersburg',
        address: {
          locality: 'Ленинград',
          region: 'Ленинградская область',
          country: 'СССР'
        }
      },
      genre: ['Русский рок', 'Ленинградский рок', 'Russian Rock', 'Leningrad Rock', 'Советский рок'],
      description: {
        ru: 'Святослав Задерий и Группа НАТЕ! - Музыка для взрослых - Официальный сайт. Легендарная ленинградская рок-группа, основанная в 1987 году. Альбомы: Не бойся (1987), Этология (1989), Музыка для взрослых (2023).',
        en: 'Sviatoslav Zaderyi and Band NATE! - Music for adults - Official website. Legendary Leningrad rock band founded in 1987. Albums: Don\'t be afraid (1987), Ethology (1989), Music for adults (2023).'
      }
    },
    
    // Founder/Person information
    founder: {
      name: 'Святослав Задерий',
      alternateName: 'Svyatoslav Zaderiy',
      birthDate: '1955',
      deathDate: '2013',
      birthPlace: 'Ленинград',
      jobTitle: {
        ru: 'Музыкант, Основатель групп АЛИСА и НАТЕ!',
        en: 'Musician, Founder of bands ALISA and NATE!'
      },
      description: {
        ru: 'Основатель групп Алиса и НАТЕ!, стоял у истоков ленинградского рока',
        en: 'Founder of bands Alisa and NATE!, stood at the origins of Leningrad rock'
      }
    },
    
    // Albums information
    albums: [
      {
        name: 'Музыка для взрослых',
        alternateName: 'Music for adults',
        datePublished: '2023-01-01',
        description: {
          ru: 'Концептуальный альбом, герменевтическое исследование советского и русского рока. Памятник Святославу Задерию, записанный с участием более 50 музыкантов из различных известных рок-групп: Алиса, Аквариум, Кино, ДДТ, Аукцыон, Странные Игры и других.',
          en: 'Conceptual album, hermeneutic study of Soviet and Russian rock. A monument to Svyatoslav Zaderiy, recorded with the participation of more than 50 musicians from various famous rock bands: Alisa, Aquarium, Kino, DDT, Auktyon, Strannye Igry and others.'
        },
        numberOfTracks: 13
      },
      {
        name: 'Не бойся',
        alternateName: 'Don\'t be afraid',
        datePublished: '1987',
        description: {
          ru: 'Легендарный альбом Группы НАТЕ!',
          en: 'Legendary album by Band NATE!'
        }
      },
      {
        name: 'Этология',
        alternateName: 'Ethology',
        datePublished: '1989',
        description: {
          ru: 'Альбом Группы НАТЕ!',
          en: 'Album by Band NATE!'
        }
      }
    ]
  },

  // ============================================
  // AI SEARCH OPTIMIZATION
  // ============================================
  aiSearch: {
    // Enable FAQ schema for AI search engines
    enableFAQ: true,
    
    // Enable enhanced descriptions for AI
    enableEnhancedDescriptions: true,
    
    // Keywords that AI search engines should understand
    aiKeywords: {
      ru: [
        'Святослав Задерий',
        'Группа НАТЕ',
        'ленинградский рок',
        'русский рок 80-х',
        'советский рок',
        'альбом Музыка для взрослых',
        'рок-группа Ленинград',
        'Константин Кинчев',
        'группа Алиса'
      ],
      en: [
        'Svyatoslav Zaderiy',
        'Band NATE',
        'Leningrad rock',
        'Russian rock 80s',
        'Soviet rock',
        'Music for adults album',
        'Leningrad rock band',
        'Konstantin Kinchev',
        'Alisa band'
      ]
    }
  },

  // ============================================
  // ROBOTS & CRAWLING
  // ============================================
  robots: {
    // Allow all search engines to crawl
    allowAll: true,
    
    // Disallow specific paths (relative to site root)
    disallow: [
      '/js/',
      '/fonts/',
      '/css/',
      '/mus/'
    ],
    
    // Sitemap location
    sitemap: 'https://gruppanate.com/sitemap.xml'
  }
};

/**
 * Helper function to get current language SEO data
 * @param {string} lang - Language code ('ru' or 'en')
 * @returns {Object} SEO data for the specified language
 */
export function getSeoDataForLanguage(lang = 'ru') {
  return {
    title: `${seoConfig.site.name[lang]} - ${seoConfig.site.description[lang].split('.')[0]}`,
    description: seoConfig.site.description[lang],
    keywords: seoConfig.site.keywords[lang],
    ogTitle: seoConfig.site.name[lang],
    ogDescription: seoConfig.site.description[lang]
  };
}


