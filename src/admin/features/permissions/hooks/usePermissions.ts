import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { permissionApi } from '../services/permissionApi';
import { 
  CreatePermissionRequest,
  UpdatePermissionRequest
} from '../types/permissionTypes';

// API Error interface
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Query Keys
export const PERMISSION_QUERY_KEYS = {
  all: ['permissions'] as const,
  lists: () => [...PERMISSION_QUERY_KEYS.all, 'list'] as const,
  list: () => [...PERMISSION_QUERY_KEYS.lists()] as const,
  details: () => [...PERMISSION_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PERMISSION_QUERY_KEYS.details(), id] as const,
};

/**
 * Hook để lấy danh sách permissions
 */
export const usePermissions = () => {
  return useQuery({
    queryKey: PERMISSION_QUERY_KEYS.list(),
    queryFn: () => permissionApi.getPermissions(),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

/**
 * Hook để lấy chi tiết permission theo ID
 */
export const usePermission = (id: number) => {
  return useQuery({
    queryKey: PERMISSION_QUERY_KEYS.detail(id),
    queryFn: () => permissionApi.getPermissionById(id),
    enabled: !!id,
  });
};

/**
 * Hook để tạo permission mới
 */
export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePermissionRequest) =>
      permissionApi.createPermission(data),
    onSuccess: (data) => {
      // Invalidate danh sách permissions
      queryClient.invalidateQueries({ queryKey: PERMISSION_QUERY_KEYS.lists() });
      
      toast.success(data.message || 'Tạo permission thành công');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Tạo permission thất bại';
      toast.error(message);
    },
  });
};

/**
 * Hook để cập nhật permission
 */
export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePermissionRequest }) =>
      permissionApi.updatePermission(id, data),
    onSuccess: (data, variables) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: PERMISSION_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PERMISSION_QUERY_KEYS.detail(variables.id) });
      
      toast.success(data.message || 'Cập nhật permission thành công');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Cập nhật permission thất bại';
      toast.error(message);
    },
  });
};

/**
 * Hook để xóa permission
 */
export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => permissionApi.deletePermission(id),
    onSuccess: (data) => {
      // Invalidate danh sách permissions
      queryClient.invalidateQueries({ queryKey: PERMISSION_QUERY_KEYS.lists() });
      
      toast.success(data.message || 'Xóa permission thành công');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Xóa permission thất bại';
      toast.error(message);
    },
  });
}; 
