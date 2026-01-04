/**
 * FAQ Section Populator
 * Generates FAQ HTML section from faqData
 * This ensures FAQ is available for search engines even if loaded via JavaScript
 */

import { faqData } from '../data/faqData.js';
import { debug, debugError } from '../utils/debug.js';

/**
 * Populates FAQ section with questions and answers
 * Uses microdata markup for SEO
 */
export function populateFAQ() {
	try {
		const faqSection = document.querySelector('.faq-section');
		
		if (!faqSection) {
			debugError('faq', 'FAQ section not found in HTML');
			return;
		}

		const faqContainer = faqSection.querySelector('[itemscope][itemtype="https://schema.org/FAQPage"]');
		
		if (!faqContainer) {
			debugError('faq', 'FAQ container not found');
			return;
		}

		// Clear existing content (except title)
		faqContainer.innerHTML = '';

		// Generate FAQ items
		faqData.forEach((item, index) => {
			const faqItem = document.createElement('div');
			faqItem.setAttribute('itemscope', '');
			faqItem.setAttribute('itemprop', 'mainEntity');
			faqItem.setAttribute('itemtype', 'https://schema.org/Question');

			faqItem.innerHTML = `
				<h3 itemprop="name">${escapeHtml(item.question)}</h3>
				<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
					<p itemprop="text">${escapeHtml(item.answer)}</p>
				</div>
			`;

			faqContainer.appendChild(faqItem);
		});

		debug('faq', `FAQ section populated with ${faqData.length} questions`);
	} catch (error) {
		debugError('faq', 'Error populating FAQ section:', error);
	}
}

/**
 * Simple HTML escape function
 */
function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}


