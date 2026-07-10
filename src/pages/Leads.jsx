import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import LeadForm from '../components/leads/LeadForm';
import LeadTable from '../components/leads/LeadTable';
import LeadCard from '../components/leads/LeadCard';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
import { LayoutGrid, List, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Leads Management Page.
 * Responsive design matching screen behaviors:
 * - Mobile: Cards view only, layout switch hidden.
 * - Tablet: Hybrid mode with toggle between card and table.
 * - Desktop: Full table view only, layout switch hidden.
 */
export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useLeads();
  const location = useLocation();

  // Search, filter, and layout states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewLayout, setViewLayout] = useState('table'); // 'table' or 'grid'

  // Modal and edit selection states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Listen for navigation state from Quick Actions to open the form modal directly
  useEffect(() => {
    if (location.state?.openModal) {
      setSelectedLead(null);
      setIsModalOpen(true);
      // Clean up the location state so it doesn't trigger on subsequent reloads
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Derived state: Filtered leads calculation (Memoized)
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => activeFilter === 'All' || lead.status === activeFilter)
      .filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [leads, activeFilter, searchQuery]);

  // Actions handlers (Memoized)
  const handleOpenAddModal = useCallback(() => {
    setSelectedLead(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback((formData) => {
    if (selectedLead) {
      updateLead(selectedLead.id, formData);
      toast.success('Lead details updated successfully!');
    } else {
      addLead(formData);
      toast.success('New lead created successfully!');
    }
    setIsModalOpen(false);
    setSelectedLead(null);
  }, [selectedLead, updateLead, addLead]);

  const handleDeleteLead = useCallback((id) => {
    // Elegant confirmation toast
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Are you sure you want to delete this lead?
          </span>
          <div className="flex items-center justify-end gap-1.5 mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-2.5 py-1 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-md hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteLead(id);
                toast.dismiss(t.id);
                toast.success('Lead deleted successfully.', {
                  icon: '🗑️',
                  style: { borderLeft: '4px solid var(--color-danger)' },
                });
              }}
              className="px-2.5 py-1 text-[10px] font-bold text-white bg-danger rounded-md hover:bg-danger-dark"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000, id: `confirm-delete-${id}` }
    );
  }, [deleteLead]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('All');
  }, []);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Lead Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Monitor, update, and manage your startup pipeline prospects.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/10 transition-all active:scale-[0.98] min-h-[44px] self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Control panel (Search & Toggle layout) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* View togglers - visible on Tablet only (md:flex lg:hidden) */}
        <div className="hidden md:flex lg:hidden items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm self-end md:self-auto">
          <button
            onClick={() => setViewLayout('table')}
            className={`p-2 rounded-lg transition-all min-w-[36px] min-h-[36px] flex items-center justify-center ${
              viewLayout === 'table'
                ? 'bg-primary/10 text-primary dark:bg-slate-800 dark:text-white'
                : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title="Table View"
            aria-label="Switch to Table View"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewLayout('grid')}
            className={`p-2 rounded-lg transition-all min-w-[36px] min-h-[36px] flex items-center justify-center ${
              viewLayout === 'grid'
                ? 'bg-primary/10 text-primary dark:bg-slate-800 dark:text-white'
                : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title="Card Grid View"
            aria-label="Switch to Card Grid View"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        leads={leads}
      />

      {/* Leads List Rendering */}
      {filteredLeads.length === 0 ? (
        <EmptyState hasTotalLeads={leads.length > 0} onReset={handleResetFilters} />
      ) : (
        <div className="transition-all duration-300">
          {/* Table View (shown on Desktop lg+ always, and Tablet md if toggled) */}
          <div className={viewLayout === 'table' ? 'hidden md:block' : 'hidden lg:block'}>
            <LeadTable
              leads={filteredLeads}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteLead}
            />
          </div>

          {/* Grid Card View (shown on Mobile always, and Tablet md if toggled, hidden on Desktop lg+) */}
          <div
            className={`${
              viewLayout === 'grid' ? 'grid lg:hidden' : 'grid md:hidden'
            } grid-cols-1 sm:grid-cols-2 gap-5`}
          >
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteLead}
              />
            ))}
          </div>
        </div>
      )}

      {/* Form Modal popup */}
      {isModalOpen && (
        <LeadForm
          initialData={selectedLead}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedLead(null);
          }}
        />
      )}
    </div>
  );
}
