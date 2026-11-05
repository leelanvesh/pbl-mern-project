import API from './api';

export const getDashboardStats = async () => {
  const response = await API.get('/dashboard/stats');
  return response.data;
};

export const getBloodGroupReport = async () => {
  const response = await API.get('/reports/blood-groups');
  return response.data;
};
