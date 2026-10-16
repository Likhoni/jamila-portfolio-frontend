import api from './axios';

export const contactApi = {
  submitContact: (data) => api.post('/contact/', data),
  getMessages: (params) => api.get('/contact/', { params }),
  updateMessage: (id, data) => api.patch(`/contact/${id}/`, data),
  deleteMessage: (id) => api.delete(`/contact/${id}/`),
};
