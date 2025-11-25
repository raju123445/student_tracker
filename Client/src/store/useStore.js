import { create } from 'zustand';

// Store for global filters, auth, and pagination
export const useStore = create((set, get) => ({
  auth: {
    token: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null,
    admin: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('admin') || '{}') : {},
  },
  filters: {
    company: null,
    status: null,
    sem: null,
    course: null,
    usn: '',
    name: '',
    recruitmentMonth: null,
    jobType: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  resetFilters: () => set({
    filters: {
      company: null,
      status: null,
      sem: null,
      course: null,
      usn: '',
      name: '',
      recruitmentMonth: null,
      jobType: null
    }
  }),
  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination }
  })),
  resetPagination: () => set({
    pagination: { page: 1, limit: 10, total: 0, pages: 0 }
  }),
}));
