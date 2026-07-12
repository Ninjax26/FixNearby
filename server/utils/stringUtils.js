/**
 * Capitalizes the first letter of a string.
 * @param {string} str Input string
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (typeof str !== 'string' || !str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a specified length and appends ellipses.
 * @param {string} str Input string
 * @param {number} length Max length
 * @returns {string} Truncated string
 */
export function truncate(str, length = 30) {
  if (typeof str !== 'string' || !str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export default {
  capitalize,
  truncate
};
