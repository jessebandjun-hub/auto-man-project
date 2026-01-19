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
  
  // Script methods
  getScript: (id: string) => api.get<string>(`/projects/${id}/script`).then((res) => res.data),
  updateScript: (id: string, content: string) => 
    api.patch<{script: string}>(`/projects/${id}/script`, { content }).then((res) => res.data),
  generateScript: (id: string, idea: string, genre: string) =>
    api.post<{script: string}>(`/projects/${id}/script/generate`, { idea, genre }).then((res) => res.data),
};

export const episodesApi = {
  getAll: (projectId: string) => api.get<Episode[]>('/episodes', { params: { projectId } }).then((res) => res.data),
  create: (data: { title: string; sortOrder: number; projectId: string }) =>
    api.post<Episode>('/episodes', data).then((res) => res.data),
  update: (id: string, data: Partial<Episode>) =>
    api.patch<Episode>(`/episodes/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/episodes/${id}`),
};

export const charactersApi = {
  getAll: (projectId: string) => 
    api.get<Character[]>(`/projects/${projectId}/characters`).then((res) => res.data),
  extract: (projectId: string) => 
    api.post<Character[]>(`/projects/${projectId}/characters/extract`).then((res) => res.data),
  create: (data: Partial<Character>) => 
    api.post<Character>('/characters', data).then((res) => res.data),
  update: (id: string, data: Partial<Character>) => 
    api.patch<Character>(`/characters/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/characters/${id}`),
  generateAvatar: (id: string, promptAdjustment?: string) => 
    api.post<{avatarUrl: string}>(`/characters/${id}/avatar/generate`, { prompt_adjustment: promptAdjustment }).then((res) => res.data),
  lock: (id: string, selectedImageUrl: string, finalTags?: string) => 
    api.post<Character>(`/characters/${id}/lock`, { selectedImageUrl, finalTags }).then((res) => res.data),
};

export const storyboardsApi = {
  autoSplit: (episodeId: string) => 
    api.post<Storyboard[]>(`/episodes/${episodeId}/storyboards/auto`).then((res) => res.data),
  getAll: (episodeId: string) => 
    api.get<Storyboard[]>(`/episodes/${episodeId}/storyboards`).then((res) => res.data),
  update: (id: string, data: Partial<Storyboard>) => 
    api.patch<Storyboard>(`/storyboards/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/storyboards/${id}`),
  generateImage: (id: string, useRefImage: boolean = true) => 
    api.post<Storyboard>(`/storyboards/${id}/image/generate`, { useRefImage }).then((res) => res.data),
  refineImage: (id: string, instruction: string) => 
    api.post<Storyboard>(`/storyboards/${id}/refine`, { instruction }).then((res) => res.data),
};

export interface Project {
  id: string;
  name: string;
  description?: string;
  script?: string;
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

export interface Character {
  id: string;
  name: string;
  description: string;
  tags?: string;
  avatarUrl?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Storyboard {
  id: string;
  episodeId: string;
  sortOrder: number;
  shotType?: string;
  action?: string;
  dialogue?: string;
  prompt?: string;
  imageUrl?: string;
  status: 'DRAFT' | 'GENERATING' | 'DONE';
  createdAt: string;
  updatedAt: string;
}
