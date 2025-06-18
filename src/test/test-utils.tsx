import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'app/providers/ThemeProvider';

// ✅ REQUIRED: Test utilities with providers

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

// Custom render function with all providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  queryClient?: QueryClient;
}

function AllTheProviders({ 
  children, 
  queryClient = createTestQueryClient(),
}: { 
  children: React.ReactNode;
  queryClient?: QueryClient;
}) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

const customRender = (
  ui: React.ReactElement,
  {
    queryClient,
    ...options
  }: Omit<CustomRenderOptions, 'initialEntries'> = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders queryClient={queryClient}>
      {children}
    </AllTheProviders>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Export everything
export * from '@testing-library/react';
export { customRender as render, createTestQueryClient }; 