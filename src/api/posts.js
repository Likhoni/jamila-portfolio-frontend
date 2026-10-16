import api from './axios';

export const postsApi = {
  getPosts: (params) => api.get('/posts/', { params }),
  getPost: (slug) => api.get(`/posts/${slug}/`),
  createPost: (formData) => api.post('/posts/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updatePost: (slug, formData) => api.patch(`/posts/${slug}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deletePost: (slug) => api.delete(`/posts/${slug}/`),
  toggleLike: (slug) => api.post(`/posts/${slug}/like/`),
  getComments: (slug) => api.get(`/posts/${slug}/comments/`),
  createComment: (slug, data) => api.post(`/posts/${slug}/comments/`, data),
};
