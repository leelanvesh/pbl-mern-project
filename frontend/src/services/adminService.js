import api from './api';

export const getDashboard = () => api.get('/admin/dashboard');
export const getBloodAvailability = () => api.get('/admin/blood-availability');
export const getReports = () => api.get('/admin/reports');
