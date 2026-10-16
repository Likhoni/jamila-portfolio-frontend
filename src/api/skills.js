import api from './axios';

export const skillsApi = {
  getSkills: (params) => api.get('/skills/', { params }),
  createSkill: (data) => api.post('/skills/', data),
  updateSkill: (id, data) => api.patch(`/skills/${id}/`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}/`),
};
