/**
 * Custom hooks cho Services management
 * Sử dụng React Query để quản lý state và caching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { servicesApi, mockServices } from '../services/ServicesApi';
import type {
  ServicesQueryParams,
  ServiceCreateRequest,
  ServiceUpdateRequest,
} from '../types/Service.types';

// Query Keys
export const SERVICE_QUERY_KEYS = {
  all: ['services'] as const,
  lists: () => [...SERVICE_QUERY_KEYS.all, 'list'] as const,
  list: (params?: ServicesQueryParams) => [...SERVICE_QUERY_KEYS.lists(), { params }] as const,
  details: () => [...SERVICE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SERVICE_QUERY_KEYS.details(), id] as const,
  categories: () => [...SERVICE_QUERY_KEYS.all, 'categories'] as const,
  departments: () => [...SERVICE_QUERY_KEYS.all, 'departments'] as const,
  prices: (serviceId: string) => [...SERVICE_QUERY_KEYS.all, 'prices', serviceId] as const,
};

/**
 * Hook để lấy danh sách services với phân trang và filter
 */
export const useServices = (params?: ServicesQueryParams) => {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.list(params),
    queryFn: async () => {
      try {
        return await servicesApi.getServices(params);
      } catch (error) {
        // Fallback to mock data nếu API lỗi
        console.warn('API không khả dụng, sử dụng mock data:', error);
        return {
          success: true,
          message: 'Mock data',
          data: {
            services: mockServices,
            pagination: {
              total: mockServices.length,
              page: params?.page || 1,
              pageSize: params?.pageSize || 10,
              totalPages: Math.ceil(mockServices.length / (params?.pageSize || 10))
            }
          },
          timestamp: new Date().toISOString(),
          statusCode: 200
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

/**
 * Hook để lấy chi tiết service
 */
export const useService = (id: string) => {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.detail(id),
    queryFn: () => servicesApi.getService(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

/**
 * Hook để lấy danh sách categories
 */
export const useServiceCategories = () => {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.categories(),
    queryFn: () => servicesApi.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 phút - categories ít thay đổi
  });
};

/**
 * Hook để lấy danh sách departments
 */
export const useDepartments = () => {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.departments(),
    queryFn: () => servicesApi.getDepartments(),
    staleTime: 10 * 60 * 1000, // 10 phút - departments ít thay đổi
  });
};

/**
 * Hook để lấy giá dịch vụ
 */
export const useServicePrices = (serviceId: string) => {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.prices(serviceId),
    queryFn: () => servicesApi.getServicePrices(serviceId),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

/**
 * Hook để tạo service mới
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ServiceCreateRequest) => servicesApi.createService(data),
    onSuccess: () => {
      toast.success('Tạo dịch vụ thành công!');
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khi tạo dịch vụ: ${error.message}`);
    }
  });
};

/**
 * Hook để cập nhật service
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceUpdateRequest }) => 
      servicesApi.updateService(id, data),
    onSuccess: (_data, variables) => {
      toast.success('Cập nhật dịch vụ thành công!');
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.detail(variables.id) });
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khi cập nhật dịch vụ: ${error.message}`);
    }
  });
};

/**
 * Hook để xóa service
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicesApi.deleteService(id),
    onSuccess: () => {
      toast.success('Xóa dịch vụ thành công!');
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khi xóa dịch vụ: ${error.message}`);
    }
  });
};

/**
 * Hook để toggle status của service
 */
export const useToggleServiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      servicesApi.toggleServiceStatus(id, isActive),
    onSuccess: (_data, variables) => {
      const status = variables.isActive ? 'kích hoạt' : 'vô hiệu hóa';
      toast.success(`${status} dịch vụ thành công!`);
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.detail(variables.id) });
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khi thay đổi trạng thái dịch vụ: ${error.message}`);
    }
  });
}; 
