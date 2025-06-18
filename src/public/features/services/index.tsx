/**
 * Public Services Feature Entry Point
 * Export tất cả components, types, và services của Services feature
 */

// ✅ Pages
export { default as ServicesPage } from './pages/ServicesPage';

// ✅ Components (when added)
// export { ServiceCard, ServiceList, ServiceFilter } from './components';

// ✅ Hooks (when added)
// export { useServices, useService } from './hooks';

// ✅ Services
export {
  default as publicServicesApi,
  mockPublicServices,
  mockServicePackages,
  mockVaccinationServices,
} from './services/ServicesApi';

// ✅ Types
export type {
  PublicService,
  ServiceCategory,
  Department,
  ServicePackage,
  VaccinationService,
  PublicServicesResponse,
  ServicePackagesResponse,
  VaccinationServicesResponse,
} from './types/Service.types';

// ✅ Router
export { default as ServicesRouter } from './router'; 
