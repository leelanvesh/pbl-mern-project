import API from './api';

export const getDonors = async (params = {}) => {
  const response = await API.get('/donors', { params });
  return response.data;
};

export const getDonor = async (id) => {
  const response = await API.get(`/donors/${id}`);
  return response.data;
};

export const getDonorByUserId = async (userId) => {
  const response = await API.get(`/donors/user/${userId}`);
  return response.data;
};

export const createDonor = async (data) => {
  const response = await API.post('/donors', data);
  return response.data;
};

export const updateDonor = async (id, data) => {
  const response = await API.put(`/donors/${id}`, data);
  return response.data;
};

export const deleteDonor = async (id) => {
  const response = await API.delete(`/donors/${id}`);
  return response.data;
};

export const verifyDonor = async (id) => {
  const response = await API.put(`/donors/${id}/verify`);
  return response.data;
};

export const getDonorDonations = async (donorId) => {
  const response = await API.get(`/donors/${donorId}/donations`);
  return response.data;
};
