import axios from 'axios';

// Create axios instance
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const fetchStudents = (params) => api.get('/api/students', { params });
export const fetchCompanies = (params) => api.get('/api/companies', { params });
export const fetchApplications = (params) => api.get('/api/applications', { params });
export const fetchStudentByUSN = (usn) => api.get(`/api/students/usn/${usn}`);
export const fetchApplicationsByStudent = (studentId, params) => api.get('/api/applications', { params: { studentId, ...params } });

// Dashboard analytics endpoints
export const fetchDashboardStats = (params) => api.get('/api/students/stats', { params });
export const fetchCompanySelections = (params) => api.get('/api/students/company-selections', { params });
export const fetchStatusDistribution = (params) => api.get('/api/students/status-distribution', { params });

// Admin endpoints
export const loginAdmin = (credentials) => api.post('/api/admin/login', credentials);
export const registerAdmin = (data) => api.post('/api/admin/register', data);
export const getAdminProfile = () => api.get('/api/admin/profile');

export default api;
