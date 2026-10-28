import apiClient from './client';

export const studentsApi = {
  getProfile: () => apiClient.get('/students/me'),
  updateProfile: (data) => apiClient.put('/students/me', data),
  getGrades: () => apiClient.get('/students/me/grades'),
  updateGrades: (grades) => apiClient.put('/students/me/grades', { grades }),
};

export default studentsApi;
