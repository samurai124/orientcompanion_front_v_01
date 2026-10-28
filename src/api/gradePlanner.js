import apiClient from './client';

export const gradePlannerApi = {
  getGoals: () => apiClient.get('/grade-planner/goals'),
  createGoal: (filiereId) => apiClient.post('/grade-planner/goals', { filiereId }),
  deleteGoal: (id) => apiClient.delete(`/grade-planner/goals/${id}`),
  simulate: (data) => apiClient.post('/grade-planner/simulate', data),
};

export default gradePlannerApi;
