import apiClient from './client';

export const concoursApi = {
  getConcours: () => apiClient.get('/concours'),
  getConcoursById: (id) => apiClient.get(`/concours/${id}`),
  getStudyPlans: () => apiClient.get('/study-plans/me'),
  createStudyPlan: (data) => apiClient.post('/study-plans', data),
  toggleTask: (taskId, status) => apiClient.patch(`/study-tasks/${taskId}`, { status }),
  regenerateStudyPlan: (planId) => apiClient.post(`/study-plans/${planId}/regenerate`),
  getQuestionBank: (params) => apiClient.get('/question-bank', { params }),
  startExam: (mockExamId) => apiClient.post(`/mock-exams/${mockExamId}/start`),
  submitExam: (mockExamId, answers) => apiClient.post(`/mock-exams/${mockExamId}/submit`, { answers }),
  getAttempts: () => apiClient.get('/exam-attempts/me'),
};

export default concoursApi;
