// ─── Auth Service ─────────────────────────────────────────────────────────────
// Pure API calls only. No state, no side effects.
// All state management happens in store/auth.store.js.
//
// NOTE: Backend mounts routes at /auth/*, not /api/auth/*.
// baseURL is http://localhost:5000 so paths here start directly with /auth/

import api from '../api/axios';

/**
 * Register a new user.
 * @param {{ username: string, email: string, password: string, name: string }} data
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function register(data) {
  console.log('[auth.service.register] POSTing to /auth/register');
  console.log('[auth.service.register] baseURL:', api.defaults.baseURL);
  console.log('[auth.service.register] payload:', JSON.stringify({ ...data, password: '***' }));
  try {
    const res = await api.post('/auth/register', data);
    console.log('[auth.service.register] response status:', res.status);
    console.log('[auth.service.register] response data:', res.data);
    return res.data;
  } catch (err) {
    console.error('[auth.service.register] FAILED:', err?.response?.status, err?.response?.data || err?.message);
    throw err;
  }
}

/**
 * Log in with email + password.
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function login(data) {
  const res = await api.post('/auth/login', data);
  return res.data;
}

/**
 * Request password reset link.
 * @param {string} email
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function forgotPassword(email) {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
}

/**
 * Reset password with a token.
 * @param {string} token
 * @param {string} password
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function resetPassword(token, password) {
  const res = await api.post('/auth/reset-password', { token, password });
  return res.data;
}

/**
 * Fetch the currently authenticated user using the stored token.
 * Used on app load to hydrate the auth store.
 * @returns {Promise<{ user: object }>}
 */
export async function getMe() {
  const res = await api.get('/auth/me');
  return res.data;
}

/**
 * Log out — invalidates session server-side (if supported).
 * Token removal from localStorage is handled in the store.
 * @returns {Promise<void>}
 */
export async function logout() {
  await api.post('/auth/logout');
}

