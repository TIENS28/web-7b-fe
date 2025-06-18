/**
 * Public Services API
 * API calls cho trang dịch vụ công khai
 */

import axiosInstance from 'shared/lib/apiInstance';
import type {
  PublicServicesResponse,
  ServicePackagesResponse,
  VaccinationServicesResponse,
  PublicService,
  ServicePackage,
  VaccinationService,
} from '../types/Service.types';

export const publicServicesApi = {
  /**
   * Lấy danh sách dịch vụ công khai
   */
  getServices: async (): Promise<PublicServicesResponse> => {
    const response = await axiosInstance.get<PublicServicesResponse>('/public/services');
    return response.data;
  },

  /**
   * Lấy danh sách gói dịch vụ
   */
  getServicePackages: async (): Promise<ServicePackagesResponse> => {
    const response = await axiosInstance.get<ServicePackagesResponse>('/public/service-packages');
    return response.data;
  },

  /**
   * Lấy danh sách dịch vụ tiêm chủng
   */
  getVaccinationServices: async (): Promise<VaccinationServicesResponse> => {
    const response = await axiosInstance.get<VaccinationServicesResponse>('/public/vaccinations');
    return response.data;
  },
};

// Mock data cho development
export const mockPublicServices: PublicService[] = [
  {
    id: '1',
    name: 'Khám tổng quát',
    code: 'KTQ001',
    description: 'Khám sức khỏe tổng quát cho người lớn với đội ngũ bác sĩ giàu kinh nghiệm',
    category: {
      id: '1',
      name: 'Khám bệnh',
      code: 'KB',
      description: 'Dịch vụ khám bệnh',
      icon: '🩺',
      isActive: true
    },
    basePrice: 200000,
    currency: 'VND',
    duration: 30,
    isActive: true,
    department: {
      id: '1',
      name: 'Khoa Nội',
      code: 'NOI',
      description: 'Khoa Nội tổng hợp',
      isActive: true
    },
    requirements: ['Mang theo CCCD/CMND', 'Nhịn ăn 8 tiếng nếu có xét nghiệm'],
    preparations: ['Nghỉ ngơi đầy đủ trước khi khám'],
    image: '/images/services/kham-tong-quat.jpg',
    features: ['Khám lâm sàng tổng quát', 'Tư vấn sức khỏe', 'Hướng dẫn chăm sóc'],
  },
  {
    id: '2',
    name: 'Xét nghiệm máu tổng quát',
    code: 'XN001',
    description: 'Xét nghiệm công thức máu toàn phần với kết quả nhanh chóng và chính xác',
    category: {
      id: '2',
      name: 'Xét nghiệm',
      code: 'XN',
      description: 'Dịch vụ xét nghiệm',
      icon: '🧪',
      isActive: true
    },
    basePrice: 150000,
    currency: 'VND',
    duration: 15,
    isActive: true,
    department: {
      id: '2',
      name: 'Khoa Xét nghiệm',
      code: 'XN',
      description: 'Khoa Xét nghiệm',
      isActive: true
    },
    requirements: ['Nhịn ăn 8-12 tiếng'],
    preparations: ['Uống đủ nước', 'Nghỉ ngơi tốt'],
    image: '/images/services/xet-nghiem-mau.jpg',
    features: ['Kết quả trong 30 phút', 'Báo cáo chi tiết', 'Tư vấn kết quả'],
  },
  {
    id: '3',
    name: 'Siêu âm bụng tổng quát',
    code: 'SA001',
    description: 'Siêu âm toàn bộ ổ bụng với máy móc hiện đại, hình ảnh rõ nét',
    category: {
      id: '3',
      name: 'Chẩn đoán hình ảnh',
      code: 'CDHA',
      description: 'Dịch vụ chẩn đoán hình ảnh',
      icon: '📷',
      isActive: true
    },
    basePrice: 300000,
    currency: 'VND',
    duration: 20,
    isActive: true,
    department: {
      id: '3',
      name: 'Khoa Chẩn đoán hình ảnh',
      code: 'CDHA',
      description: 'Khoa Chẩn đoán hình ảnh',
      isActive: true
    },
    requirements: ['Nhịn ăn 6 tiếng', 'Uống đầy bàng quang'],
    preparations: ['Không ăn uống 6 tiếng trước khám'],
    image: '/images/services/sieu-am-bung.jpg',
    features: ['Máy siêu âm 4D hiện đại', 'Bác sĩ chuyên khoa', 'Kết quả ngay'],
  },
];

