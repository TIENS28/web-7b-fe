/**
 * Authentication Helper Functions
 * Tập trung các logic xử lý auth và storage
 * Note: Permission logic đã chuyển sang permissionHelpers.ts
 */

import { User, AuthError, AuthErrorCode, AuthStorage } from '../types/auth.types';

// ==================== Error Helpers ====================

/**
 * Tạo AuthError object
 */
export const createAuthError = (
  code: AuthErrorCode, 
  message: string, 
  details?: unknown
): AuthError => ({
  code,
  message,
  details,
  timestamp: Date.now()
});

/**
 * Parse error từ API response
 */
export const parseApiError = (error: unknown): AuthError => {
  // Type guard cho error object
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          code?: string;
        };
      };
    };

    const status = apiError.response?.status;
    const data = apiError.response?.data;

    switch (status) {
      case 401:
        return createAuthError('UNAUTHORIZED', data?.message || 'Unauthorized access');
      case 403:
        return createAuthError('PERMISSION_DENIED', data?.message || 'Permission denied');
      case 423:
        return createAuthError('USER_LOCKED', data?.message || 'User account is locked');
      default:
        return createAuthError('NETWORK_ERROR', data?.message || 'Network error occurred');
    }
  }

  // Fallback cho unknown errors
  return createAuthError('UNKNOWN_ERROR', 'An unknown error occurred', error);
};

// ==================== Storage Helpers ====================

/**
 * Lưu auth data vào localStorage với error handling
 */
export const saveAuthStorage = (data: Partial<AuthStorage>): boolean => {
  try {
    const currentData = getAuthStorage();
    const updatedData: AuthStorage = {
      ...currentData,
      ...data,
      lastActivity: Date.now()
    };
    
    localStorage.setItem('auth', JSON.stringify(updatedData));
    return true;
  } catch (error) {
    console.error('Error saving auth storage:', error);
    return false;
  }
};

/**
 * Lấy auth data từ localStorage với error handling
 */
export const getAuthStorage = (): AuthStorage => {
  try {
    const data = localStorage.getItem('auth');
    if (data) {
      return JSON.parse(data) as AuthStorage;
    }
  } catch (error) {
    console.error('Error reading auth storage:', error);
  }
  
  // Return default storage
  return {
    token: null,
    refreshToken: null,
    user: null,
    lastActivity: 0,
    rememberMe: false
  };
};

/**
 * Xóa auth data khỏi localStorage
 */
export const clearAuthStorage = (): void => {
  try {
    localStorage.removeItem('auth');
    localStorage.removeItem('token'); // Legacy cleanup
    localStorage.removeItem('user');  // Legacy cleanup
  } catch (error) {
    console.error('Error clearing auth storage:', error);
  }
};

// ==================== Token Helpers ====================

/**
 * Kiểm tra token có hết hạn không (basic check)
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  try {
    // Basic JWT decode cho exp claim
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp ? payload.exp < currentTime : true;
  } catch {
    return true;
  }
};

/**
 * Lấy thông tin user từ token (basic decode)
 */
export const getUserFromToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Map từ JWT payload sang User interface
    if (payload.userId && payload.permissions) {
      return {
        id: payload.userId,
        email: payload.email || '',
        fullName: payload.fullName || '',
        permissions: payload.permissions || [],
        // ... các field khác từ payload
      } as User;
    }
    
    return null;
  } catch {
    return null;
  }
};

/**
 * Kiểm tra session timeout
 */
export const isSessionTimeout = (lastActivity: number, timeoutMinutes: number = 30): boolean => {
  const timeoutMs = timeoutMinutes * 60 * 1000;
  return Date.now() - lastActivity > timeoutMs;
}; 
