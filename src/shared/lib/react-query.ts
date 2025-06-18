import { QueryClient } from '@tanstack/react-query';

// ✅ REQUIRED: Centralized React Query configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true, // Let ErrorBoundary catch errors
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'response' in error) {
          const response = (error as { response?: { status?: number } }).response;
          if (response?.status && response.status >= 400 && response.status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      throwOnError: false, // Handle locally in forms
    },
  },
});

// Error handling for React Query
export const handleQueryError = (error: unknown) => {
  console.error('Query Error:', error);
  // You can integrate with error tracking service here (e.g., Sentry)
}; 
