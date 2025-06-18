# Architecture Documentation

## Overview

The Web 7B Frontend follows a **Hybrid Feature-based + Shared Architecture** designed for scalability, maintainability, and developer experience. This document outlines the architectural decisions, patterns, and implementation details.

## 🏗️ Architectural Principles

### 1. Separation of Concerns
- **Public Features**: User-facing functionality (home, doctors, services)
- **Admin Features**: Administrative functionality (user management, content management)
- **Shared Components**: Reusable UI components and utilities
- **Global State**: Application-wide state management

### 2. Feature-Based Organization
Each feature is self-contained with its own:
- Components
- Pages
- Hooks (React Query wrappers)
- Services (API calls)
- Types (TypeScript interfaces)
- Utils (feature-specific utilities)

### 3. Dependency Management
- Features can only import from: own folder, shared/, config/, utils/
- No direct imports between features
- Communication between features via shared services or events

## 📁 Directory Structure

```
src/
├── app/                         # Global application setup
│   ├── App.tsx                  # Root component
│   ├── providers/               # Global providers
│   │   ├── QueryProvider.tsx    # React Query setup
│   │   ├── ThemeProvider.tsx    # Theme configuration
│   │   ├── AuthProvider.tsx     # Authentication
│   │   └── I18nProvider.tsx     # Internationalization
│   ├── stores/                  # Global Zustand stores
│   │   ├── authStore.ts         # Authentication state
│   │   ├── themeStore.ts        # Theme state
│   │   └── uiStore.ts           # Global UI state
│   └── router/                  # Global routing
│       ├── AppRouter.tsx        # Main router with lazy loading
│       └── ProtectedRoute.tsx   # Route guards
├── shared/                      # Shared/reusable logic
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Common components
│   │   ├── shadcn/              # shadcn/ui components
│   │   ├── forms/               # Form components
│   │   ├── layout/              # Layout components
│   │   └── data-table/          # Data table components
│   ├── hooks/                   # Global custom hooks
│   ├── lib/                     # Third-party configurations
│   │   ├── apiInstance.ts       # Axios instance
│   │   ├── react-query.ts       # React Query config
│   │   └── zod-schemas.ts       # Validation schemas
│   ├── types/                   # Global TypeScript types
│   ├── config/                  # App configuration
│   ├── constants/               # Application constants
│   └── assets/                  # Static assets
├── public/                      # Public-facing features
│   ├── features/                # Feature modules
│   │   ├── home/                # Home page feature
│   │   ├── doctors/             # Doctors feature
│   │   ├── services/            # Services feature
│   │   └── articles/            # Articles feature
│   ├── layouts/                 # Public layouts
│   └── PublicRoutes.tsx         # Public routes aggregator
└── admin/                       # Admin-only features
    ├── features/                # Admin feature modules
    │   ├── users/               # User management
    │   ├── roles/               # Role management
    │   ├── permissions/         # Permission management
    │   └── articles/            # Article management
    ├── layouts/                 # Admin layouts
    └── AdminRoutes.tsx          # Admin routes aggregator
```

## 🔄 State Management Architecture

### State Categories

#### 1. Server State (TanStack Query)
**Purpose**: Manage data from APIs
**Location**: Feature-specific hooks in `[feature]/hooks/`
**Characteristics**:
- Automatic caching and synchronization
- Background refetching
- Optimistic updates
- Error handling with retry logic

```typescript
// Example: users/hooks/useUsers.ts
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
  });
};
```

#### 2. Global UI State (Zustand)
**Purpose**: Application-wide UI state
**Location**: `app/stores/`
**Characteristics**:
- Lightweight and fast
- TypeScript support
- Middleware support (persist, devtools)
- Minimal boilerplate

```typescript
// Example: app/stores/authStore.ts
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // Implementation
  },
  logout: () => {
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
```

#### 3. Local Component State (React Hooks)
**Purpose**: Component-specific state
**Location**: Within components
**Characteristics**:
- Simple state management
- Form state
- UI interactions
- Temporary data

