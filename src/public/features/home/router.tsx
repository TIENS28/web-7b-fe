import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'shared/components';
import HomePage from './pages/HomePage';

// Error fallback cho home feature
const HomeErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi trang chủ</h1>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tải lại
      </button>
    </div>
  </div>
);

export default function HomeRouter() {
  return (
    <ErrorBoundary fallback={HomeErrorFallback}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </ErrorBoundary>
  );
} 
