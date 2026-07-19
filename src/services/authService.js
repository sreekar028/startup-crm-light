import api from './api.js';

const unwrapResponse = (response) => response?.data?.data ?? response?.data;

/**
 * Register a new user account.
 * @param {string} name - Full name
 * @param {string} email - Email address
 * @param {string} password - Password (min 6 chars)
 * @returns {Object} { token, user }
 */
export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return unwrapResponse(response);
};

/**
 * Login with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Object} { token, user }
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return unwrapResponse(response);
};

/**
 * Logout — stateless JWT auth, so we just remove the token from localStorage.
 */
export const logout = () => {
  localStorage.removeItem('crm-token');
};

/**
 * Get the currently logged-in user's profile.
 * @returns {Object} User object
 */
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return unwrapResponse(response);
};

/**
 * Update user profile fields (name, password).
 * @param {Object} data - { name?, oldPassword?, newPassword? }
 * @returns {Object} Updated user object
 */
export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return unwrapResponse(response);
};
