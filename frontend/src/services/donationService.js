import API from './api';

export const getDonations = async (params = {}) => {
  const response = await API.get('/donations', { params });
  return response.data;
};

export const getDonation = async (id) => {
  const response = await API.get(`/donations/${id}`);
  return response.data;
};

export const createDonation = async (data) => {
  const response = await API.post('/donations', data);
  return response.data;
};

export const updateDonation = async (id, data) => {
  const response = await API.put(`/donations/${id}`, data);
  return response.data;
};

export const deleteDonation = async (id) => {
  const response = await API.delete(`/donations/${id}`);
  return response.data;
};
