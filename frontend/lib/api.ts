import axios from 'axios';

// Change this if your backend is running on a different port (check your backend terminal)
const API_BASE_URL = 'http://localhost:5186/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const imageApi = {
  // Get all images
  getAll: () => api.get('/Images'),
  
  // Upload image
  upload: (formData: FormData) => api.post('/Images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Update metadata
  update: (id: string, data: any) => api.put(`/Images/${id}`, data),
  
  // Generate overlay
  generateOverlay: (id: string) => api.post(`/Images/${id}/overlay`),
  
  // Delete image
  delete: (id: string) => api.delete(`/Images/${id}`),
};

export default api;