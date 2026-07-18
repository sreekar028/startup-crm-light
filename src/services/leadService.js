import api from './api.js';

/**
 * Get all leads with optional filters.
 * @param {Object} params - { status, search, page, limit, sortBy, sortOrder }
 * @returns {Object} { data: leads[], pagination }
 */
export const getLeads = async (params = {}) => {
  const response = await api.get('/leads', { params });
  return response.data;
};

/**
 * Create a new lead.
 * @param {Object} leadData - Lead fields
 * @returns {Object} Created lead
 */
export const createLead = async (leadData) => {
  const response = await api.post('/leads', leadData);
  return response.data;
};

/**
 * Update a lead's full details.
 * @param {string} id - Lead ID
 * @param {Object} leadData - Updated fields
 * @returns {Object} Updated lead
 */
export const updateLead = async (id, leadData) => {
  const response = await api.put(`/leads/${id}`, leadData);
  return response.data;
};

/**
 * Update only a lead's status.
 * @param {string} id - Lead ID
 * @param {string} status - New status value
 * @returns {Object} Updated lead
 */
export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/leads/${id}/status`, { status });
  return response.data;
};

/**
 * Delete a lead by ID.
 * @param {string} id - Lead ID
 * @returns {Object} Success confirmation
 */
export const deleteLead = async (id) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};

/**
 * Get KPI stats summary for the Dashboard.
 * @returns {Object} Stats object
 */
export const getLeadStats = async () => {
  const response = await api.get('/leads/stats/summary');
  return response.data;
};

/**
 * Get monthly lead counts for the Analytics bar chart.
 * @returns {Array} [{ month, total, won }]
 */
export const getMonthlyStats = async () => {
  const response = await api.get('/leads/stats/monthly');
  return response.data;
};
