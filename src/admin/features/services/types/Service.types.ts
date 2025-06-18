/**
 * Service Types
 * Định nghĩa các types cho quản lý dịch vụ y tế
 */

export interface Service {
  id: string;
  name: string;
  code: string;
  description?: string;
  category: ServiceCategory;
  basePrice: number;
  currency: string;
  duration: number; // phút
  isActive: boolean;
  department: Department;
  requirements?: string[];
  preparations?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface ServicePrice {
  id: string;
  serviceId: string;
  service?: Service;
  priceType: 'NORMAL' | 'VIP' | 'EMERGENCY' | 'INSURANCE';
  price: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Request/Response types
export interface ServiceListResponse {
  success: boolean;
  message: string;
  data: {
    services: Service[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  };
  timestamp: string;
  statusCode: number;
}

export interface ServiceDetailResponse {
  success: boolean;
  message: string;
  data: Service;
  timestamp: string;
  statusCode: number;
}

export interface ServiceCreateRequest {
  name: string;
  code: string;
  description?: string;
  categoryId: string;
  basePrice: number;
  currency: string;
  duration: number;
  departmentId: string;
  requirements?: string[];
  preparations?: string[];
  isActive?: boolean;
}

export interface ServiceUpdateRequest extends Partial<ServiceCreateRequest> {
  id: string;
}

// Query parameters
export interface ServicesQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  departmentId?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'code' | 'basePrice' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
} 
