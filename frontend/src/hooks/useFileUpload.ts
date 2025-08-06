import { useState, useCallback } from 'react';
import { message } from 'antd';
import { fileAPI } from '../utils/api';
import { useAppStore } from '../stores/useAppStore';
import { validateFileType, validateFileSize, generateId } from '../utils/helpers';
import type { FileItem } from '../types';

interface UseFileUploadOptions {
  maxFileSize?: number;
  onUploadStart?: (file: File) => void;
  onUploadProgress?: (file: File, progress: number) => void;
  onUploadSuccess?: (file: File, response: any) => void;
  onUploadError?: (file: File, error: any) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const [uploading, setUploading] = useState(false);
  const { addFile, updateFile, settings } = useAppStore();
  const { maxFileSize = settings.maxFileSize } = options;

  const uploadFile = useCallback(async (file: File) => {
    // Validate file type
    if (!validateFileType(file)) {
      message.error(`${file.name}: サポートされていないファイル形式です`);
      return false;
    }

    // Validate file size
    if (!validateFileSize(file, maxFileSize)) {
      message.error(`${file.name}: ファイルサイズが ${maxFileSize}MB を超えています`);
      return false;
    }

    const fileId = generateId();
    const fileItem: FileItem = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading',
      progress: 0,
      uploadTime: new Date().toLocaleString('ja-JP'),
    };

    // Add file to store
    addFile(fileItem);
    options.onUploadStart?.(file);

    try {
      setUploading(true);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        updateFile(fileId, {
          progress: Math.min(fileItem.progress + Math.random() * 20, 90),
        });
      }, 500);

      // Upload file
      const response = await fileAPI.uploadFile(file);

      // Clear progress interval
      clearInterval(progressInterval);

      // Update file status
      updateFile(fileId, {
        status: 'done',
        progress: 100,
      });

      options.onUploadSuccess?.(file, response.data);
      message.success(`${file.name} のアップロードが完了しました`);
      return true;
    } catch (error: any) {
      updateFile(fileId, {
        status: 'error',
        progress: 0,
      });

      options.onUploadError?.(file, error);
      message.error(`${file.name} のアップロードに失敗しました`);
      return false;
    } finally {
      setUploading(false);
    }
  }, [addFile, updateFile, maxFileSize, options]);

  const uploadMultipleFiles = useCallback(async (files: File[]) => {
    const results = await Promise.allSettled(
      files.map(file => uploadFile(file))
    );

    const successCount = results.filter(
      result => result.status === 'fulfilled' && result.value
    ).length;

    const failCount = files.length - successCount;

    if (successCount > 0) {
      message.success(`${successCount} ファイルのアップロードが完了しました`);
    }

    if (failCount > 0) {
      message.error(`${failCount} ファイルのアップロードに失敗しました`);
    }

    return { successCount, failCount };
  }, [uploadFile]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    uploadMultipleFiles(files);
  }, [uploadMultipleFiles]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    uploadMultipleFiles(files);
  }, [uploadMultipleFiles]);

  return {
    uploading,
    uploadFile,
    uploadMultipleFiles,
    handleDrop,
    handleFileSelect,
  };
};