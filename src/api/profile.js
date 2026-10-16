import api from './axios';

export const profileApi = {
  getProfile: () => api.get('/profile/'),
  updateProfile: (formData) => api.patch('/profile/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
