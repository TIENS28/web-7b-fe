/**
 * Permission Helper Functions - Tách riêng để tái sử dụng
 * Sử dụng trong ProtectedRoute, AuthProvider và các component khác
 */

import { User, PermissionConfig } from '../types/auth.types';

// ==================== Core Permission Checkers ====================

/**
 * Kiểm tra user có permission cụ thể
 */
export const checkSinglePermission = (user: User | null, permission: string): boolean => {
  if (!user || !permission || !user.permissions) return false;
  return user.permissions.includes(permission);
};

/**
 * Kiểm tra user có bất kỳ permission nào trong array
 */
export const checkAnyPermission = (user: User | null, permissions: string[]): boolean => {
  if (!user || !permissions.length || !user.permissions) return false;
  return permissions.some(permission => user.permissions.includes(permission));
};

/**
 * Kiểm tra user có tất cả permissions trong array
 */
export const checkAllPermissions = (user: User | null, permissions: string[]): boolean => {
  if (!user || !permissions.length || !user.permissions) return false;
  return permissions.every(permission => user.permissions.includes(permission));
};

/**
 * Kiểm tra user có role
 */
export const checkRole = (user: User | null, roles: string | string[]): boolean => {
  if (!user || !user.roles) return false;
  
  const userRoles = user.roles.map(role => role.name);
  const targetRoles = Array.isArray(roles) ? roles : [roles];
  
  return targetRoles.some(role => userRoles.includes(role));
};

/**
 * Kiểm tra user có quyền admin
 */
export const checkIsAdmin = (user: User | null): boolean => {
  if (!user) return false;
  
  // API chỉ trả về permissions, không có roles
  // Chỉ check permissions thôi
  return checkAnyPermission(user, [
    'admin_panel:access',
    'system:admin',
    '*:*'
  ]);
};

// ==================== Advanced Permission Checker ====================

/**
 * Kiểm tra permission dựa trên config - Universal function
 */
export const checkPermissionConfig = (user: User | null, config: PermissionConfig): boolean => {
  if (!user) {
    return false;
  }

  switch (config.type) {
    case 'single':
      if (typeof config.permissions === 'string') {
        return checkSinglePermission(user, config.permissions);
      }
      return false;

    case 'multiple':
      if (Array.isArray(config.permissions)) {
        return checkAllPermissions(user, config.permissions);
      }
      return false;

    case 'any':
      if (Array.isArray(config.permissions)) {
        return checkAnyPermission(user, config.permissions);
      }
      return false;

    case 'role': {
      if (config.roles) {
        return checkRole(user, config.roles);
      }
      return false;
    }

    case 'custom':
      if (config.customCheck) {
        return config.customCheck(user);
      }
      return false;

    default:
      return false;
  }
};

// ==================== Permission Message Generators ====================

/**
 * Tạo thông báo lỗi permission
 */
export const generatePermissionMessage = (config: PermissionConfig): string => {
  switch (config.type) {
    case 'single':
      return `Cần quyền "${config.permissions}" để truy cập.`;
    
    case 'multiple':
      return `Cần tất cả các quyền: ${Array.isArray(config.permissions) ? config.permissions.join(', ') : ''}`;
    
    case 'any':
      return `Cần ít nhất một trong các quyền: ${Array.isArray(config.permissions) ? config.permissions.join(', ') : ''}`;
    
    case 'role': {
      const roleList = Array.isArray(config.roles) ? config.roles.join(', ') : config.roles;
      return `Cần role: ${roleList}`;
    }
    
    case 'custom':
      return 'Không có quyền truy cập theo yêu cầu đặc biệt.';
    
    default:
      return 'Không có quyền truy cập.';
  }
}; 
