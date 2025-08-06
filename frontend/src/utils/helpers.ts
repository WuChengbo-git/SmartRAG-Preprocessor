import type { FileItem, Task } from '../types';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}秒`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}時間${minutes}分${remainingSeconds}秒`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const getFileIcon = (type: string): string => {
  if (type.includes('pdf')) return 'file-pdf';
  if (type.includes('word')) return 'file-word';
  if (type.includes('excel')) return 'file-excel';
  if (type.includes('presentation')) return 'file-powerpoint';
  if (type.includes('text')) return 'file-text';
  if (type.includes('html')) return 'file-code';
  if (type.includes('csv')) return 'file-csv';
  return 'file';
};

export const getFileTypeColor = (type: string): string => {
  if (type.includes('pdf')) return '#ff4d4f';
  if (type.includes('word')) return '#1890ff';
  if (type.includes('excel')) return '#52c41a';
  if (type.includes('presentation')) return '#fa8c16';
  if (type.includes('text')) return '#722ed1';
  if (type.includes('html')) return '#13c2c2';
  if (type.includes('csv')) return '#eb2f96';
  return '#8c8c8c';
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
    case 'done':
      return 'success';
    case 'processing':
    case 'uploading':
    case 'running':
      return 'processing';
    case 'failed':
    case 'error':
      return 'error';
    case 'cancelled':
      return 'default';
    case 'pending':
    case 'waiting':
      return 'warning';
    default:
      return 'default';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'completed':
    case 'done':
      return '完了';
    case 'processing':
    case 'uploading':
      return 'アップロード中';
    case 'running':
      return '実行中';
    case 'failed':
    case 'error':
      return '失敗';
    case 'cancelled':
      return 'キャンセル';
    case 'pending':
    case 'waiting':
      return '待機中';
    default:
      return '不明';
  }
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/html',
    'text/csv',
    'application/vnd.ms-excel',
  ];
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number = 100): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};

export const filterFilesByStatus = (files: FileItem[], status: string): FileItem[] => {
  if (status === 'all') return files;
  return files.filter(file => file.status === status);
};

export const filterTasksByStatus = (tasks: Task[], status: string): Task[] => {
  if (status === 'all') return tasks;
  return tasks.filter(task => task.status === status);
};

export const sortFilesByDate = (files: FileItem[], ascending: boolean = false): FileItem[] => {
  return [...files].sort((a, b) => {
    const dateA = new Date(a.uploadTime).getTime();
    const dateB = new Date(b.uploadTime).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const sortTasksByDate = (tasks: Task[], ascending: boolean = false): Task[] => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.startTime).getTime();
    const dateB = new Date(b.startTime).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};