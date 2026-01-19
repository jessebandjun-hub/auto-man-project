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
  getOne: (id: string) => api.get<Project>(`/projects/${id}`).then((res) => res.data),
  create: (data: { name: string; description?: string }) =>
    api.post<Project>('/projects', data).then((res) => res.data),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.patch<Project>(`/projects/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const episodesApi = {
  getAll: (projectId: string) => api.get<Episode[]>('/episodes', { params: { projectId } }).then((res) => res.data),
  create: (data: { title: string; sortOrder: number; projectId: string }) =>
    api.post<Episode>('/episodes', data).then((res) => res.data),
  update: (id: string, data: Partial<Episode>) =>
    api.patch<Episode>(`/episodes/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/episodes/${id}`),
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

export interface Episode {
  id: string;
  title: string;
  sortOrder: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}