```typescript
// Example: Component local state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState(initialData);
```

## 🛣️ Routing Architecture

### Route Organization

#### 1. Global Router (`AppRouter.tsx`)
- Handles top-level routing
- Implements lazy loading for major sections
- Provides error boundaries
- Manages authentication redirects

#### 2. Feature Routers
Each feature has its own router:
- Self-contained routing logic
- Feature-specific route guards
- Error boundaries at feature level

#### 3. Protected Routes
- Authentication-based protection
- Permission-based access control
- Automatic redirects for unauthorized access

### Lazy Loading Strategy

```typescript
// Lazy load feature routes
const PublicRoutes = React.lazy(() => import('./PublicRoutes'));
const AdminRoutes = React.lazy(() => import('./AdminRoutes'));

// Lazy load individual pages
const UserListPage = React.lazy(() => import('./pages/UserListPage'));
const UserDetailPage = React.lazy(() => import('./pages/UserDetailPage'));
```

## 🔧 Component Architecture

### Component Categories

#### 1. Page Components
**Location**: `[feature]/pages/`
**Purpose**: Top-level components for routes
**Characteristics**:
- Handle data fetching
- Implement error boundaries
- Manage page-level state
- Coordinate child components

#### 2. Feature Components
**Location**: `[feature]/components/`
**Purpose**: Feature-specific UI components
**Characteristics**:
- Business logic specific to feature
- Feature-specific styling
- Reusable within feature

#### 3. Shared Components
**Location**: `shared/components/`
**Purpose**: Reusable across features
**Characteristics**:
- Generic and configurable
- No business logic
- Consistent styling
- Well-documented props

#### 4. Layout Components
**Location**: `[section]/layouts/`
**Purpose**: Page structure and navigation
**Characteristics**:
- Consistent layout across pages
- Navigation and breadcrumbs
- Sidebar and header management

### Component Patterns

#### 1. Container/Presentational Pattern
```typescript
// Container component (handles logic)
const UserListContainer = () => {
  const { data, isLoading } = useUsers();
  return <UserList data={data} loading={isLoading} />;
};

// Presentational component (handles UI)
const UserList = ({ data, loading }: UserListProps) => {
  if (loading) return <LoadingSpinner />;
  return <div>{/* render users */}</div>;
};
```

#### 2. Compound Component Pattern
```typescript
// DataTable with compound components
<DataTable data={users}>
  <DataTable.Header>
    <DataTable.Column accessorKey="name">Name</DataTable.Column>
  </DataTable.Header>
  <DataTable.Body>
    {/* render rows */}
  </DataTable.Body>
</DataTable>
```

## 🔌 API Integration Architecture

### API Client Setup

#### 1. Centralized API Instance
```typescript
// shared/lib/apiInstance.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
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

#### 2. Feature-Specific API Services
```typescript
// users/services/userApi.ts
export const userApi = {
  getAll: (params?: UserParams) => 
    api.get<User[]>('/users', { params }),
  
  getById: (id: string) => 
    api.get<User>(`/users/${id}`),
  
  create: (data: CreateUserData) => 
    api.post<User>('/users', data),
  
  update: (id: string, data: UpdateUserData) => 
    api.put<User>(`/users/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/users/${id}`),
};
```

### React Query Integration

#### 1. Query Hooks Pattern
```typescript
// users/hooks/useUsers.ts
export const useUsers = (params?: UserParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.getAll(params),
    throwOnError: true,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getById(id),
    enabled: !!id,
    throwOnError: true,
  });
};
```

#### 2. Mutation Hooks Pattern
```typescript
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });
};
```

## 🎨 Styling Architecture

### Tailwind CSS Integration

#### 1. Utility-First Approach
- Use Tailwind utility classes for styling
- Custom components extend base utilities
- Consistent design system

#### 2. Dark Mode Support
```typescript
// Theme configuration
const theme = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... other shades
        },
      },
    },
  },
};
```

#### 3. Component Variants
```typescript
// Button component with variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
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

