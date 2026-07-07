import { announceToScreenReader } from '../components/AriaAnnouncer';

/**
 * Announces a page route navigation event to screen readers.
 * @param {string} pageName 
 */
export const announceNavigation = (pageName) => {
  announceToScreenReader(`Navigated to ${pageName} page`);
};
