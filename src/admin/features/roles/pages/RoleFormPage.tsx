/**
 * Trang form tạo/sửa role với permission management
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi, permissionsApi, mockRoles, mockPermissions } from '../services/RolesApi';
import type { CreateRoleRequest, UpdateRoleRequest, Permission } from '../types/Role.types';
import { Button } from 'shared/components/shadcn/button';
import { Input } from 'shared/components/shadcn/input';
import { Label } from 'shared/components/shadcn/label';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Save, 
  Shield, 
  CheckSquare, 
  Square,
  Eye,
  AlertCircle
} from 'lucide-react';

// Zod schema cho form
const roleFormSchema = z.object({
  name: z.string()
    .min(1, { message: "Tên role không được để trống" })
    .regex(/^[a-zA-Z_\s]+$/, { message: "Tên role chỉ được chứa chữ cái, dấu gạch dưới và khoảng trắng" }),
  permissionIds: z.array(z.number()).optional()
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormPageProps {
  mode?: 'create' | 'edit';
}

const RoleFormPage: React.FC<RoleFormPageProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const roleId = parseInt(id || '0');
  const isEditMode = mode === 'edit' || !!roleId;
  
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [permissionFilter, setPermissionFilter] = useState('');

  // Query để lấy danh sách permissions
  const { data: permissions = [], isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissionsList'],
    queryFn: async () => {
      try {
        return await permissionsApi.getPermissions();
      } catch (error) {
        console.warn('API không khả dụng, sử dụng mock data:', error);
        return mockPermissions;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Query để lấy chi tiết role (nếu edit mode)
  const { data: existingRole, isLoading: isLoadingRole } = useQuery({
    queryKey: ['roleDetail', roleId],
    queryFn: async () => {
      try {
        return await rolesApi.getRoleById(roleId);
      } catch (error) {
        console.warn('API không khả dụng, sử dụng mock data:', error);
        return mockRoles.find(r => r.id === roleId) || null;
      }
    },
    enabled: isEditMode && !!roleId,
    staleTime: 5 * 60 * 1000,
  });

  // Form setup
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      permissionIds: []
    }
  });

  // Load existing data khi edit
  useEffect(() => {
    if (isEditMode && existingRole) {
      reset({
        name: existingRole.name,
        permissionIds: existingRole.permissions.map(p => p.permission.id)
      });
      setSelectedPermissions(existingRole.permissions.map(p => p.permission.id));
    }
  }, [existingRole, isEditMode, reset]);

  // Mutations
  const createRoleMutation = useMutation({
    mutationFn: (data: CreateRoleRequest) => rolesApi.createRole(data),
    onSuccess: () => {
      toast.success('Tạo role thành công!');
      queryClient.invalidateQueries({ queryKey: ['rolesList'] });
      navigate('/admin/roles');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi tạo role');
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: (data: { id: number; payload: UpdateRoleRequest }) => 
      rolesApi.updateRole(data.id, data.payload),
    onSuccess: () => {
      toast.success('Cập nhật role thành công!');
      queryClient.invalidateQueries({ queryKey: ['rolesList'] });
      queryClient.invalidateQueries({ queryKey: ['roleDetail', roleId] });
      navigate('/admin/roles');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi cập nhật role');
    }
  });

  // Handle form submit
  const onSubmit = async (data: RoleFormValues) => {
    const payload = {
      name: data.name,
      permissionIds: selectedPermissions
    };

    if (isEditMode && existingRole) {
      await updateRoleMutation.mutateAsync({ 
        id: existingRole.id, 
        payload: { name: payload.name }
      });
      
      // Cập nhật permissions riêng nếu có thay đổi
      if (selectedPermissions.length > 0) {
        try {
          await rolesApi.assignPermissions(existingRole.id, { permissionIds: selectedPermissions });
        } catch (error) {
          console.warn('Lỗi khi cập nhật permissions:', error);
        }
      }
    } else {
      await createRoleMutation.mutateAsync(payload);
    }
  };

  // Permission handlers
  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = () => {
    const filteredPermissionIds = filteredPermissions.map(p => p.id);
    setSelectedPermissions(prev => {
      const newSelected = [...prev];
      filteredPermissionIds.forEach(id => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      return newSelected;
    });
  };

  const handleClearAll = () => {
    const filteredPermissionIds = filteredPermissions.map(p => p.id);
    setSelectedPermissions(prev => 
      prev.filter(id => !filteredPermissionIds.includes(id))
    );
  };

  // Filter permissions
  const filteredPermissions = permissions.filter(permission =>
    `${permission.action}:${permission.resource}`.toLowerCase().includes(permissionFilter.toLowerCase()) ||
    (permission.description && permission.description.toLowerCase().includes(permissionFilter.toLowerCase()))
  );

  // Group permissions by resource
  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    const resource = permission.resource;
    if (!acc[resource]) {
      acc[resource] = [];
    }
    acc[resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (isLoadingPermissions || (isEditMode && isLoadingRole)) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/roles')}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? 'Chỉnh sửa Role' : 'Tạo Role Mới'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isEditMode ? `Cập nhật thông tin role "${existingRole?.name}"` : 'Tạo role mới với permissions tùy chọn'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin cơ bản
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tên Role *
                </Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      {...field}
                      placeholder="Nhập tên role (vd: Admin, Editor, Viewer)"
                      className="mt-1"
                    />
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-500" />
                Permissions ({selectedPermissions.length}/{permissions.length})
              </h2>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={filteredPermissions.length === 0}
                >
                  Chọn tất cả
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={selectedPermissions.length === 0}
                >
                  Bỏ chọn
                </Button>
              </div>
            </div>

            {/* Permission Filter */}
            <div className="mb-4">
              <Input
                placeholder="Tìm kiếm permissions..."
                value={permissionFilter}
                onChange={(e) => setPermissionFilter(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Permission Groups */}
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                <div key={resource} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3 capitalize">
                    {resource} ({resourcePermissions.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resourcePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        onClick={() => handlePermissionToggle(permission.id)}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {selectedPermissions.includes(permission.id) ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {permission.action}:{permission.resource}
                          </p>
                          {permission.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredPermissions.length === 0 && (
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Không tìm thấy permissions
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Thử thay đổi từ khóa tìm kiếm
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Preview */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-green-500" />
              Preview
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tên Role</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {control._formValues.name || 'Chưa nhập tên'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Permissions</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedPermissions.length} permissions được chọn
                </p>
              </div>

              {selectedPermissions.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Danh sách permissions:</p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {selectedPermissions.map(id => {
                      const permission = permissions.find(p => p.id === id);
                      return permission ? (
                        <div key={id} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          {permission.action}:{permission.resource}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting || createRoleMutation.isPending || updateRoleMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting || createRoleMutation.isPending || updateRoleMutation.isPending
                  ? 'Đang lưu...'
                  : (isEditMode ? 'Cập nhật Role' : 'Tạo Role')
                }
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/roles')}
                disabled={isSubmitting || createRoleMutation.isPending || updateRoleMutation.isPending}
                className="w-full"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RoleFormPage; 
