import { useEffect, useMemo, useState } from 'react';
import {
    fetchApplications,
    fetchCompanySelections,
    fetchDashboardStats,
    fetchStatusDistribution
} from '../api/api';
import ApplicationsTable from '../components/ApplicationsTable';
import Card from '../components/Card';
import CompanySelectionChart from '../components/CompanySelectionChart';
import FiltersBar from '../components/FiltersBar';
import StatusDistributionChart from '../components/StatusDistributionChart';
import { useFetch } from '../hooks/useFetch';
import { useStore } from '../store/useStore';

export default function DashboardPage() {
  const { filters } = useStore();
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({
    companySelections: [],
    statusDistribution: []
  });

  // Build params object from filters (only include non-empty values) - memoized for performance
  const filterParams = useMemo(() => {
    const params = {};
    if (filters.company) params.company = filters.company;
    if (filters.status) params.status = filters.status;
    if (filters.sem) params.sem = filters.sem;
    if (filters.course) params.course = filters.course;
    if (filters.jobType) params.jobType = filters.jobType;
    if (filters.recruitmentMonth) params.recruitmentMonth = filters.recruitmentMonth;
    return params;
  }, [filters.company, filters.status, filters.sem, filters.course, filters.jobType, filters.recruitmentMonth]);

  // Fetch dashboard stats
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError
  } = useFetch(fetchDashboardStats, filterParams);

  // Fetch company selections
  const {
    data: companySelectionsData,
    loading: companySelectionsLoading,
    error: companySelectionsError
  } = useFetch(fetchCompanySelections, filterParams);

  // Fetch status distribution
  const {
    data: statusDistributionData,
    loading: statusDistributionLoading,
    error: statusDistributionError
  } = useFetch(fetchStatusDistribution, filterParams);

  // Fetch applications
  const {
    data: applicationsData,
    loading: applicationsLoading,
    error: applicationsError
  } = useFetch(fetchApplications, filterParams);

  // Update state when data changes
  useEffect(() => {
    if (statsData?.data) {
      setStats(statsData.data);
    }
  }, [statsData]);

  useEffect(() => {
    if (companySelectionsData?.data) {
      setChartData(prev => ({
        ...prev,
        companySelections: companySelectionsData.data
      }));
    }
  }, [companySelectionsData]);

  useEffect(() => {
    if (statusDistributionData?.data) {
      setChartData(prev => ({
        ...prev,
        statusDistribution: statusDistributionData.data.map(item => ({
          name: item._id,
          value: item.count
        }))
      }));
    }
  }, [statusDistributionData]);

  // Loading state
  const isLoading = statsLoading || companySelectionsLoading || statusDistributionLoading || applicationsLoading;

  // Check if any filters are active
  const hasActiveFilters = filterParams && Object.keys(filterParams).length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Placement Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track and manage student placement applications
            </p>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Filters Active</span>
            </div>
          )}
        </div>

      {/* Filters */}
      <FiltersBar
        onApply={() => {
          // Filters are applied automatically via reactive store
          // This is just a visual confirmation
        }}
        onReset={() => {
          useStore.getState().resetFilters();
        }}
      />

      {/* Error Messages */}
      {(statsError || companySelectionsError || statusDistributionError || applicationsError) && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                Connection Error
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                {statsError || companySelectionsError || statusDistributionError || applicationsError}
              </p>
              <div className="text-xs text-red-600 dark:text-red-400 space-y-1">
                <p className="font-medium">To fix this:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Navigate to the <code className="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded">Server</code> directory</li>
                  <li>Make sure you have a <code className="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded">.env</code> file with <code className="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded">MONGO_URI</code> set</li>
                  <li>Run <code className="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded">npm start</code> to start the backend server</li>
                  <li>Ensure MongoDB is running and accessible</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            title="Total Students"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          >
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalStudents ?? 0}
              </div>
              {statsLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Registered students</p>
          </Card>
          
          <Card 
            title="Total Companies"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          >
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalCompanies ?? 0}
              </div>
              {statsLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Partner companies</p>
          </Card>
          
          <Card 
            title="Total Applications"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalApplications ?? 0}
              </div>
              {statsLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All applications</p>
          </Card>
          
          <Card 
            title="Selected"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.totalSelected ?? 0}
              </div>
              {statsLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Successfully placed</p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Company-wise Selections" className="lg:col-span-2">
            {companySelectionsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <CompanySelectionChart data={chartData.companySelections} />
            )}
          </Card>
          
          <Card title="Status Distribution">
            {statusDistributionLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <StatusDistributionChart data={chartData.statusDistribution} />
            )}
          </Card>
        </div>

        {/* Applications Table */}
        <Card title="Applications">
          {applicationsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {applicationsData?.data && applicationsData.data.length > 50 && (
                <div className="mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                  Showing first 50 of {applicationsData.total || applicationsData.data.length} applications
                </div>
              )}
              <ApplicationsTable
                applications={applicationsData?.data?.slice(0, 50) || []}
              />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
