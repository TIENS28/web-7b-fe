# Development Guide

## Overview

This guide provides comprehensive development standards, best practices, and workflow procedures for the Web 7B Frontend project.

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- VS Code (recommended)

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd web-7b-fe

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:5173
```

### VS Code Extensions (Recommended)
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript Importer** - Auto-import management
- **Tailwind CSS IntelliSense** - Tailwind class suggestions
- **Auto Rename Tag** - HTML/JSX tag renaming
- **Bracket Pair Colorizer** - Code bracket highlighting

## 📝 Coding Standards

### TypeScript Standards

#### 1. Strict TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### 2. Type Definitions
```typescript
// ✅ Good: Explicit type definitions
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ❌ Bad: Using any
const user: any = { id: 1, name: 'John' };

// ✅ Good: Proper typing
const user: User = { id: '1', name: 'John', email: 'john@example.com', role: 'user' };
```

#### 3. Generic Types
```typescript
// ✅ Good: Generic component
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
}

// ✅ Good: Generic hook
export const useApiData = <T>(endpoint: string) => {
  return useQuery<T[]>({
    queryKey: [endpoint],
    queryFn: () => api.get<T[]>(endpoint),
  });
};
```

### React Standards

#### 1. Component Structure
```typescript
// ✅ Good: Proper component structure
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/components/ui';
import { useUsers } from './hooks';
import type { UserListProps } from './types';

export const UserList: React.FC<UserListProps> = ({ onUserSelect }) => {
  const { t } = useTranslation();
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {users?.map((user) => (
        <UserCard key={user.id} user={user} onSelect={onUserSelect} />
      ))}
    </div>
  );
};
```

#### 2. Hook Usage
```typescript
// ✅ Good: Custom hook with proper typing
export const useUserManagement = () => {
  const queryClient = useQueryClient();
  
  const createUser = useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });

  return { createUser };
};
```

#### 3. Error Boundaries
```typescript
// ✅ Good: Error boundary implementation
export const UserListPage = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <UserList />
      </div>
    </ErrorBoundary>
  );
};
```

### Import Standards

#### 1. Import Order
```typescript
// ✅ Good: Proper import order
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Button, Card } from 'shared/components/ui';
import { useUsers } from './hooks';
import { userApi } from './services';
import type { User } from './types';
```

#### 2. Import Aliases
```typescript
// ✅ Good: Use aliases instead of relative paths
import { Button } from 'shared/components/ui';
import { useAuthStore } from 'app/stores/authStore';

// ❌ Bad: Deep relative imports
import { Button } from '../../../shared/components/ui/Button';
```

### Naming Conventions

#### 1. File Naming
```typescript
// ✅ Good: Consistent file naming
UserListPage.tsx          // Page components
UserCard.tsx              // Feature components
useUsers.ts               // Custom hooks
userApi.ts                // API services
userTypes.ts              // Type definitions
```

#### 2. Component Naming
```typescript
// ✅ Good: PascalCase for components
export const UserList = () => {};
export const UserCard = () => {};
export const UserForm = () => {};

// ✅ Good: camelCase for functions
export const useUsers = () => {};
export const userApi = {};
```

#### 3. Variable Naming
```typescript
// ✅ Good: Descriptive variable names
const userList = users.filter(user => user.isActive);
const isLoadingUsers = isFetching || isPending;

// ❌ Bad: Unclear variable names
const data = users.filter(u => u.active);
const loading = fetch || pending;
```

## 🎨 Styling Standards

### Tailwind CSS Usage

#### 1. Utility Classes
```typescript
// ✅ Good: Semantic utility classes
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
    User Management
  </h2>
  <Button variant="primary" size="sm">
    Add User
  </Button>
</div>
```

#### 2. Responsive Design
```typescript
// ✅ Good: Responsive utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card className="p-4 md:p-6">
    <h3 className="text-lg md:text-xl font-medium">Card Title</h3>
  </Card>
</div>
```

#### 3. Dark Mode Support
```typescript
// ✅ Good: Dark mode utilities
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
  <h1 className="text-gray-900 dark:text-gray-100">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### Component Styling

#### 1. Variant System
```typescript
// ✅ Good: Component variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

#### 2. CSS-in-JS (Avoid)
```typescript
// ❌ Bad: Avoid inline styles
<div style={{ backgroundColor: 'red', padding: '10px' }}>

