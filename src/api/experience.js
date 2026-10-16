import api from './axios';

export const experienceApi = {
  getExperiences: () => api.get('/experiences/'),
  createExperience: (data) => api.post('/experiences/', data),
  updateExperience: (id, data) => api.patch(`/experiences/${id}/`, data),
  deleteExperience: (id) => api.delete(`/experiences/${id}/`),
};

export const educationApi = {
  getEducation: () => api.get('/education/'),
  createEducation: (data) => api.post('/education/', data),
  updateEducation: (id, data) => api.patch(`/education/${id}/`, data),
  deleteEducation: (id) => api.delete(`/education/${id}/`),
};
