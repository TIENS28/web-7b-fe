import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userApi } from '../services/userApi';
import { 
  UpdateProfileRequest,
  AssignRolesRequest,
  RevokeRolesRequest,
  ToggleLockStatusRequest,
  UsersQueryParams
} from '../types/userTypes';

// API Error interface
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Query Keys
export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_QUERY_KEYS.all, 'list'] as const,
  list: (params?: UsersQueryParams) => [...USER_QUERY_KEYS.lists(), { params }] as const,
  details: () => [...USER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.details(), id] as const,
};

/**
 * Hook để lấy danh sách users với phân trang
 */
export const useUsers = (params?: UsersQueryParams) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => userApi.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

/**
 * Hook để lấy chi tiết user theo ID
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
  });
};

/**
 * Hook để cập nhật thông tin user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfileRequest }) =>
      userApi.updateUser(id, data),
    onSuccess: (data, variables) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(variables.id) });
      
      toast.success(data.message || 'Cập nhật thông tin user thành công');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Cập nhật thông tin user thất bại';
      toast.error(message);
    },
  });
};

/**
 * Hook để xóa user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: (data) => {
      // Invalidate danh sách users
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      
      toast.success(data.message || 'Xóa user thành công');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Xóa user thất bại';
      toast.error(message);
    },
  });
};

/**
 * Hook để gán roles cho user
 */
export const useAssignRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignRolesRequest }) =>
      userApi.assignRoles(id, data),
    onSuccess: (data, variables) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(variables.id) });
      
      toast.success(data.message || 'Gán roles thành công');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Gán roles thất bại';
      toast.error(message);
    },
  });
};

/**
 * Hook để thu hồi roles từ user
 */
export const useRevokeRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RevokeRolesRequest }) =>
      userApi.revokeRoles(id, data),
    onSuccess: (data, variables) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(variables.id) });
      
      toast.success(data.message || 'Thu hồi roles thành công');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Thu hồi roles thất bại';
      toast.error(message);
    },
  });
};

/**
 * Hook để khóa/mở khóa user
 */
export const useToggleLockStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ToggleLockStatusRequest }) =>
      userApi.toggleLockStatus(id, data),
    onSuccess: (data, variables) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(variables.id) });
      
      const action = variables.data.isLocked ? 'Khóa' : 'Mở khóa';
      toast.success(data.message || `${action} tài khoản thành công`);
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Cập nhật trạng thái tài khoản thất bại';
      toast.error(message);
    },
  });
}; 
