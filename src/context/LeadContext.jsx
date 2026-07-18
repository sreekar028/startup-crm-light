import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import * as leadService from '../services/leadService.js';
import toast from 'react-hot-toast';

const LeadContext = createContext(null);

/**
 * LeadProvider — manages the global leads state by wiring
 * all CRUD operations to the Express REST API via leadService.
 */
export function LeadProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 100, pages: 1 });

  /**
   * Fetch all leads (with optional filters).
   * Replaces the local state with the server response.
   */
  const fetchLeads = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const result = await leadService.getLeads({ limit: 100, ...params });
      setLeads(result.data || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load leads.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new lead via the API and add it to local state.
   */
  const addLead = useCallback(async (leadData) => {
    try {
      const result = await leadService.createLead(leadData);
      const newLead = result.data;
      setLeads((prev) => [newLead, ...prev]);
      return newLead;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create lead.';
      toast.error(message);
      throw err;
    }
  }, []);

  /**
   * Update an existing lead via the API and sync local state.
   */
  const updateLead = useCallback(async (id, leadData) => {
    try {
      const result = await leadService.updateLead(id, leadData);
      const updatedLead = result.data;
      setLeads((prev) => prev.map((l) => (l._id === id ? updatedLead : l)));
      return updatedLead;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update lead.';
      toast.error(message);
      throw err;
    }
  }, []);

  /**
   * Delete a lead via the API and remove from local state.
   */
  const deleteLead = useCallback(async (id) => {
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete lead.';
      toast.error(message);
      throw err;
    }
  }, []);

  const contextValue = useMemo(() => ({
    leads,
    isLoading,
    pagination,
    fetchLeads,
    addLead,
    updateLead,
    deleteLead,
  }), [leads, isLoading, pagination, fetchLeads, addLead, updateLead, deleteLead]);

  return (
    <LeadContext.Provider value={contextValue}>
      {children}
    </LeadContext.Provider>
  );
}

/**
 * Custom hook to consume LeadContext.
 */
export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider. Check your component tree structure.');
  }
  return context;
}
