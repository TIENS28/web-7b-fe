// ✅ REQUIRED: Application constants

// API Constants
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  ARTICLES: '/articles',
  ROLES: '/roles',
  PERMISSIONS: '/permissions',
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: '/admin',
  UNAUTHORIZED: '/unauthorized',
} as const;

// Permission Constants
export const PERMISSIONS = {
  ADMIN_ACCESS: 'admin:access',
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',
  ARTICLE_READ: 'article:read',
  ARTICLE_WRITE: 'article:write',
  ARTICLE_DELETE: 'article:delete',
} as const;

// Theme Constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Language Constants
export const LANGUAGES = {
  VI: 'vi',
  EN: 'en',
} as const; 
