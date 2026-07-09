/**
 * Helper utility to retrieve CSRF tokens from the browser cookies.
 */
export const getCsrfToken = () => {
  const match = document.cookie.match(new RegExp('(^| )csrf-token=([^;]+)'));
  if (match) {
    return match[2];
  }
  return null;
};

export default {
  getCsrfToken
};
