/**
 * Centralized Authentication Provider
 * - Khởi tạo auth chỉ một lần 
 * - Quản lý auth state toàn cục
 * - Tích hợp với existing API
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from 'app/stores/authStore';
import { User, AuthError, PermissionConfig } from 'shared/types/auth.types';
import { checkIsAdmin } from 'shared/utils/permissionHelpers';

// ==================== Context Types ====================
interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: AuthError | null;
  
  // Actions
  logout: () => void;
  clearError: () => void;
  
  // Permission Helpers
  hasPermission: (config: PermissionConfig) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (roles: string | string[]) => boolean;
  isAdmin: () => boolean;
}

// ==================== Context Creation ====================
const AuthContext = createContext<AuthContextType | null>(null);

// ==================== Provider Props ====================
interface AuthProviderProps {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<{ error?: string }>;
}

// ==================== Loading Component ====================
const DefaultLoadingComponent: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 dark:text-gray-400">Đang khởi tạo...</p>
    </div>
  </div>
);

// ==================== Error Component ====================
const DefaultErrorComponent: React.FC<{ error?: string }> = ({ error }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="text-center space-y-4">
      <h2 className="text-xl font-semibold text-red-600">Lỗi khởi tạo</h2>
      <p className="text-gray-600 dark:text-gray-400">{error || 'Có lỗi xảy ra khi khởi tạo ứng dụng'}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tải lại
      </button>
    </div>
  </div>
);

// ==================== Main Provider ====================
export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  fallbackComponent: FallbackComponent = DefaultErrorComponent 
}) => {
  const {
    user,
    token,
    isAuthenticated,
    isInitialized,
    isLoading,
    error,
    logout: storeLogout,
    clearError: storeClearError,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    _initialize
  } = useAuthStore();

  const [initError, setInitError] = useState<string | null>(null);

  // ==================== Initialization ====================
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Khởi tạo auth từ localStorage
        await _initialize();
      } catch (error) {
        console.error('AuthProvider initialization error:', error);
        
        if (isMounted) {
          setInitError(error instanceof Error ? error.message : 'Unknown error');
        }
      }
    };

    // Chỉ khởi tạo nếu chưa được khởi tạo
    if (!isInitialized) {
      initAuth();
    }

    return () => {
      isMounted = false;
    };
  }, [isInitialized, _initialize]);

  // ==================== Permission Helpers ====================
  const isAdmin = (): boolean => {
    return checkIsAdmin(user);
  };

  const logout = () => {
    storeLogout();
    setInitError(null);
  };

  const clearError = () => {
    storeClearError();
    setInitError(null);
  };

  // ==================== Context Value ====================
  const contextValue: AuthContextType = {
    // State
    user,
    token,
    isAuthenticated,
    isInitialized,
    isLoading,
    error: error || (initError ? { 
      code: 'INIT_ERROR', 
      message: initError, 
      timestamp: Date.now() 
    } as AuthError : null),
    
    // Actions
    logout,
    clearError,
    
    // Permission Helpers
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin
  };

  // ==================== Render Logic ====================
  
  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return <DefaultLoadingComponent />;
  }

  // Show error if initialization failed
  if (initError) {
    return <FallbackComponent error={initError} />;
  }

  // Render children with context
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ==================== Hook Export ====================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};

// ==================== Specific Hooks ====================
export const useAuthUser = () => {
  const { user } = useAuth();
  return user;
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

export const useIsAdmin = () => {
  const { isAdmin } = useAuth();
  return isAdmin();
};

export const usePermissions = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();
  return { hasPermission, hasAnyPermission, hasAllPermissions };
}; 
