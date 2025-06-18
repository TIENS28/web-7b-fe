import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'shared/components';
import { DoctorListPage, DoctorDetailPage } from './pages';

// Error fallback cho doctors feature
const DoctorsErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi trang đội ngũ bác sĩ</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{error.message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tải lại
      </button>
    </div>
  </div>
);

/**
 * Router cho doctors feature
 * Quản lý routing cho các trang liên quan đến đội ngũ bác sĩ
 */
export default function DoctorsRouter() {
  return (
    <ErrorBoundary fallback={DoctorsErrorFallback}>
      <Routes>
        <Route path="/" element={<DoctorListPage />} />
        <Route path="/:slug" element={<DoctorDetailPage />} />
      </Routes>
    </ErrorBoundary>
  );
} 