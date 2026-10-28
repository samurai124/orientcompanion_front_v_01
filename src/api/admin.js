import apiClient from './client';

export const adminApi = {
  getStats: () => apiClient.get('/admin/stats'),
  getUsers: (params) => apiClient.get('/admin/users', { params }),
  updateUserStatus: (id, status) => apiClient.patch(`/admin/users/${id}/status`, { status }),

  // Schools CRUD
  createSchool: (data) => apiClient.post('/admin/schools', data),
  updateSchool: (id, data) => apiClient.put(`/admin/schools/${id}`, data),
  deleteSchool: (id) => apiClient.delete(`/admin/schools/${id}`),

  // Filieres CRUD
  createFiliere: (data) => apiClient.post('/admin/filieres', data),
  updateFiliere: (id, data) => apiClient.put(`/admin/filieres/${id}`, data),
  deleteFiliere: (id) => apiClient.delete(`/admin/filieres/${id}`),

  // Requirements CRUD
  createRequirement: (data) => apiClient.post('/admin/requirements', data),
  updateRequirement: (id, data) => apiClient.put(`/admin/requirements/${id}`, data),
  deleteRequirement: (id) => apiClient.delete(`/admin/requirements/${id}`),

  // Documents CRUD
  createDocument: (data) => apiClient.post('/admin/documents', data),
  updateDocument: (id, data) => apiClient.put(`/admin/documents/${id}`, data),
  deleteDocument: (id) => apiClient.delete(`/admin/documents/${id}`),

  // Concours & Questions
  createConcours: (data) => apiClient.post('/admin/concours', data),
  createQuestion: (data) => apiClient.post('/admin/questions', data),
  bulkImportQuestions: (data) => {
    if (Array.isArray(data)) {
      return apiClient.post('/admin/questions/bulk', { concoursId: 1, questions: data });
    }
    return apiClient.post('/admin/questions/bulk', data);
  },
};

export default adminApi;
