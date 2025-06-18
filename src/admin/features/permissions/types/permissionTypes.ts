// Permission interfaces dựa trên OpenAPI schema

export interface Role {
  id: number;
  name: string;
}

export interface Permission extends Record<string, unknown> {
  id: number;
  action: string;
  resource: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  roles?: {
    role: Role;
  }[];
}

export interface PermissionResponse {
  success: boolean;
  message: string;
  data: Permission;
}

export interface PermissionListResponse {
  success: boolean;
  message: string;
  data: Permission[];
}

export interface CreatePermissionRequest {
  action: string;
  resource: string;
  description?: string | null;
}

export interface UpdatePermissionRequest {
  action?: string;
  resource?: string;
  description?: string | null;
} 