## 🧪 Testing Architecture

### Testing Strategy

#### 1. Unit Tests
- Component testing with React Testing Library
- Hook testing with custom render functions
- Utility function testing

#### 2. Integration Tests
- API integration testing
- User flow testing
- Form submission testing

#### 3. E2E Tests (Planned)
- Critical user journeys
- Cross-browser testing
- Performance testing

### Testing Patterns

#### 1. Component Testing
```typescript
// Component test example
describe('UserList', () => {
  it('should render users correctly', () => {
    const users = mockUsers;
    render(<UserList users={users} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });
});
```

#### 2. Hook Testing
```typescript
// Hook test example
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

## 🔐 Security Architecture

### Authentication Flow

#### 1. JWT Token Management
- Access token for API requests
- Refresh token for token renewal
- Secure token storage
- Automatic token refresh

#### 2. Route Protection
```typescript
// Protected route component
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

### Authorization Patterns

#### 1. Permission-Based Access Control
- Granular permissions system
- Role-based permissions
- Feature-level access control

#### 2. Data Access Control
- User can only access authorized data
- API-level permission checking
- UI-level permission hiding

## 🌍 Internationalization Architecture

### i18n Setup

#### 1. Translation Structure
```
locales/
├── en/
│   └── translation.json
├── vi/
│   └── translation.json
└── i18n.ts
```

#### 2. Translation Usage
```typescript
// Component with translations
function WelcomeMessage() {
  const { t } = useTranslation();
  
  return (
    <h1>{t('welcome.title')}</h1>
    <p>{t('welcome.description')}</p>
  );
}
```

## 📊 Performance Architecture

### Optimization Strategies

#### 1. Code Splitting
- Route-based code splitting
- Component-level lazy loading
- Dynamic imports for heavy components

#### 2. Bundle Optimization
- Tree shaking for unused code
- Minification and compression
- Asset optimization

#### 3. Caching Strategy
- React Query caching
- Browser caching
- CDN caching for static assets

### Performance Monitoring

#### 1. Bundle Analysis
```bash
npm run build:analyze
```

#### 2. Performance Metrics
- Core Web Vitals
- Bundle size monitoring
- Load time tracking

## 🔄 Data Flow Architecture

### Unidirectional Data Flow

#### 1. State Updates
```
User Action → Component → Hook → API → Store → UI Update
```

#### 2. Error Handling
```
API Error → React Query → Error Boundary → UI Error State
```

#### 3. Optimistic Updates
```
User Action → Optimistic Update → API Call → Success/Error → UI Update
```

## 🚀 Deployment Architecture

### Build Process

#### 1. Development Build
- Hot module replacement
- Source maps
- Development optimizations

#### 2. Production Build
- Code minification
- Tree shaking
- Asset optimization
- Environment-specific configuration

### Deployment Strategy

#### 1. Vercel Deployment
- Automatic deployments from Git
- Environment variable management
- Preview deployments for PRs

#### 2. Environment Configuration
- Development environment
- Staging environment
- Production environment

## 🔧 Development Workflow

### Development Process

#### 1. Feature Development
1. Create feature branch
2. Implement feature following architecture patterns
3. Write tests
4. Update documentation
5. Submit pull request

#### 2. Code Review Process
- Architecture compliance
- Performance considerations
- Security review
- Testing coverage

#### 3. Quality Assurance
- Automated testing
- Manual testing
- Performance testing
- Security testing

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless application design
- CDN for static assets
- Load balancing ready

### Vertical Scaling
- Efficient component rendering
- Optimized bundle sizes
- Memory usage optimization

### Feature Scaling
- Modular architecture
- Independent feature development
- Shared component library

---

This architecture documentation provides a comprehensive overview of the technical decisions and patterns used in the Web 7B Frontend application. It serves as a guide for developers working on the project and ensures consistency across the codebase. 