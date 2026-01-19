import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', // Vite proxy will handle this
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects').then((res) => res.data),
  create: (data: { name: string; description?: string }) =>
    api.post<Project>('/projects', data).then((res) => res.data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    episodes: number;
  };
}
