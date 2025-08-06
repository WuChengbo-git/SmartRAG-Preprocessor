import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const fileAPI = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  uploadFiles: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return api.post('/upload/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getFiles: () => api.get('/upload/files'),
  
  deleteFile: (fileId: string) => api.delete(`/upload/files/${fileId}`),
};

export const processingAPI = {
  processDocument: (fileId: string, config: any) => 
    api.post(`/processing/chunk?file_id=${fileId}`, config),
  
  getTaskStatus: (taskId: string) => 
    api.get(`/processing/task/${taskId}`),
  
  getTasks: () => api.get('/processing/tasks'),
  
  previewChunks: (fileId: string) => 
    api.post('/processing/preview', { file_id: fileId }),
  
  pauseTask: (taskId: string) => 
    api.post(`/processing/task/${taskId}/pause`),
  
  resumeTask: (taskId: string) => 
    api.post(`/processing/task/${taskId}/resume`),
};

export const exportAPI = {
  exportToJson: (fileId: string, config: any) => 
    api.post(`/export/json?file_id=${fileId}`, config),
  
  exportToDify: (fileId: string, config: any) => 
    api.post(`/export/dify?file_id=${fileId}`, config),
  
  exportToElasticsearch: (fileId: string, config: any) => 
    api.post(`/export/elasticsearch?file_id=${fileId}`, config),
  
  downloadJson: (fileId: string) => 
    api.get(`/export/download/${fileId}.json`),
  
  getExportSchemas: () => api.get('/export/schemas'),
};

export const healthAPI = {
  checkHealth: () => api.get('/health', { baseURL: API_BASE_URL }),
};

export default api;