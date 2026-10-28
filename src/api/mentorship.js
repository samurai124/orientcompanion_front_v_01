import apiClient from './client';

export const mentorshipApi = {
  getCounselors: () => apiClient.get('/counselors'),
  getSessions: () => apiClient.get('/mentorship/sessions'),
  requestSession: (data) => apiClient.post('/mentorship/sessions', data),
  acceptSession: (id) => apiClient.patch(`/mentorship/sessions/${id}/accept`),
  rejectSession: (id, reason) => apiClient.patch(`/mentorship/sessions/${id}/reject`, { reason }),
  cancelSession: (id, reason) => apiClient.patch(`/mentorship/sessions/${id}/cancel`, { reason }),
  completeSession: (id, data) => apiClient.patch(`/mentorship/sessions/${id}/complete`, data),
  rateSession: (id, data) => apiClient.post(`/mentorship/sessions/${id}/rating`, data),
  getAvailability: () => apiClient.get('/counselors/me/availability'),
  addAvailability: (data) => apiClient.post('/counselors/me/availability', data),
  deleteAvailability: (id) => apiClient.delete(`/counselors/me/availability/${id}`),
};

export default mentorshipApi;
