import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: (refresh) => api.post('/auth/logout/', { refresh }),
  getMe: () => api.get('/auth/me/'),
  changePassword: (data) => api.post('/auth/change-password/', data),
};
