import apiClient from './client';

export const assessmentApi = {
  getQuestions: () => apiClient.get('/assessment/questionnaire'),
  submitResponses: (answers) => apiClient.post('/assessment/submit', { answers }),
};

export default assessmentApi;
