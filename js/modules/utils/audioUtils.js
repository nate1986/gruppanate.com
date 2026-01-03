/**
 * Formats seconds into MM:SS format
 * @param {number} num - Number of seconds
 * @returns {string} Formatted time string
 */
export function getTimeCodeFromNum(num) {
    if (!num || !Number.isFinite(num)) {
        return '0:00';
    }
    
    const minutes = Math.floor(num / 60);
    const seconds = Math.floor(num % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}