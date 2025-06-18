/**
 * Trang chi tiết role - hiển thị thông tin role, permissions và users
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { rolesApi, mockRoles } from '../services/RolesApi';
import { Button } from 'shared/components/shadcn/button';
import { 
  ArrowLeft, 
  Edit, 
  Shield, 
  Users, 
  Calendar,
  User,
  Mail,
  IdCard
} from 'lucide-react';

const RoleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roleId = parseInt(id || '0');

  // Query để lấy chi tiết role
  const { data: role, isLoading, error } = useQuery({
    queryKey: ['roleDetail', roleId],
    queryFn: async () => {
      try {
        return await rolesApi.getRoleById(roleId);
      } catch (error) {
        // Fallback to mock data nếu API lỗi
        console.warn('API không khả dụng, sử dụng mock data:', error);
        return mockRoles.find(r => r.id === roleId) || null;
      }
    },
    enabled: !!roleId,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">Không tìm thấy role</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Role với ID {id} không tồn tại hoặc đã bị xóa
          </p>
          <Button onClick={() => navigate('/admin/roles')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const getRoleAvatar = (roleName: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    const colorIndex = roleName.length % colors.length;
    return colors[colorIndex];
  };

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
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full ${getRoleAvatar(role.name)} flex items-center justify-center text-white font-bold text-lg`}>
              {role.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {role.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Role ID: {role.id}
              </p>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/admin/roles/${role.id}/edit`)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Role Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin Role
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ngày tạo</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(role.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cập nhật lần cuối</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(role.updatedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-500" />
                Permissions ({role.permissions.length})
              </h2>
            </div>
            
            {role.permissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {role.permissions.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.permission.action}:{item.permission.resource}
                      </p>
                      {item.permission.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.permission.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Chưa có permissions
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Role này chưa được gán permissions nào
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Thống kê
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Permissions</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {role.permissions.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Người dùng</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {role._count.users}
                </span>
              </div>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-500" />
              Người dùng ({role._count.users})
            </h3>
            
            {role.users && role.users.length > 0 ? (
              <div className="space-y-3">
                {role.users.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.user.fullName}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <IdCard className="w-3 h-3" />
                        <span>{item.user.personalId}</span>
                      </div>
                      {item.user.email && (
                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{item.user.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Chưa có người dùng
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Chưa có người dùng nào được gán role này
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDetailPage; 
