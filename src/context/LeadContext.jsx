import React, { createContext, useContext, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { sampleLeads } from '../data/sampleLeads';

// Create the Context for Leads
const LeadContext = createContext(null);

/**
 * LeadProvider component that wraps the React application and provides
 * global state for managing sales leads.
 */
export function LeadProvider({ children }) {
  // Initialize state with useLocalStorage, defaulting to sampleLeads if empty
  const [leads, setLeads] = useLocalStorage('startup-crm-leads', sampleLeads);

  /**
   * Adds a new lead to the database.
   * Generates a unique ID and attaches the current timestamp.
   * 
   * @param {Object} lead - The lead object to add (name, company, email, phone, status, source)
   */
  const addLead = useCallback((lead) => {
    const newLead = {
      ...lead,
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    setLeads((prevLeads) => [newLead, ...prevLeads]);
  }, [setLeads]);

  /**
   * Updates an existing lead's details.
   * 
   * @param {string} id - The ID of the lead to update.
   * @param {Object} updatedFields - The field-value pairs to update on the lead.
   */
  const updateLead = useCallback((id, updatedFields) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => (lead.id === id ? { ...lead, ...updatedFields } : lead))
    );
  }, [setLeads]);

  /**
   * Deletes a lead by ID.
   * 
   * @param {string} id - The ID of the lead to delete.
   */
  const deleteLead = useCallback((id) => {
    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
  }, [setLeads]);

  /**
   * Finds a lead by its ID.
   * 
   * @param {string} id - The ID of the lead to retrieve.
   * @returns {Object|undefined} The matching lead object or undefined.
   */
  const getLeadById = useCallback((id) => {
    return leads.find((lead) => lead.id === id);
  }, [leads]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    leads,
    addLead,
    updateLead,
    deleteLead,
    getLeadById
  }), [leads, addLead, updateLead, deleteLead, getLeadById]);

  return (
    <LeadContext.Provider value={contextValue}>
      {children}
    </LeadContext.Provider>
  );
}

/**
 * Custom React hook to consume LeadContext and prevent repetitive useContext calls.
 * 
 * @returns {Object} Lead context values (leads, addLead, updateLead, deleteLead, getLeadById)
 */
export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider. Check your component tree structure.');
  }
  return context;
}
