/**
 * Services Feature Entry Point
 * Export tất cả public interfaces của Services feature
 */

// Pages
export { default as ServiceListPage } from './pages/ServiceListPage';

// Types
export type {
  Service,
  ServiceCategory,
  Department,
  ServicePrice,
  ServiceListResponse,
  ServiceDetailResponse,
  ServiceCreateRequest,
  ServiceUpdateRequest,
  ServicesQueryParams
} from './types/Service.types';

// Hooks
export {
  useServices,
  useService,
  useServiceCategories,
  useDepartments,
  useServicePrices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useToggleServiceStatus,
  SERVICE_QUERY_KEYS
} from './hooks/useServices';

// API
export { servicesApi, mockServices } from './services/ServicesApi'; 
