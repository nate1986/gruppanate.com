/**
 * Utility to load and inject structured data (JSON-LD) into the page
 * This ensures structured data is available for search engines even if JavaScript loads slowly
 */

import { structuredData } from '../data/structuredData.js';
import { generateStructuredDataFromConfig } from '../data/structuredDataConfig.js';

/**
 * Injects structured data into the page head
 * Creates a script tag with type="application/ld+json"
 */
export function injectStructuredData() {
	try {
		// Check if structured data script already exists
		let existingScript = document.querySelector('script[type="application/ld+json"][data-structured-data]');
		
		if (existingScript) {
			console.log('Structured data already injected');
			return;
		}

		// Try to use config-based structured data first (for consistency with SEO config)
		// Fall back to static structuredData if config generation fails
		let dataToInject;
		try {
			dataToInject = generateStructuredDataFromConfig();
			console.log('Using config-based structured data');
		} catch (configError) {
			console.warn('Could not generate structured data from config, using static data:', configError);
			dataToInject = structuredData;
		}

		// Create script element
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.setAttribute('data-structured-data', 'true');
		script.textContent = JSON.stringify(dataToInject, null, 2);
		
		// Insert into head (preferably early, but after charset)
		const head = document.head || document.getElementsByTagName('head')[0];
		const firstScript = head.querySelector('script');
		
		if (firstScript) {
			head.insertBefore(script, firstScript);
		} else {
			head.appendChild(script);
		}
		
		console.log('Structured data injected successfully');
	} catch (error) {
		console.error('Error injecting structured data:', error);
	}
}

/**
 * Initialize structured data injection
 * IMPORTANT: For best SEO, this should execute as early as possible
 * Ideally, structured data should be in HTML, but this is a compromise
 */
export function initStructuredData() {
	// Inject immediately - don't wait for DOMContentLoaded
	// This ensures structured data is available as early as possible for search engines
	try {
		injectStructuredData();
	} catch (error) {
		// If immediate injection fails, try on DOMContentLoaded as fallback
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', injectStructuredData);
		} else {
			// DOM is already ready, try again
			setTimeout(injectStructuredData, 0);
		}
	}
}

