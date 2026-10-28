import apiClient from './client';

export const recommendationsApi = {
  getRecommendations: () => apiClient.get('/recommendations/me'),
  generateRecommendations: () => apiClient.post('/recommendations/generate'),
};

export default recommendationsApi;
