import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import jaJP from 'antd/locale/ja_JP';
import Layout from './components/Layout';
import './App.css';
import Dashboard from './pages/Dashboard';
import FileUpload from './pages/FileUpload';
import Processing from './pages/Processing';
import Editor from './pages/Editor';
import Export from './pages/Export';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={jaJP}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<FileUpload />} />
              <Route path="/processing" element={<Processing />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/export" element={<Export />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
