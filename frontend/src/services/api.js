import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
});

// Automatically attach the Bearer token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const verifyAuth = () => api.get('/auth/me');

export const fetchDashboardData = () => api.get('/dashboard');
export const fetchInvestments = () => api.get('/investments');
export const fetchReferralTree = () => api.get('/referrals/tree');
export const fetchRoiHistory = () => api.get('/roi');
export const fetchReferralHistory = () => api.get('/referrals/history');

export default api;