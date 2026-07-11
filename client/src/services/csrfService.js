/**
 * Helper utility to retrieve CSRF tokens from the browser cookies.
 * Falls back to sessionStorage for tokens retrieved from response headers.
 */
export const getCsrfToken = () => {
  const fromCookie = document.cookie.match(new RegExp('(^| )csrf-token=([^;]+)'));
  if (fromCookie) {
    return fromCookie[2];
  }
  return sessionStorage.getItem('csrf_token') || null;
};

/**
 * Fetch a fresh CSRF token from the server by hitting a dedicated endpoint.
 * Used to recover from CSRF failures without a full page reload.
 */
export const fetchCsrfToken = async () => {
  try {
    const response = await fetch('/api/auth/csrf-token', {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    if (data.token) {
      sessionStorage.setItem('csrf_token', data.token);
    }
    return data.token;
  } catch (err) {
    console.error('Failed to fetch CSRF token:', err);
    return null;
  }
};

export default {
  getCsrfToken,
  fetchCsrfToken,
};
