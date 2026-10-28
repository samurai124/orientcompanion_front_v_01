import apiClient from './client';

export const applicationsApi = {
  getApplications: () => apiClient.get('/applications/me'),
  createApplication: (filiereId) => apiClient.post('/applications', { filiereId }),
  getApplicationProgress: (id) => apiClient.get(`/applications/${id}/progress`),
  updateDocumentStatus: (appId, docId, data) =>
    apiClient.patch(`/applications/${appId}/checklist/${docId}`, data),
  uploadDocument: (appId, docId, formData) =>
    apiClient.post(`/applications/${appId}/checklist/${docId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default applicationsApi;
