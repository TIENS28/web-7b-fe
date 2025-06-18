# API Integration Guide

## Overview

This guide covers the API integration patterns, best practices, and implementation details for the Web 7B Frontend application.

## 🔧 API Client Setup

### Centralized API Instance

The application uses a centralized Axios instance for all API calls, configured in `shared/lib/apiInstance.ts`.

```typescript
// shared/lib/apiInstance.ts
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from 'app/stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Environment Configuration

Configure API endpoints in your environment variables:

```env
# .env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
```

## 📡 API Service Patterns

### Service Structure

Each feature should have its own API service file following this pattern:

```typescript
// users/services/userApi.ts
import api from 'shared/lib/apiInstance';
import type { User, CreateUserData, UpdateUserData, UserParams } from '../types';

export const userApi = {
  // Get all users with optional parameters
  getAll: (params?: UserParams) => 
    api.get<User[]>('/users', { params }),
  
  // Get user by ID
  getById: (id: string) => 
    api.get<User>(`/users/${id}`),
  
  // Create new user
  create: (data: CreateUserData) => 
    api.post<User>('/users', data),
  
  // Update existing user
  update: (id: string, data: UpdateUserData) => 
    api.put<User>(`/users/${id}`, data),
  
  // Delete user
  delete: (id: string) => 
    api.delete(`/users/${id}`),
  
  // Custom endpoint
  search: (query: string) => 
    api.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`),
};
```

### Type Definitions

Define proper TypeScript interfaces for API requests and responses:

```typescript
// users/types/userTypes.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type UserRole = 'admin' | 'user' | 'moderator';
```

## 🔄 React Query Integration

### Query Hooks Pattern

Create custom hooks that wrap React Query for each API endpoint:

```typescript
// users/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../services/userApi';
import type { UserParams, CreateUserData, UpdateUserData } from '../types';

// Get all users
export const useUsers = (params?: UserParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.getAll(params),
    throwOnError: true,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error.response?.status >= 400 && error.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getById(id),
    enabled: !!id, // Only run if id exists
    throwOnError: true,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search users
export const useUserSearch = (query: string) => {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => userApi.search(query),
    enabled: query.length > 2, // Only search if query is longer than 2 chars
    throwOnError: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
```

### Mutation Hooks Pattern

Create mutation hooks for data modifications:

```typescript
// users/hooks/useUserMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userApi } from '../services/userApi';
import type { CreateUserData, UpdateUserData } from '../types';

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.create,
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Optimistically update cache
      queryClient.setQueryData(['users', newUser.id], newUser);
      
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userApi.update(id, data),
    onSuccess: (updatedUser, { id }) => {
      // Update specific user in cache
      queryClient.setQueryData(['users', id], updatedUser);
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: ['users', deletedId] });
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
};
```

## 📊 Pagination & Filtering

### Server-Side Pagination

Implement server-side pagination for large datasets:

```typescript
// types/pagination.ts
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// users/hooks/useUsers.ts
export const useUsers = (params: PaginationParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.getAll(params),
    throwOnError: true,
    keepPreviousData: true, // Keep previous data while loading new page
  });
};
```

### Infinite Queries

For infinite scrolling or "load more" functionality:

```typescript
// users/hooks/useInfiniteUsers.ts
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteUsers = (params: Omit<PaginationParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['users', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => 
      userApi.getAll({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    throwOnError: true,
  });
};
```

## 🚨 Error Handling

### API Error Types

Define consistent error types:

```typescript
// types/api.ts
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
```

### Error Handling in Components

```typescript
// users/pages/UserListPage.tsx
import { ErrorBoundary } from 'shared/components';
import { useUsers } from '../hooks/useUsers';

export const UserListPage = () => {
  const { data, isLoading, error } = useUsers({ page: 1, limit: 10 });

  // Error will be caught by ErrorBoundary if throwOnError: true
  if (isLoading) return <LoadingSpinner />;

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <UserList users={data?.data || []} pagination={data?.pagination} />
      </div>
    </ErrorBoundary>
  );
};
```

### Form Error Handling

```typescript
// users/components/UserForm.tsx
import { useCreateUser } from '../hooks/useUserMutations';

export const UserForm = () => {
  const createUser = useCreateUser();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: CreateUserData) => {
    try {
      setSubmitError(null);
      await createUser.mutateAsync(data);
      // Handle success (e.g., redirect, close modal)
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        // Set form errors
        Object.keys(validationErrors).forEach((field) => {
          form.setError(field as any, {
            type: 'server',
            message: validationErrors[field][0],
          });
        });
      } else {
        setSubmitError(error.response?.data?.message || 'An error occurred');
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
      {submitError && (
        <div className="text-red-500 text-sm mt-2">{submitError}</div>
      )}
    </form>
  );
};
```

## 🔐 Authentication Integration

### Auth Service

```typescript
// auth/services/authApi.ts
import api from 'shared/lib/apiInstance';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),
  
  register: (data: RegisterData) =>
    api.post<AuthResponse>('/auth/register', data),
  
  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }),
  
  logout: () =>
    api.post('/auth/logout'),
  
  me: () =>
    api.get<User>('/auth/me'),
};
```

### Auth Hooks

```typescript
// auth/hooks/useAuth.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from 'app/stores/authStore';
import { authApi } from '../services/authApi';

export const useLogin = () => {
  const { login: setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useLogout = () => {
  const { logout: clearAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
    },
    onError: () => {
      // Clear auth even if logout API fails
      clearAuth();
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: !!useAuthStore.getState().accessToken,
    throwOnError: true,
  });
};
```

## 📁 File Upload Integration

### File Upload Service

```typescript
// shared/services/fileApi.ts
import api from '../lib/apiInstance';

export const fileApi = {
  upload: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<{ url: string; filename: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
  },
};
```

### File Upload Hook

```typescript
// shared/hooks/useFileUpload.ts
import { useMutation } from '@tanstack/react-query';
import { fileApi } from '../services/fileApi';

export const useFileUpload = () => {
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (progress: number) => void }) =>
      fileApi.upload(file, onProgress),
    onSuccess: (response) => {
      toast.success('File uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Upload failed');
    },
  });
};
```

## 🔄 Real-time Updates

### WebSocket Integration

```typescript
// shared/services/websocket.ts
import { useAuthStore } from 'app/stores/authStore';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const token = useAuthStore.getState().accessToken;
    if (!token) return;

    this.ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?token=${token}`);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  private handleMessage(data: any) {
    // Handle different message types
    switch (data.type) {
      case 'USER_UPDATED':
        // Invalidate user queries
        queryClient.invalidateQueries({ queryKey: ['users'] });
        break;
      case 'NOTIFICATION':
        toast.info(data.message);
        break;
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();
```

## 🧪 Testing API Integration

### Mock API Responses

```typescript
// test/mocks/api.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1;
    const limit = Number(req.url.searchParams.get('limit')) || 10;
    
    const users = Array.from({ length: limit }, (_, i) => ({
      id: `${page}-${i + 1}`,
      name: `User ${page}-${i + 1}`,
      email: `user${page}-${i + 1}@example.com`,
      role: 'user' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return res(
      ctx.status(200),
      ctx.json({
        data: users,
        pagination: {
          page,
          limit,
          total: 100,
          totalPages: 10,
          hasNext: page < 10,
          hasPrev: page > 1,
        },
      })
    );
  }),

  rest.post('/api/users', (req, res, ctx) => {
    const userData = req.body as any;
    
    return res(
      ctx.status(201),
      ctx.json({
        id: 'new-user-id',
        ...userData,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }),
];
```

### Testing API Hooks

```typescript
// users/hooks/__tests__/useUsers.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers } from '../useUsers';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useUsers', () => {
  it('should fetch users successfully', async () => {
    const { result } = renderHook(() => useUsers({ page: 1, limit: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data).toHaveLength(10);
    expect(result.current.data?.pagination.page).toBe(1);
  });
});
```

## 📚 API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | User logout |
| GET | `/auth/me` | Get current user |

### User Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List users (with pagination) |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| GET | `/users/search` | Search users |

### Role & Permission Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/roles` | List roles |
| GET | `/roles/:id` | Get role by ID |
| POST | `/roles` | Create new role |
| PUT | `/roles/:id` | Update role |
| DELETE | `/roles/:id` | Delete role |
| GET | `/permissions` | List permissions |

### Content Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/articles` | List articles |
| GET | `/articles/:id` | Get article by ID |
| POST | `/articles` | Create new article |
| PUT | `/articles/:id` | Update article |
| DELETE | `/articles/:id` | Delete article |

## 🔧 Best Practices

### 1. Query Key Management

Use consistent query key patterns:

```typescript
// Query key factory
export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params: UserParams) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
  },
};
```

### 2. Optimistic Updates

Implement optimistic updates for better UX:

```typescript
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userApi.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users', id] });
      
      // Snapshot previous value
      const previousUser = queryClient.getQueryData(['users', id]);
      
      // Optimistically update
      queryClient.setQueryData(['users', id], (old: User | undefined) => ({
        ...old,
        ...data,
      }));
      
      return { previousUser };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(['users', id], context.previousUser);
      }
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};
```

### 3. Error Retry Logic

Configure appropriate retry logic:

```typescript
export const useUsers = (params?: UserParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.getAll(params),
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error.response?.status >= 400 && error.response?.status < 500) {
        return false;
      }
      // Retry up to 3 times for network errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```

---

This API integration guide provides comprehensive patterns and best practices for working with the backend API in the Web 7B Frontend application. Follow these guidelines to ensure consistent, maintainable, and robust API integration. 