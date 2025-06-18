/**
 * Role Types - Dựa trên OpenAPI specification
 */

// ==================== Base Types ====================
export interface Role {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  permissions: Array<{
    permission: Permission;
  }>;
  users?: Array<{
    user: {
      id: string;
      fullName: string;
      personalId: string;
      email?: string;
    };
  }>;
  _count: {
    users: number;
  };
}

export interface Permission {
  id: number;
  action: string;
  resource: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  roles?: Array<{
    role: {
      id: number;
      name: string;
    };
  }>;
}

// ==================== Request Types ====================
export interface CreateRoleRequest {
  name: string;
  permissionIds?: number[];
}

export interface UpdateRoleRequest {
  name?: string;
}

export interface AssignPermissionsRequest {
  permissionIds: number[];
}

export interface RevokePermissionsRequest {
  permissionIds: number[];
}

// ==================== Response Types ====================
export interface RoleResponse {
  success: boolean;
  message: string;
  data: Role;
}

export interface RoleListResponse {
  success: boolean;
  message: string;
  data: Role[];
}

// ==================== UI Types ====================
export interface RoleFormData {
  name: string;
  permissionIds: number[];
}

export interface RoleTableItem extends Role {
  permissionCount: number;
  userCount: number;
} 
