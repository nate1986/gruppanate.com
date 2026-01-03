import { debug, debugError, debugWarn } from '../utils/debug.js';
import { safeGtagEvent, safeGtagReportConversionExt } from '../utils/analytics.js';

/**
 * Creates a link button for external services
 * @param {Object} link - The link data
 * @returns {Promise<HTMLElement>} - The link button element
 */
export async function createLinkButton(link) {
  const a = document.createElement('a');
  a.href = link.url;
  a.target = '_blank';

  const button = document.createElement('button');
  button.className = 'btn';
  button.onclick = function() { 
    safeGtagEvent('event', 'ext_link', { 
      'event_label': link.label, 
      'conversion': 'yes' 
    }); 
    safeGtagReportConversionExt(); 
  };
  
  const span = document.createElement('span');
  span.innerText = link.platform;
  button.appendChild(span);
  
  // Fetch and inject SVG
  try {
    let svgContent = '';
    if (link.svg) {
      const response = await fetch(link.svg); // Fetch SVG content from the path
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      svgContent = await response.text();
      debug('init', `Fetched SVG from path for ${link.platform}: ${link.svg}`);
    } else if (link.file) {
      const response = await fetch(link.file);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      svgContent = await response.text();
      debug('init', `Fetched SVG from file for ${link.platform}: ${link.file}`);
    } else {
      debugWarn('init', `No SVG content or file path specified for ${link.platform}`);
    }

    if (svgContent) {
      const parser = new DOMParser();
      const svgElement = parser.parseFromString(svgContent, "image/svg+xml").documentElement;
      button.appendChild(svgElement);
    }
  } catch (error) {
    debugError('init', `Error loading or parsing SVG for ${link.platform}:`, error);
  }
  
  a.appendChild(button);
  
  return a;
}
