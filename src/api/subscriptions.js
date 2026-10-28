import apiClient from './client';

export const subscriptionsApi = {
  getPlans: () => apiClient.get('/plans'),
  getMySubscription: () => apiClient.get('/subscriptions/me'),
  checkout: (planCode) => apiClient.post('/subscriptions/checkout', { planCode }),
  cancel: () => apiClient.post('/subscriptions/cancel'),
};

export default subscriptionsApi;
