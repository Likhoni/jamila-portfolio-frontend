import api from './axios';

export const taxonomyApi = {
  getCategories: () => api.get('/categories/'),
  createCategory: (data) => api.post('/categories/', data),
  updateCategory: (slug, data) => api.patch(`/categories/${slug}/`, data),
  deleteCategory: (slug) => api.delete(`/categories/${slug}/`),

  getTags: () => api.get('/tags/'),
  createTag: (data) => api.post('/tags/', data),
  updateTag: (slug, data) => api.patch(`/tags/${slug}/`, data),
  deleteTag: (slug) => api.delete(`/tags/${slug}/`),
};
