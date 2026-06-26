const POSITIVE_WORDS = ['good', 'great', 'excellent', 'amazing', 'perfect', 'helpful', 'professional', 'fast', 'clean'];
const NEGATIVE_WORDS = ['bad', 'poor', 'terrible', 'worst', 'rude', 'late', 'dirty', 'unprofessional', 'slow'];

/**
 * Analyzes the sentiment of a text block based on keyword match frequencies.
 * Returns a score between -1 and 1.
 */
export const analyzeSentiment = (text) => {
  if (!text) return 0;
  
  const words = text.toLowerCase().split(/\W+/);
  let score = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.includes(word)) score += 1;
    if (NEGATIVE_WORDS.includes(word)) score -= 1;
  }

  if (score > 0) return 1; // Positive
  if (score < 0) return -1; // Negative
  return 0; // Neutral
};
