import { useEffect, useState } from 'react';
import { fetchCompanies } from '../api/api';
import { useStore } from '../store/useStore';

export default function FiltersBar({ onApply, onReset }) {
  const filters = useStore((s) => s.filters);
  const setFilter = useStore((s) => s.setFilter);
  const resetFilters = useStore((s) => s.resetFilters);

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchCompanies().then((res) => {
      if (mounted) setCompanies(res.data?.data || []);
    }).catch(() => {});
    return () => { mounted = false };
  }, []);

  const apply = () => {
    // Filters are automatically applied when changed (reactive store)
    // This button provides visual confirmation
    if (onApply) onApply();
    // Force a small delay to show user feedback
    const button = document.activeElement;
    if (button) {
      button.blur();
    }
  };

  const reset = () => {
    resetFilters();
    if (onReset) onReset();
  };

  const hasActiveFilters = filters.company || filters.status || filters.sem || filters.course || filters.jobType || filters.recruitmentMonth;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-5">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Company
          </label>
          <select 
            value={filters.company || ''} 
            onChange={(e) => setFilter('company', e.target.value || null)} 
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Companies</option>
            {companies.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Status
          </label>
          <select 
            value={filters.status || ''} 
            onChange={(e) => setFilter('status', e.target.value || null)} 
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
            <option value="In Process">In Process</option>
          </select>
        </div>

        <div className="w-[120px]">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Semester
          </label>
          <input 
            type="number" 
            min="1" 
            max="8" 
            value={filters.sem || ''} 
            onChange={(e) => setFilter('sem', e.target.value ? Number(e.target.value) : null)} 
            placeholder="All"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Course
          </label>
          <input 
            value={filters.course || ''} 
            onChange={(e) => setFilter('course', e.target.value || null)} 
            placeholder="All Courses"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Job Type
          </label>
          <select 
            value={filters.jobType || ''} 
            onChange={(e) => setFilter('jobType', e.target.value || null)} 
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Internship">Internship</option>
            <option value="Full-Time + Internship">Full-Time + Internship</option>
          </select>
        </div>

        <div className="w-[180px]">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Recruitment Month
          </label>
          <input 
            type="month" 
            value={filters.recruitmentMonth || ''} 
            onChange={(e) => setFilter('recruitmentMonth', e.target.value || null)} 
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>

        <div className="flex gap-2">
          <button 
            onClick={apply} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Apply
          </button>
          {hasActiveFilters && (
            <button 
              onClick={reset} 
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
