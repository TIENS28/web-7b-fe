// User interfaces dựa trên OpenAPI schema

export interface UserRole {
  role: {
    id: number;
    name: string;
    permissions?: {
      permission: Permission;
    }[];
  };
}

export interface Permission {
  id: number;
  action: string;
  resource: string;
  description?: string;
}

export interface User {
  id: string;
  personalId: string;
  fullName: string;
  email?: string | null;
  phoneNumber?: string | null;
  phone?: string; // Alias cho phoneNumber
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
  permissions?: string[]; // Computed permissions
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  };
  timestamp: string;
  statusCode: number;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string | null;
  phoneNumber?: string | null;
  isLocked?: boolean;
}

export interface AssignRolesRequest {
  roleIds: number[];
  assignedBy?: string;
}

export interface RevokeRolesRequest {
  roleIds: number[];
}

export interface ToggleLockStatusRequest {
  isLocked: boolean;
}

// Query parameters cho list users
export interface UsersQueryParams {
  page?: number;
  pageSize?: number;
} 
