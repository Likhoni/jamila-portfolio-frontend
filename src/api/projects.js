import api from './axios';

export const projectsApi = {
  getProjects: (params) => api.get('/projects/', { params }),
  getProject: (slug) => api.get(`/projects/${slug}/`),
  createProject: (formData) => api.post('/projects/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateProject: (slug, formData) => api.patch(`/projects/${slug}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteProject: (slug) => api.delete(`/projects/${slug}/`),
};