export const mockServicePackages: ServicePackage[] = [
  {
    id: '1',
    name: 'Gói khám sức khỏe cơ bản',
    description: 'Gói khám sức khỏe toàn diện cho người trưởng thành',
    services: [mockPublicServices[0], mockPublicServices[1]],
    originalPrice: 350000,
    discountPrice: 300000,
    discount: 15,
    currency: 'VND',
    isPopular: true,
    features: [
      'Khám lâm sàng tổng quát',
      'Xét nghiệm máu cơ bản',
      'Tư vấn sức khỏe',
      'Báo cáo chi tiết',
      'Theo dõi sau khám'
    ],
    duration: 45,
  },
  {
    id: '2',
    name: 'Gói khám sức khỏe nâng cao',
    description: 'Gói khám sức khỏe toàn diện với nhiều dịch vụ',
    services: mockPublicServices,
    originalPrice: 650000,
    discountPrice: 550000,
    discount: 15,
    currency: 'VND',
    isPopular: false,
    features: [
      'Khám lâm sàng tổng quát',
      'Xét nghiệm máu chi tiết',
      'Siêu âm tổng quát',
      'Tư vấn dinh dưỡng',
      'Báo cáo sức khỏe điện tử',
      'Theo dõi 6 tháng'
    ],
    duration: 65,
  },
];

export const mockVaccinationServices: VaccinationService[] = [
  {
    id: '1',
    name: 'Vắc xin COVID-19 (Pfizer)',
    vaccineType: 'mRNA',
    description: 'Vắc xin phòng COVID-19 của Pfizer-BioNTech, hiệu quả cao',
    ageGroup: 'Từ 12 tuổi trở lên',
    price: 350000,
    currency: 'VND',
    manufacturer: 'Pfizer-BioNTech',
    country: 'Đức/Mỹ',
    storage: 'Bảo quản -70°C',
    sideEffects: ['Đau tại chỗ tiêm', 'Sốt nhẹ', 'Mệt mỏi'],
    contraindications: ['Dị ứng thành phần vắc xin', 'Sốt cao'],
    image: '/images/vaccines/covid-pfizer.jpg',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Vắc xin cúm mùa',
    vaccineType: 'Inactivated',
    description: 'Vắc xin phòng cúm mùa, bảo vệ khỏi các chủng virus phổ biến',
    ageGroup: 'Từ 6 tháng tuổi',
    price: 200000,
    currency: 'VND',
    manufacturer: 'Sanofi Pasteur',
    country: 'Pháp',
    storage: 'Bảo quản 2-8°C',
    sideEffects: ['Đau nhẹ tại chỗ tiêm', 'Sốt nhẹ trong 1-2 ngày'],
    contraindications: ['Dị ứng trứng gà', 'Sốt cao', 'Bệnh nặng'],
    image: '/images/vaccines/cum-mua.jpg',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Vắc xin viêm gan B',
    vaccineType: 'Recombinant',
    description: 'Vắc xin phòng viêm gan B, bảo vệ lâu dài',
    ageGroup: 'Mọi lứa tuổi',
    price: 250000,
    currency: 'VND',
    manufacturer: 'GSK',
    country: 'Bỉ',
    storage: 'Bảo quản 2-8°C',
    sideEffects: ['Đau tại chỗ tiêm', 'Sốt nhẹ'],
    contraindications: ['Dị ứng men bia', 'Bệnh nặng'],
    image: '/images/vaccines/viem-gan-b.jpg',
    isAvailable: true,
  },
];

export default publicServicesApi; 
