/**
 * Authentication và Authorization Types
 * Hệ thống type-safe cho toàn bộ auth flow
 */

// ==================== Base Types ====================
export interface User {
  id: string;
  personalId?: string;
  patientId?: string | null;
  email?: string;
  phoneNumber?: string;
  fullName: string;
  failedLoginCount?: number;
  isLocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  permissions: string[];
  roles?: Role[];
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

// ==================== Auth State Types ====================
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken?: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

// ==================== Permission Types ====================
export type PermissionType = 
  | 'single'     // Một permission cụ thể
  | 'multiple'   // Tất cả permissions trong array
  | 'any'        // Bất kỳ permission nào trong array
  | 'role'       // Dựa trên role
  | 'custom';    // Custom logic function

export interface PermissionConfig {
  type: PermissionType;
  permissions?: string | string[];
  roles?: string | string[];
  customCheck?: (user: User) => boolean;
  fallbackUrl?: string;
}

// ==================== Route Protection Types ====================
export interface RouteProtectionConfig extends PermissionConfig {
  redirectTo?: string;
  showUnauthorized?: boolean;
  loadingComponent?: React.ComponentType;
}

// ==================== Error Types ====================
export interface AuthError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: number;
}

export type AuthErrorCode = 
  | 'UNAUTHORIZED'
  | 'TOKEN_EXPIRED' 
  | 'TOKEN_INVALID'
  | 'NETWORK_ERROR'
  | 'STORAGE_ERROR'
  | 'PERMISSION_DENIED'
  | 'USER_LOCKED'
  | 'UNKNOWN_ERROR';

// ==================== API Types ====================
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface TokenVerifyResponse {
  valid: boolean;
  user?: User;
  expiresIn?: number;
}

// ==================== Hook Types ====================
export interface UseAuthReturn extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  verifyToken: () => Promise<boolean>;
  clearError: () => void;
  hasPermission: (config: PermissionConfig) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (roles: string | string[]) => boolean;
}

// ==================== Context Types ====================
export interface AuthContextType extends UseAuthReturn {
  isInitialized: boolean;
}

// ==================== Storage Types ====================
export interface AuthStorage {
  token: string | null;
  refreshToken?: string | null;
  user: User | null;
  lastActivity: number;
  rememberMe: boolean;
}

// ==================== Utility Types ====================
export type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: { token: string | null; refreshToken?: string | null } }
  | { type: 'SET_ERROR'; payload: AuthError | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'LOGOUT' }
  | { type: 'RESET' }; 
