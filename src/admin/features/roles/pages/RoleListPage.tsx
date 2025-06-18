/**
 * Trang danh sách roles với table, search, pagination và CRUD actions
 * Sử dụng DataTable component với TanStack Table
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi, mockRoles } from '../services/RolesApi';
import type { Role } from '../types/Role.types';
import { Button } from 'shared/components/shadcn/button';
import { DataTable, createActionColumn } from 'shared/components/data-table/data-table';
import { Badge } from 'shared/components/shadcn/badge';
import { toast } from 'sonner';
import { createColumnHelper } from '@tanstack/react-table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Shield, 
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

const RoleListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Query để lấy danh sách roles
  const { data: roles = [], isLoading, error } = useQuery({
    queryKey: ['rolesList'],
    queryFn: async () => {
      try {
        return await rolesApi.getRoles();
      } catch (error) {
        // Fallback to mock data nếu API lỗi
        console.warn('API không khả dụng, sử dụng mock data:', error);
        return mockRoles;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });

  // Mutation để xóa role
  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => rolesApi.deleteRole(id),
    onSuccess: () => {
      toast.success('Xóa role thành công!');
      queryClient.invalidateQueries({ queryKey: ['rolesList'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi xóa role');
    }
  });

 

  // Định nghĩa columns cho DataTable
  const columnHelper = createColumnHelper<Role>();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: any[] = useMemo(() => [
    columnHelper.accessor('name', {
      id: 'role',
      header: 'Role',
      enableSorting: true,
      cell: info => {
        const role = info.row.original;
        return (
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm`}>
              {role.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {role.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                ID: {role.id}
              </div>
            </div>
          </div>
        );
      },
    }),
    
    columnHelper.accessor('permissions', {
      id: 'permissions',
      header: 'Permissions',
      enableSorting: true,
      cell: info => (
        <div className="flex items-center">
          <Shield className="w-4 h-4 text-blue-500 mr-2" />
          <Badge variant="outline" className="text-sm">
            {info.getValue().length} permissions
          </Badge>
        </div>
      ),
    }),
    
    columnHelper.accessor('_count', {
      id: 'users',
      header: 'Người dùng',
      enableSorting: true,
      cell: info => (
        <div className="flex items-center">
          <Users className="w-4 h-4 text-green-500 mr-2" />
          <Badge variant="secondary" className="text-sm">
            {info.getValue().users} người dùng
          </Badge>
        </div>
      ),
    }),
    
    columnHelper.accessor('createdAt', {
      id: 'createdAt',
      header: 'Ngày tạo',
      enableSorting: true,
      cell: info => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(info.getValue()).toLocaleDateString('vi-VN')}
        </div>
      ),
    }),
  ], [columnHelper]);

  // Create complete columns with actions
  const tableColumns = useMemo(() => {
    const handleDelete = async (role: Role) => {
      if (role._count.users > 0) {
        toast.error(`Không thể xóa role "${role.name}" vì đang có ${role._count.users} người dùng sử dụng`);
        return;
      }
  
      if (window.confirm(`Bạn có chắc chắn muốn xóa role "${role.name}"?`)) {
        deleteRoleMutation.mutate(role.id);
      }
    };
    const actions = [
      {
        type: 'view' as const,
        label: 'Xem chi tiết',
        onClick: (role: Role) => navigate(`/admin/roles/${role.id}`),
        icon: <Eye className="w-4 h-4" />,
      },
      {
        type: 'edit' as const,
        label: 'Chỉnh sửa',
        onClick: (role: Role) => navigate(`/admin/roles/${role.id}/edit`),
        icon: <Edit className="w-4 h-4" />,
      },
      {
        type: 'delete' as const,
        label: 'Xóa role',
        onClick: handleDelete,
        icon: <Trash2 className="w-4 h-4" />,
        disabled: (role: Role) => role._count.users > 0 || deleteRoleMutation.isPending,
      },
    ];

    return [
      ...columns,
      createActionColumn(actions)
    ];
  }, [columns, navigate, deleteRoleMutation.isPending, deleteRoleMutation.mutateAsync]);

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">Lỗi khi tải dữ liệu</div>
          <p className="text-gray-600 dark:text-gray-400">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý Roles
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Quản lý roles và permissions trong hệ thống
            </p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/admin/roles/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo Role Mới
        </Button>
      </div>

      {/* DataTable */}
      <DataTable<Role>
        data={roles || []}
        columns={tableColumns as ColumnDef<Role, unknown>[]}
        loading={isLoading}
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tên role..."
        emptyState={{
          icon: <Shield className="h-12 w-12" />,
          title: 'Không có role nào',
          description: 'Bắt đầu bằng cách tạo role đầu tiên'
        }}
        className="bg-white dark:bg-gray-800 dark:border-gray-700"
      />
    </div>
  );
};

export default RoleListPage; 
