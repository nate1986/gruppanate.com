/**
 * Structured Data Configuration
 * ============================
 * 
 * This file generates structured data (JSON-LD) from seoConfig.js
 * This makes it easy to keep structured data in sync with SEO config
 */

import { seoConfig } from './seoConfig.js';
import { generateAudioObjects } from '../utils/audioObjectSchema.js';

/**
 * Generate structured data from SEO config
 * This ensures consistency between SEO metadata and structured data
 */
export function generateStructuredDataFromConfig() {
  // Generate AudioObject schemas for tracks
  const audioObjects = generateAudioObjects();

  // Build structured data from config
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // Music Group
      {
        "@type": "MusicGroup",
        "@id": `${seoConfig.site.baseUrl}/#musicgroup`,
        "name": seoConfig.structuredData.musicGroup.name,
        "alternateName": seoConfig.structuredData.musicGroup.alternateName,
        "url": seoConfig.site.baseUrl,
        "image": seoConfig.site.ogImage,
        "description": seoConfig.structuredData.musicGroup.description.ru,
        "foundingDate": seoConfig.structuredData.musicGroup.foundingDate,
        "foundingLocation": {
          "@type": "Place",
          "name": seoConfig.structuredData.musicGroup.foundingLocation.name,
          "alternateName": seoConfig.structuredData.musicGroup.foundingLocation.alternateName,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": seoConfig.structuredData.musicGroup.foundingLocation.address.locality,
            "addressRegion": seoConfig.structuredData.musicGroup.foundingLocation.address.region,
            "addressCountry": seoConfig.structuredData.musicGroup.foundingLocation.address.country
          }
        },
        "genre": seoConfig.structuredData.musicGroup.genre,
        "knowsAbout": [
          "Советский рок",
          "Ленинградский рок",
          "Русский рок 80-х",
          "Концептуальная музыка",
          "Рок-музыка СССР"
        ],
        "award": "Легенда ленинградского рока",
        "founder": {
          "@type": "Person",
          "name": seoConfig.structuredData.founder.name,
          "alternateName": seoConfig.structuredData.founder.alternateName
        },
        "sameAs": Object.values(seoConfig.site.social)
      },
      
      // Founder/Person
      {
        "@type": "Person",
        "name": seoConfig.structuredData.founder.name,
        "alternateName": seoConfig.structuredData.founder.alternateName,
        "jobTitle": seoConfig.structuredData.founder.jobTitle.ru,
        "description": seoConfig.structuredData.founder.description.ru,
        "birthDate": seoConfig.structuredData.founder.birthDate,
        "deathDate": seoConfig.structuredData.founder.deathDate,
        "birthPlace": {
          "@type": "Place",
          "name": seoConfig.structuredData.founder.birthPlace
        },
        "alumniOf": {
          "@type": "Organization",
          "name": "Ленинградская рок-сцена"
        },
        "sameAs": [
          "https://ru.wikipedia.org/wiki/Задерий,_Святослав_Геннадьевич"
        ]
      },
      
      // Albums
      ...seoConfig.structuredData.albums.map(album => ({
        "@type": "MusicAlbum",
        "name": album.name,
        "alternateName": album.alternateName,
        "description": album.description.ru,
        "datePublished": album.datePublished,
        "inLanguage": ["ru", "en"],
        "keywords": seoConfig.site.keywords.ru,
        "numberOfTracks": album.numberOfTracks || undefined,
        "byArtist": {
          "@type": "MusicGroup",
          "name": seoConfig.structuredData.musicGroup.name
        },
        "albumReleaseType": "https://schema.org/AlbumRelease",
        ...(album.numberOfTracks ? { "numTracks": album.numberOfTracks } : {})
      })),
      
      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Главная",
            "item": seoConfig.site.baseUrl + "/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "О проекте",
            "item": seoConfig.site.baseUrl + "/about.html"
          }
        ]
      },
      
      // FAQPage (for AI search)
      ...(seoConfig.aiSearch.enableFAQ ? [{
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Кто такой Святослав Задерий?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${seoConfig.structuredData.founder.description.ru}. Он основал группу Алиса, а затем группу НАТЕ! в 1987 году. Его песни гремели по всему Советскому Союзу в конце 80-х и начале 90-х годов.`
            }
          },
          {
            "@type": "Question",
            "name": "Когда была основана группа НАТЕ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Группа НАТЕ! была основана Святославом Задерием в ${seoConfig.structuredData.musicGroup.foundingDate} году. Название группы предложил Константин Кинчев.`
            }
          },
          {
            "@type": "Question",
            "name": "Какие альбомы выпустила группа НАТЕ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Группа НАТЕ! выпустила несколько альбомов, включая '${seoConfig.structuredData.albums[1].name}' (${seoConfig.structuredData.albums[1].datePublished}), '${seoConfig.structuredData.albums[2].name}' (${seoConfig.structuredData.albums[2].datePublished}), и концептуальный альбом '${seoConfig.structuredData.albums[0].name}' (${seoConfig.structuredData.albums[0].datePublished}).`
            }
          },
          {
            "@type": "Question",
            "name": "Что такое альбом 'Музыка для взрослых'?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": seoConfig.structuredData.albums[0].description.ru + " Альбом состоит из 13 треков и разделен на две части: Сторона А - о человеке и государстве, Сторона Б - о любви."
            }
          },
          {
            "@type": "Question",
            "name": "Где можно послушать музыку группы НАТЕ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Музыку группы НАТЕ! можно послушать на Spotify, Yandex Music, YouTube, а также на официальном сайте ${seoConfig.site.baseUrl}. Альбом '${seoConfig.structuredData.albums[0].name}' доступен на всех основных музыкальных платформах.`
            }
          },
          {
            "@type": "Question",
            "name": "Какие группы основал Святослав Задерий?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Святослав Задерий основал две известные рок-группы: 'Алиса' и 'НАТЕ!'. Он также способствовал становлению таких музыкантов как Константин Кинчев и Александр Башлачёв."
            }
          }
        ]
      }] : []),
      
      // Add AudioObject schemas for individual tracks
      ...audioObjects
    ]
  };

  return structuredData;
}


