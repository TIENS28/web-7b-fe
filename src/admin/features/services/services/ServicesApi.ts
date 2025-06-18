/**
 * Services API
 * API calls cho quản lý dịch vụ y tế
 */

import axiosInstance from 'shared/lib/apiInstance';
import type {
  Service,
  ServiceListResponse,
  ServiceDetailResponse,
  ServiceCreateRequest,
  ServiceUpdateRequest,
  ServicesQueryParams,
  ServiceCategory,
  Department,
  ServicePrice
} from '../types/Service.types';

const BASE_URL = '/services';

export const servicesApi = {
  /**
   * Lấy danh sách dịch vụ
   */
  getServices: async (params?: ServicesQueryParams): Promise<ServiceListResponse> => {
    const response = await axiosInstance.get<ServiceListResponse>(BASE_URL, { params });
    return response.data;
  },

  /**
   * Lấy chi tiết dịch vụ
   */
  getService: async (id: string): Promise<ServiceDetailResponse> => {
    const response = await axiosInstance.get<ServiceDetailResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Tạo dịch vụ mới
   */
  createService: async (data: ServiceCreateRequest): Promise<ServiceDetailResponse> => {
    const response = await axiosInstance.post<ServiceDetailResponse>(BASE_URL, data);
    return response.data;
  },

  /**
   * Cập nhật dịch vụ
   */
  updateService: async (id: string, data: ServiceUpdateRequest): Promise<ServiceDetailResponse> => {
    const response = await axiosInstance.put<ServiceDetailResponse>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Xóa dịch vụ
   */
  deleteService: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Toggle trạng thái active của dịch vụ
   */
  toggleServiceStatus: async (id: string, isActive: boolean): Promise<ServiceDetailResponse> => {
    const response = await axiosInstance.patch<ServiceDetailResponse>(`${BASE_URL}/${id}/status`, { isActive });
    return response.data;
  },

  /**
   * Lấy danh sách categories
   */
  getCategories: async (): Promise<ServiceCategory[]> => {
    const response = await axiosInstance.get<ServiceCategory[]>('/service-categories');
    return response.data;
  },

  /**
   * Lấy danh sách departments
   */
  getDepartments: async (): Promise<Department[]> => {
    const response = await axiosInstance.get<Department[]>('/departments');
    return response.data;
  },

  /**
   * Lấy giá dịch vụ
   */
  getServicePrices: async (serviceId: string): Promise<ServicePrice[]> => {
    const response = await axiosInstance.get<ServicePrice[]>(`${BASE_URL}/${serviceId}/prices`);
    return response.data;
  },
};

// Mock data cho development
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Khám tổng quát',
    code: 'KTQ001',
    description: 'Khám sức khỏe tổng quát cho người lớn',
    category: {
      id: '1',
      name: 'Khám bệnh',
      code: 'KB',
      description: 'Dịch vụ khám bệnh',
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
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    createdBy: 'admin',
  },
  {
    id: '2',
    name: 'Xét nghiệm máu tổng quát',
    code: 'XN001',
    description: 'Xét nghiệm công thức máu toàn phần',
    category: {
      id: '2',
      name: 'Xét nghiệm',
      code: 'XN',
      description: 'Dịch vụ xét nghiệm',
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
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    createdBy: 'admin',
  },
  {
    id: '3',
    name: 'Siêu âm bụng tổng quát',
    code: 'SA001',
    description: 'Siêu âm toàn bộ ổ bụng',
    category: {
      id: '3',
      name: 'Chẩn đoán hình ảnh',
      code: 'CDHA',
      description: 'Dịch vụ chẩn đoán hình ảnh',
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
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
    createdBy: 'admin',
  },
];

export default servicesApi; 
