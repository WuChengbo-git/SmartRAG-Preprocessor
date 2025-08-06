import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  uploadTime: string;
  chunks?: number;
}

interface Task {
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

interface AppState {
  // Files
  files: FileItem[];
  selectedFiles: string[];
  
  // Tasks
  tasks: Task[];
  activeTasks: number;
  
  // Settings
  settings: {
    maxFileSize: number;
    concurrentTasks: number;
    language: string;
    autoSave: boolean;
    debugMode: boolean;
    defaultChunkSize: number;
    defaultOverlap: number;
    defaultChunkMethod: string;
  };
  
  // UI State
  sidebarCollapsed: boolean;
  currentPage: string;
  
  // Actions
  addFile: (file: FileItem) => void;
  updateFile: (id: string, updates: Partial<FileItem>) => void;
  removeFile: (id: string) => void;
  setSelectedFiles: (fileIds: string[]) => void;
  
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  
  updateSettings: (updates: Partial<AppState['settings']>) => void;
  
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentPage: (page: string) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        files: [],
        selectedFiles: [],
        tasks: [],
        activeTasks: 0,
        
        settings: {
          maxFileSize: 100,
          concurrentTasks: 3,
          language: 'ja',
          autoSave: true,
          debugMode: false,
          defaultChunkSize: 500,
          defaultOverlap: 50,
          defaultChunkMethod: 'paragraph',
        },
        
        sidebarCollapsed: false,
        currentPage: 'dashboard',
        
        // Actions
        addFile: (file) =>
          set((state) => ({
            files: [...state.files, file],
          })),
        
        updateFile: (id, updates) =>
          set((state) => ({
            files: state.files.map((file) =>
              file.id === id ? { ...file, ...updates } : file
            ),
          })),
        
        removeFile: (id) =>
          set((state) => ({
            files: state.files.filter((file) => file.id !== id),
            selectedFiles: state.selectedFiles.filter((fileId) => fileId !== id),
          })),
        
        setSelectedFiles: (fileIds) =>
          set(() => ({
            selectedFiles: fileIds,
          })),
        
        addTask: (task) =>
          set((state) => ({
            tasks: [...state.tasks, task],
            activeTasks: state.activeTasks + (task.status === 'running' ? 1 : 0),
          })),
        
        updateTask: (id, updates) =>
          set((state) => {
            const oldTask = state.tasks.find(t => t.id === id);
            const newStatus = updates.status;
            let activeTasksDelta = 0;
            
            if (oldTask) {
              if (oldTask.status === 'running' && newStatus !== 'running') {
                activeTasksDelta = -1;
              } else if (oldTask.status !== 'running' && newStatus === 'running') {
                activeTasksDelta = 1;
              }
            }
            
            return {
              tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, ...updates } : task
              ),
              activeTasks: state.activeTasks + activeTasksDelta,
            };
          }),
        
        removeTask: (id) =>
          set((state) => {
            const task = state.tasks.find(t => t.id === id);
            const activeTasksDelta = task?.status === 'running' ? -1 : 0;
            
            return {
              tasks: state.tasks.filter((task) => task.id !== id),
              activeTasks: state.activeTasks + activeTasksDelta,
            };
          }),
        
        updateSettings: (updates) =>
          set((state) => ({
            settings: { ...state.settings, ...updates },
          })),
        
        setSidebarCollapsed: (collapsed) =>
          set(() => ({
            sidebarCollapsed: collapsed,
          })),
        
        setCurrentPage: (page) =>
          set(() => ({
            currentPage: page,
          })),
      }),
      {
        name: 'smartrag-app-store',
        partialize: (state) => ({
          settings: state.settings,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      }
    ),
    {
      name: 'smartrag-app-store',
    }
  )
);

// Selectors
export const useFiles = () => useAppStore((state) => state.files);
export const useSelectedFiles = () => useAppStore((state) => state.selectedFiles);
export const useTasks = () => useAppStore((state) => state.tasks);
export const useActiveTasks = () => useAppStore((state) => state.activeTasks);
export const useSettings = () => useAppStore((state) => state.settings);
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed);

// Computed selectors
export const useFileStats = () => {
  const files = useFiles();
  return {
    total: files.length,
    uploading: files.filter(f => f.status === 'uploading').length,
    completed: files.filter(f => f.status === 'done').length,
    failed: files.filter(f => f.status === 'error').length,
  };
};

export const useTaskStats = () => {
  const tasks = useTasks();
  return {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    cancelled: tasks.filter(t => t.status === 'cancelled').length,
  };
};