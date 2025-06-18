// ✅ Pages
export { default as DoctorListPage } from './pages/DoctorListPage';
export { default as DoctorDetailPage } from './pages/DoctorDetailPage';

// ✅ Types
export type { Doctor, DoctorFilters } from 'shared/types/Doctor.types';

// ✅ Data
export { doctorsData, getDoctorBySlug, getDoctorsByFilter } from 'shared/data/doctors'; 