/**
 * Roles API Service - Dựa trên OpenAPI specification
 */

import axiosInstance from 'shared/lib/apiInstance';
import type {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
  RevokePermissionsRequest,
  RoleResponse,
  RoleListResponse
} from '../types/Role.types';

// ==================== Roles API ====================
export const rolesApi = {
  /**
   * Lấy danh sách tất cả roles
   */
  getRoles: async (): Promise<Role[]> => {
    const response = await axiosInstance.get<RoleListResponse>('/roles');
    return response.data.data;
  },

  /**
   * Lấy chi tiết role theo ID
   */
  getRoleById: async (id: number): Promise<Role> => {
    const response = await axiosInstance.get<RoleResponse>(`/roles/${id}`);
    return response.data.data;
  },

  /**
   * Tạo role mới
   */
  createRole: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await axiosInstance.post<RoleResponse>('/roles', data);
    return response.data.data;
  },

  /**
   * Cập nhật role
   */
  updateRole: async (id: number, data: UpdateRoleRequest): Promise<Role> => {
    const response = await axiosInstance.put<RoleResponse>(`/roles/${id}`, data);
    return response.data.data;
  },

  /**
   * Xóa role
   */
  deleteRole: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/roles/${id}`);
  },

  /**
   * Gán permissions cho role
   */
  assignPermissions: async (id: number, data: AssignPermissionsRequest): Promise<Role> => {
    const response = await axiosInstance.post<RoleResponse>(`/roles/${id}/permissions`, data);
    return response.data.data;
  },

  /**
   * Thu hồi permissions từ role
   */
  revokePermissions: async (id: number, data: RevokePermissionsRequest): Promise<Role> => {
    const response = await axiosInstance.delete<RoleResponse>(`/roles/${id}/permissions`, { data });
    return response.data.data;
  }
};

// ==================== Permissions API ====================
export const permissionsApi = {
  /**
   * Lấy danh sách tất cả permissions
   */
  getPermissions: async (): Promise<Permission[]> => {
    const response = await axiosInstance.get<{ success: boolean; message: string; data: Permission[] }>('/permissions');
    return response.data.data;
  },

  /**
   * Lấy chi tiết permission theo ID
   */
  getPermissionById: async (id: number): Promise<Permission> => {
    const response = await axiosInstance.get<{ success: boolean; message: string; data: Permission }>(`/permissions/${id}`);
    return response.data.data;
  }
};

// ==================== Mock Data cho Development ====================
export const mockRoles: Role[] = [
  {
    id: 1,
    name: 'Admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    permissions: [
      {
        permission: {
          id: 1,
          action: 'create',
          resource: 'users',
          description: 'Tạo người dùng mới',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      },
      {
        permission: {
          id: 2,
          action: 'read',
          resource: 'users',
          description: 'Xem thông tin người dùng',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      }
    ],
    users: [
      {
        user: {
          id: '1',
          fullName: 'Nguyễn Văn Admin',
          personalId: '123456789012',
          email: 'admin@example.com'
        }
      }
    ],
    _count: {
      users: 1
    }
  },
  {
    id: 2,
    name: 'Editor',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    permissions: [
      {
        permission: {
          id: 3,
          action: 'create',
          resource: 'articles',
          description: 'Tạo bài viết mới',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      },
      {
        permission: {
          id: 4,
          action: 'update',
          resource: 'articles',
          description: 'Cập nhật bài viết',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      }
    ],
    users: [
      {
        user: {
          id: '2',
          fullName: 'Nguyễn Thị Editor',
          personalId: '123456789013',
          email: 'editor@example.com'
        }
      },
      {
        user: {
          id: '3',
          fullName: 'Trần Văn Writer',
          personalId: '123456789014',
          email: 'writer@example.com'
        }
      }
    ],
    _count: {
      users: 2
    }
  }
];

export const mockPermissions: Permission[] = [
  {
    id: 1,
    action: 'create',
    resource: 'users',
    description: 'Tạo người dùng mới',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    roles: [{ role: { id: 1, name: 'Admin' } }]
  },
  {
    id: 2,
    action: 'read',
    resource: 'users',
    description: 'Xem thông tin người dùng',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    roles: [{ role: { id: 1, name: 'Admin' } }]
  },
  {
    id: 3,
    action: 'create',
    resource: 'articles',
    description: 'Tạo bài viết mới',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    roles: [{ role: { id: 2, name: 'Editor' } }]
  },
  {
    id: 4,
    action: 'update',
    resource: 'articles',
    description: 'Cập nhật bài viết',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    roles: [{ role: { id: 2, name: 'Editor' } }]
  },
  {
    id: 5,
    action: 'delete',
    resource: 'articles',
    description: 'Xóa bài viết',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    roles: [{ role: { id: 1, name: 'Admin' } }]
  }
]; 
