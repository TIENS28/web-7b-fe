/**
 * Cấu hình toàn cục cho ứng dụng
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/',
  TIMEOUT: 30000, // 30 seconds
  VERSION: 'v1',
} as const;

// Application Information
export const APP_CONFIG = {
  NAME: 'Web 7B',
  VERSION: '1.0.0',
  DESCRIPTION: 'Web 7B Frontend Application',
  AUTHOR: 'Web 7B Team',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_ANALYTICS: import.meta.env.NODE_ENV === 'production',
  ENABLE_MAINTENANCE_MODE: false,
} as const;

// Constants
export const CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  CACHE: {
    DEFAULT_TTL: 3600, // 1 hour in seconds
  },
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  PRIMARY_COLOR: '#0070f3',
  SECONDARY_COLOR: '#1a1a1a',
  FONT_FAMILY: {
    SANS: 'Inter, system-ui, sans-serif',
    MONO: 'Menlo, Monaco, Courier, monospace',
  },
} as const; 
