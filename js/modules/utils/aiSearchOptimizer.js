/**
 * AI Search Optimizer
 * ===================
 * 
 * Adds meta tags and optimizations specifically for AI search engines:
 * - Google SGE (Search Generative Experience)
 * - ChatGPT with web browsing
 * - Perplexity
 * - Bing Chat
 * - Other AI-powered search engines
 */

import { seoConfig } from '../data/seoConfig.js';
import { debug, debugError } from './debug.js';

/**
 * Add AI-optimized meta tags
 */
export function addAISearchMetaTags() {
  try {
    if (!seoConfig.aiSearch.enableEnhancedDescriptions) {
      return;
    }

    // Add meta description with AI keywords
    const lang = document.documentElement.lang || 'ru';
    const aiKeywords = seoConfig.aiSearch.aiKeywords[lang] || seoConfig.aiSearch.aiKeywords.ru;
    
    // Enhanced description with AI-relevant keywords
    const enhancedDescription = `${seoConfig.site.description[lang]} ${aiKeywords.slice(0, 3).join(', ')}.`;
    
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      // Keep original but add AI context
      metaDesc.setAttribute('data-ai-enhanced', 'true');
    }

    // Add AI-specific meta tags
    const aiMetaTags = [
      {
        name: 'ai:description',
        content: enhancedDescription
      },
      {
        name: 'ai:keywords',
        content: aiKeywords.join(', ')
      },
      {
        name: 'ai:topic',
        content: 'Music, Rock Music, Russian Rock, Leningrad Rock, Soviet Rock'
      },
      {
        property: 'og:type',
        content: 'music.album' // More specific for AI
      }
    ];

    aiMetaTags.forEach(tag => {
      try {
        // Check if already exists
        const existing = document.querySelector(
          tag.name 
            ? `meta[name="${tag.name}"]` 
            : `meta[property="${tag.property}"]`
        );
        
        if (!existing) {
          const meta = document.createElement('meta');
          if (tag.name) {
            meta.name = tag.name;
          }
          if (tag.property) {
            meta.setAttribute('property', tag.property);
          }
          meta.content = tag.content;
          document.head.appendChild(meta);
        }
      } catch (e) {
        debugError('ai-search', `Error adding AI meta tag ${tag.name || tag.property}:`, e);
      }
    });

    debug('ai-search', 'AI search meta tags added');
  } catch (error) {
    debugError('ai-search', 'Error adding AI search meta tags:', error);
  }
}

/**
 * Add structured data enhancements for AI
 */
export function enhanceStructuredDataForAI() {
  try {
    // Add additional context that AI search engines can use
    const structuredDataScript = document.querySelector('script[type="application/ld+json"][data-structured-data]');
    
    if (structuredDataScript) {
      try {
        const data = JSON.parse(structuredDataScript.textContent);
        
        // Enhance with AI-friendly context
        if (data['@graph']) {
          data['@graph'].forEach(item => {
            // Add more descriptive text for AI
            if (item['@type'] === 'MusicGroup' && !item.about) {
              item.about = {
                '@type': 'Thing',
                'name': 'Russian Rock Music',
                'description': 'Legendary Leningrad rock band from the 1980s Soviet Union'
              };
            }
            
            // Add temporal context for AI
            if (item['@type'] === 'MusicAlbum' && !item.temporalCoverage) {
              if (item.datePublished) {
                item.temporalCoverage = item.datePublished;
              }
            }
          });
          
          // Update the script
          structuredDataScript.textContent = JSON.stringify(data, null, 2);
          debug('ai-search', 'Structured data enhanced for AI');
        }
      } catch (parseError) {
        debugError('ai-search', 'Error parsing structured data for AI enhancement:', parseError);
      }
    }
  } catch (error) {
    debugError('ai-search', 'Error enhancing structured data for AI:', error);
  }
}

/**
 * Initialize AI search optimizations
 */
export function initAISearchOptimization() {
  // Add meta tags
  addAISearchMetaTags();
  
  // Enhance structured data (after it's been injected)
  // Use a small delay to ensure structured data is already in place
  setTimeout(() => {
    enhanceStructuredDataForAI();
  }, 100);
  
  debug('ai-search', 'AI search optimization initialized');
}


