import apiClient from './client';

export const schoolsApi = {
  getSchools: (params) => apiClient.get('/schools', { params }),
  getSchoolById: (id) => apiClient.get(`/schools/${id}`),
  getSchoolRequirements: (id) => apiClient.get(`/schools/${id}/requirements`),
  getFilieres: (params) => apiClient.get('/filieres', { params }),
  getFiliereById: (id) => apiClient.get(`/filieres/${id}`),
};

export default schoolsApi;
