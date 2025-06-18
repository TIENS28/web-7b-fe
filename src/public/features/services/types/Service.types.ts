/**
 * Public Services Types
 * Types cho trang dịch vụ công khai
 */

export interface PublicService {
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
  image?: string;
  features?: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  services: PublicService[];
  originalPrice: number;
  discountPrice: number;
  discount: number; // percentage
  currency: string;
  isPopular: boolean;
  features: string[];
  duration: number; // tổng thời gian
}

export interface VaccinationService {
  id: string;
  name: string;
  vaccineType: string;
  description: string;
  ageGroup: string;
  price: number;
  currency: string;
  manufacturer: string;
  country: string;
  storage: string;
  sideEffects?: string[];
  contraindications?: string[];
  image?: string;
  isAvailable: boolean;
}

// API Response types
export interface PublicServicesResponse {
  success: boolean;
  data: {
    services: PublicService[];
    categories: ServiceCategory[];
    departments: Department[];
  };
  message: string;
}

export interface ServicePackagesResponse {
  success: boolean;
  data: {
    packages: ServicePackage[];
  };
  message: string;
}

export interface VaccinationServicesResponse {
  success: boolean;
  data: {
    vaccines: VaccinationService[];
  };
  message: string;
} 