// ✅ Good: Use Tailwind classes
<div className="bg-red-500 p-2.5">
```

## 🔧 State Management Standards

### React Query Usage

#### 1. Query Hooks
```typescript
// ✅ Good: Proper query hook
export const useUsers = (params?: UserParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.getAll(params),
    throwOnError: true,
    retry: (failureCount, error) => {
      if (error.response?.status >= 400 && error.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

#### 2. Mutation Hooks
```typescript
// ✅ Good: Proper mutation hook
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.create,
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.setQueryData(['users', newUser.id], newUser);
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });
};
```

### Zustand Usage

#### 1. Store Definition
```typescript
// ✅ Good: Proper store structure
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  
  login: async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      set({
        user: response.user,
        accessToken: response.accessToken,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },
}));
```

#### 2. Store Usage
```typescript
// ✅ Good: Selective store usage
const { user, isAuthenticated } = useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
}));

// ✅ Good: Action usage
const { login, logout } = useAuthStore();
```

## 🧪 Testing Standards

### Component Testing

#### 1. Test Structure
```typescript
// ✅ Good: Proper test structure
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { UserList } from './UserList';

describe('UserList', () => {
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  it('should render users correctly', () => {
    render(<UserList users={mockUsers} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should handle user selection', async () => {
    const onUserSelect = vi.fn();
    render(<UserList users={mockUsers} onUserSelect={onUserSelect} />);
    
    fireEvent.click(screen.getByText('John Doe'));
    
    await waitFor(() => {
      expect(onUserSelect).toHaveBeenCalledWith(mockUsers[0]);
    });
  });
});
```

#### 2. Hook Testing
```typescript
// ✅ Good: Hook testing
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from './useUsers';

describe('useUsers', () => {
  it('should fetch users successfully', async () => {
    const { result } = renderHook(() => useUsers());
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    expect(result.current.data).toEqual(mockUsers);
  });
});
```

### Test Utilities

#### 1. Custom Render Function
```typescript
// test/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'app/providers/ThemeProvider';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## 🔐 Security Standards

### Input Validation

#### 1. Form Validation
```typescript
// ✅ Good: Zod schema validation
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user', 'moderator']),
});

type UserFormData = z.infer<typeof userSchema>;

// ✅ Good: Form with validation
export const UserForm = () => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
    },
  });

  const onSubmit = (data: UserFormData) => {
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
```

### Authentication

#### 1. Protected Routes
```typescript
// ✅ Good: Protected route implementation
export function ProtectedRoute({ 
  children, 
  requirePermission 
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requirePermission && !user?.permissions?.includes(requirePermission)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}
```

#### 2. API Security
```typescript
// ✅ Good: Secure API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
```

## 🌍 Internationalization Standards

### Translation Usage

#### 1. Translation Keys
```typescript
// ✅ Good: Organized translation keys
// locales/en/translation.json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "save": "Save",
    "cancel": "Cancel"
  },
  "users": {
    "title": "User Management",
    "create": "Create User",
    "edit": "Edit User",
    "delete": "Delete User"
  }
}
```

#### 2. Component Usage
```typescript
// ✅ Good: Translation in components
export const UserList = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('users.title')}</h1>
      <Button>{t('users.create')}</Button>
    </div>
  );
};
```

## 📦 Build & Deployment Standards

### Environment Configuration

#### 1. Environment Variables
```typescript
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

#### 2. Environment Usage
```typescript
// ✅ Good: Environment variable usage
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const appName = import.meta.env.VITE_APP_NAME;

// ❌ Bad: Hardcoded values
const apiBaseUrl = 'http://localhost:3000/api';
```

### Build Process

#### 1. Development Build
```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

#### 2. Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle
npm run build:analyze
```

## 🔄 Development Workflow

### Git Workflow

#### 1. Branch Naming
```bash
# Feature branches
feature/user-management
feature/add-dark-mode
feature/fix-login-bug

# Bug fix branches
fix/typo-in-header
fix/api-error-handling

# Hotfix branches
hotfix/security-patch
hotfix/critical-bug
```

#### 2. Commit Messages
```bash
# ✅ Good: Conventional commit messages
feat: add user management feature
fix: resolve login authentication issue
docs: update API documentation
style: format code with prettier
refactor: extract user service logic
test: add unit tests for user components
chore: update dependencies
```

#### 3. Pull Request Process
1. Create feature branch from main
2. Implement feature following standards
3. Write tests for new functionality
4. Update documentation if needed
5. Create pull request with description
6. Request code review
7. Address review comments
8. Merge after approval

### Code Review Checklist

#### 1. Architecture Compliance
- [ ] Follows feature-based architecture
- [ ] Proper separation of concerns
- [ ] No direct imports between features
- [ ] Uses shared components appropriately

#### 2. Code Quality
- [ ] TypeScript strict mode compliance
- [ ] Proper error handling
- [ ] Performance considerations
- [ ] Security best practices

#### 3. Testing
- [ ] Unit tests for new components
- [ ] Integration tests for new features
- [ ] Test coverage requirements met
- [ ] Tests are meaningful and not just for coverage

#### 4. Documentation
- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] API changes documented
- [ ] README updated if needed

## 🚀 Performance Standards

### Optimization Guidelines

#### 1. Component Optimization
```typescript
// ✅ Good: Memoized components
export const UserCard = React.memo<UserCardProps>(({ user, onSelect }) => {
  return (
    <Card onClick={() => onSelect(user)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </Card>
  );
});

// ✅ Good: Memoized callbacks
export const UserList = () => {
  const handleUserSelect = useCallback((user: User) => {
    // Handle user selection
  }, []);

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} onSelect={handleUserSelect} />
      ))}
    </div>
  );
};
```

#### 2. Bundle Optimization
```typescript
// ✅ Good: Lazy loading
const UserManagement = React.lazy(() => import('./UserManagement'));
const UserDetail = React.lazy(() => import('./UserDetail'));

// ✅ Good: Dynamic imports
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

### Performance Monitoring

#### 1. Bundle Analysis
```bash
# Analyze bundle size
npm run build:analyze
```

#### 2. Performance Metrics
- Core Web Vitals monitoring
- Bundle size tracking
- Load time measurement

## 🐛 Debugging Standards

### Error Handling

#### 1. Error Boundaries
```typescript
// ✅ Good: Error boundary implementation
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

#### 2. Logging
```typescript
// ✅ Good: Structured logging
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },
};
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

### Tools
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

This development guide ensures consistent code quality, maintainability, and developer experience across the Web 7B Frontend project. Follow these standards to contribute effectively to the project. 