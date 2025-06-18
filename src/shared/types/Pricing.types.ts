/**
 * Interface cho giá dịch vụ khám bệnh
 */
export interface MedicalServicePrice {
  id: string;
  code: string;
  name: string;
  unit: string;
  price: number;
  currency: string;
  category: string;
  subcategory?: string;
  note?: string;
  effectiveDate: string;
  isActive: boolean;
}

/**
 * Interface cho giá tiêm vaccine
 */
export interface VaccinePrice {
  id: string;
  code: string;
  vaccineName: string;
  diseaseType: string;
  manufacturer: string;
  origin: string;
  ageGroup: string;
  price: number;
  currency: string;
  serviceCharge: number;
  totalPrice: number;
  note?: string;
  effectiveDate: string;
  isAvailable: boolean;
}

/**
 * Interface cho giá thuốc và vật tư y tế
 */
export interface DrugPrice {
  id: string;
  code: string;
  name: string;
  ingredient: string;
  form: string;
  strength: string;
  unit: string;
  price: number;
  currency: string;
  manufacturer: string;
  origin: string;
  category: 'thuoc' | 'vtyt';
  subcategory?: string;
  note?: string;
  effectiveDate: string;
  isActive: boolean;
}

/**
 * Interface cho banner slider
 */
export interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  cta?: {
    text: string;
    link: string;
  };
}

/**
 * Interface cho filter pricing
 */
export interface PricingFilters {
  category?: string;
  subcategory?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  search?: string;
} 