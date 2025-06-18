/**
 * Protected Route Component với hỗ trợ đầy đủ permission checking
 * Supports: Basic auth, Admin check, Single/Multiple permissions, Custom logic
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'app/providers/AuthProvider';
import { User, PermissionConfig } from 'shared/types/auth.types';
import { 
  checkPermissionConfig, 
  generatePermissionMessage 
} from 'shared/utils/permissionHelpers';

// ==================== Props Interface ====================

interface ProtectedRouteProps {
  // Permission Configuration
  permission?: PermissionConfig;
  
  // Quick Permission Checks (shortcuts)
  requireAuth?: boolean;           // Chỉ cần đăng nhập
  requireAdmin?: boolean;          // Cần quyền admin
  requirePermission?: string;      // Một permission cụ thể
  requirePermissions?: string[];   // Tất cả permissions
  requireAnyPermission?: string[]; // Bất kỳ permission nào
  
  // Customization
  children?: React.ReactNode;
  redirectTo?: string;             // Custom redirect URL
  fallbackComponent?: React.ComponentType<{ message?: string }>;
  loadingComponent?: React.ComponentType;
  showUnauthorized?: boolean;      // Show unauthorized page instead of redirect
}

// ==================== Default Components ====================
const DefaultLoadingComponent: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const DefaultUnauthorizedComponent: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-red-600">Không có quyền truy cập</h2>
      <p className="text-gray-600">{message || 'Bạn không có quyền truy cập trang này.'}</p>
      <button 
        onClick={() => window.history.back()} 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Quay lại
      </button>
    </div>
  </div>
);

// ==================== Main Component ====================
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permission,
  requireAuth = true,
  requireAdmin = false,
  requirePermission,
  requirePermissions,
  requireAnyPermission,
  children,
  redirectTo,
  fallbackComponent: FallbackComponent = DefaultUnauthorizedComponent,
  loadingComponent: LoadingComponent = DefaultLoadingComponent,
  showUnauthorized = false
}) => {
  const { 
    user, 
    isAuthenticated, 
    isInitialized, 
    isLoading,
    hasPermission,
    hasAnyPermission: hasAnyPerm,
    hasAllPermissions,
    isAdmin
  } = useAuth();
  
  const location = useLocation();

  // ==================== Loading State ====================
  if (!isInitialized || isLoading) {
    return <LoadingComponent />;
  }

  // ==================== Authentication Check ====================
  if (requireAuth && !isAuthenticated) {
    const loginUrl = redirectTo || '/login';
    return <Navigate to={loginUrl} state={{ from: location }} replace />;
  }

  // ==================== Permission Checks ====================
  let hasRequiredPermission = true;
  let permissionMessage = '';

  // Admin check
  if (requireAdmin && !isAdmin()) {
    hasRequiredPermission = false;
    permissionMessage = 'Cần quyền quản trị viên để truy cập trang này.';
  }

  // Single permission check
  if (hasRequiredPermission && requirePermission && !hasPermission({
    type: 'single',
    permissions: requirePermission
  })) {
    hasRequiredPermission = false;
    permissionMessage = `Cần quyền "${requirePermission}" để truy cập trang này.`;
  }

  // Multiple permissions check (all required)
  if (hasRequiredPermission && requirePermissions && !hasAllPermissions(requirePermissions)) {
    hasRequiredPermission = false;
    permissionMessage = `Cần tất cả các quyền: ${requirePermissions.join(', ')}`;
  }

  // Any permission check
  if (hasRequiredPermission && requireAnyPermission && !hasAnyPerm(requireAnyPermission)) {
    hasRequiredPermission = false;
    permissionMessage = `Cần ít nhất một trong các quyền: ${requireAnyPermission.join(', ')}`;
  }

  // Advanced permission config
  if (hasRequiredPermission && permission) {
    hasRequiredPermission = checkPermissionConfig(user as User | null, permission);
    
    if (!hasRequiredPermission) {
      permissionMessage = generatePermissionMessage(permission);
    }
  }

  // ==================== Permission Failure Handling ====================
  if (!hasRequiredPermission) {
    if (showUnauthorized) {
      return <FallbackComponent message={permissionMessage} />;
    }
    
    const unauthorizedUrl = permission?.fallbackUrl || redirectTo || '/unauthorized';
    return <Navigate to={unauthorizedUrl} replace />;
  }

  // ==================== Success - Render Children ====================
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

// ==================== Hook for Permission Checking ====================
export const usePermissionCheck = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, user } = useAuth();
  
  const checkCustom = (customCheck: (user: User) => boolean) => {
    return user ? customCheck(user as User) : false;
  };
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    checkCustom
  };
}; 
