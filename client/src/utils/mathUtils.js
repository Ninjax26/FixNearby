/**
 * Rounds a number to a specific decimal precision.
 * @param {number} num Number to round
 * @param {number} precision Decimal places
 * @returns {number} Rounded number
 */
export function roundTo(num, precision = 2) {
  if (typeof num !== 'number' || isNaN(num)) return 0;
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

/**
 * Returns safe percentage value between 0 and 100.
 * @param {number} value
 * @returns {number} percentage
 */
export function clampPercentage(value) {
  if (typeof value !== 'number' || isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export default {
  roundTo,
  clampPercentage
};
