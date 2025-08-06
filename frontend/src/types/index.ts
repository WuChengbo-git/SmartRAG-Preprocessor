export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  uploadTime: string;
  chunks?: number;
}

export interface Task {
  id: string;
  type: 'upload' | 'process' | 'export';
  fileName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  error?: string;
  details?: string;
}

export interface ChunkConfig {
  chunkSize: number;
  chunkOverlap: number;
  chunkMethod: 'paragraph' | 'page' | 'heading' | 'sentence' | 'token';
}

export interface ExportConfig {
  format: 'json' | 'dify' | 'elasticsearch';
  schema: string;
  includeMetadata: boolean;
}

export interface ProcessingTask {
  id: string;
  fileName: string;
  fileType: string;
  status: 'waiting' | 'processing' | 'completed' | 'failed';
  progress: number;
  chunks: number;
  totalChunks: number;
  config: ChunkConfig;
  startTime?: string;
  endTime?: string;
  error?: string;
}

export interface ExportTask {
  id: string;
  fileName: string;
  exportType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdTime: string;
  completedTime?: string;
  downloadUrl?: string;
  error?: string;
}

export interface Chunk {
  id: number;
  content: string;
  html?: string;
  markdown?: string;
  metadata: {
    page: number;
    type: string;
    tokens: number;
    [key: string]: any;
  };
}

export interface Settings {
  maxFileSize: number;
  concurrentTasks: number;
  language: string;
  autoSave: boolean;
  debugMode: boolean;
  defaultChunkSize: number;
  defaultOverlap: number;
  defaultChunkMethod: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface FileUploadResponse {
  filename: string;
  contentType: string;
  size: number;
  status: string;
  fileId?: string;
}

export interface ProcessingResponse {
  fileId: string;
  config: ChunkConfig;
  status: string;
  chunks: Chunk[];
  taskId?: string;
}

export interface ExportResponse {
  fileId: string;
  exportUrl: string;
  config: ExportConfig;
  status: string;
}