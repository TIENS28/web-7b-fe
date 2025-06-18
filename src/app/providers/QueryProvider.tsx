import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'shared/lib/react-query';

interface QueryProviderProps {
  children: React.ReactNode;
}

// ✅ REQUIRED: React Query setup provider
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools can be added when package is installed */}
    </QueryClientProvider>
  );
} 
