import api from './axios';

export const commentsApi = {
  getModerationComments: (params) => api.get('/comments/', { params }),
  updateComment: (id, data) => api.patch(`/comments/${id}/`, data),
  deleteComment: (id) => api.delete(`/comments/${id}/`),
};
