import apiClient from './client';

export const notificationsApi = {
  getNotifications: () => apiClient.get('/notifications'),
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.post('/notifications/read-all'),
};

export default notificationsApi;
