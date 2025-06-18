# Web 7B Frontend - Hospital Management System

A modern React-based frontend application for hospital management, built with TypeScript, Vite, and following a feature-based architecture.

## 🏗️ Architecture Overview

This project follows a **Hybrid Feature-based + Shared Architecture** pattern with clear separation between public and admin features.

### Project Structure
```
src/
├── app/                    # Global application setup
│   ├── providers/          # Global providers (Query, Theme, Auth, I18n)
│   ├── stores/             # Global Zustand stores
│   └── router/             # Global routing with lazy loading
├── shared/                 # Shared/reusable components & logic
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Global custom hooks
│   ├── lib/                # Third-party configurations
│   └── types/              # Global TypeScript types
├── public/                 # Public-facing features
│   ├── features/           # Feature modules (home, doctors, services)
│   ├── layouts/            # Public layouts
│   └── PublicRoutes.tsx    # Public routes aggregator
└── admin/                  # Admin-only features
    ├── features/           # Admin feature modules
    ├── layouts/            # Admin layouts
    └── AdminRoutes.tsx     # Admin routes aggregator
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd web-7b-fe

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Web 7B Hospital
VITE_APP_VERSION=1.0.0
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_SENTRY_DSN=your_sentry_dsn
```

## 🏛️ Architecture Principles

### 1. Feature-Based Organization
- Each feature is self-contained with its own components, pages, hooks, and services
- Features can only import from: own folder, shared/, config/, utils/
- No direct imports between features - use shared services or events

### 2. State Management Strategy
- **Server State**: TanStack Query (React Query) for API data
- **Client/UI State**: Zustand for global UI state
- **Local State**: React useState/useReducer for component-specific state

### 3. Routing & Lazy Loading
- All feature routes are lazy-loaded for optimal performance
- Protected routes with permission-based access control
- Error boundaries at page and router levels

## 📦 Core Technologies

### Frontend Framework
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router 6** for routing

### State Management
- **TanStack Query** for server state management
- **Zustand** for global UI state
- **React Hook Form** with Zod validation

### UI & Styling
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Lucide React** for icons
- **Dark Mode** support

### Development Tools
- **TypeScript** for type safety
- **ESLint** + **Prettier** for code formatting
- **Vitest** + **React Testing Library** for testing
- **i18next** for internationalization

## 🎯 Key Features

### Public Features
- **Home Page**: Hospital overview with banner, services, and doctor highlights
- **Doctors**: Doctor listings and detailed profiles
- **Services**: Medical services and pricing information
- **Articles**: News and medical articles
- **Authentication**: Login, registration, password recovery

### Admin Features
- **User Management**: CRUD operations for users
- **Role Management**: Role-based access control
- **Permission Management**: Granular permission system
- **Article Management**: Content management for articles
- **Service Management**: Medical services administration

### Shared Components
- **DataTable**: Reusable table component with sorting, filtering, pagination
- **Forms**: Standardized form components with validation
- **UI Components**: Button, Card, Dialog, Select, etc.
- **Layout Components**: Header, Footer, Navigation, Breadcrumbs

## 🔧 Development Guidelines

### Code Organization

#### Feature Structure
Every feature must follow this structure:
```
feature-name/
├── index.ts              # Export hub (MANDATORY)
├── router.tsx            # Feature routes (MANDATORY)
├── pages/                # Page components
├── components/           # Feature-specific components
├── hooks/                # React Query wrappers
├── services/             # API calls
├── types/                # TypeScript interfaces
└── utils/                # Feature utilities
```

#### Export Pattern
```typescript
// index.ts - Export hub
export { FeatureListPage, FeatureDetailPage } from './pages';
export { FeatureTable, FeatureForm } from './components';
export { useFeatures, useFeature } from './hooks';
export { featureApi } from './services';
export type { Feature, FeatureFormData } from './types';
export { default as FeatureRouter } from './router';
```

### API Integration

#### API Client Setup
```typescript
// shared/lib/apiInstance.ts
import axios from 'axios';
import { useAuthStore } from 'app/stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auth token interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### React Query Hooks
```typescript
// Feature hooks pattern
export const useFeatures = (params?: FeatureParams) => {
  return useQuery({
    queryKey: ['features', params],
    queryFn: () => featureApi.getAll(params),
    throwOnError: true, // Let ErrorBoundary catch
    retry: (failureCount, error) => {
      if (error.response?.status >= 400 && error.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
```

### Error Handling Strategy

#### Error Boundaries
- **MANDATORY**: Wrap all pages and feature routers with ErrorBoundary
- Use `throwOnError: true` in useQuery for automatic error propagation
- Handle mutation errors locally with `throwOnError: false`

#### Error Handling Pattern
```tsx
// Page component with error handling
export default function FeaturePage() {
  const { data, isLoading } = useFeatures(); // throwOnError: true

  if (isLoading) return <LoadingSpinner />;
  // Error will be caught by ErrorBoundary

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {/* Page content */}
    </ErrorBoundary>
  );
}
```

### Styling Guidelines

#### Tailwind CSS
- Use utility classes for styling
- Follow responsive design principles
- Support both light and dark modes

#### Dark Mode Support
```tsx
// Component with dark mode
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  <h1 className="text-2xl font-bold">Title</h1>
</div>
```

### Testing Requirements

#### Test Structure
- Test files must be colocated with source files
- Use `*.test.tsx` or `*.spec.tsx` naming
- Minimum 80% coverage for shared components

#### Testing Pattern
```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🚀 Performance Optimization

### Lazy Loading
All feature routes are lazy-loaded for optimal bundle size:
```tsx
const PublicRoutes = React.lazy(() => import('./PublicRoutes'));
const AdminRoutes = React.lazy(() => import('./AdminRoutes'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/admin/*" element={<AdminRoutes />} />
    <Route path="/*" element={<PublicRoutes />} />
  </Routes>
</Suspense>
```

### Code Splitting
- Feature-based code splitting
- Dynamic imports for heavy components
- Optimized bundle analysis

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Protected routes with permission checking
- Automatic token refresh
- Secure token storage

### Authorization
- Role-based access control (RBAC)
- Permission-based route protection
- Granular permission system

### Security Best Practices
- Input validation with Zod
- XSS protection
- CSRF protection
- Secure HTTP headers

## 🌍 Internationalization

### i18n Setup
- Support for Vietnamese and English
- Dynamic language switching
- Translation files in `locales/` directory

### Usage Pattern
```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  
  return <h1>{t('common.title')}</h1>;
}
```

## 📊 Data Tables

### DataTable Component
Reusable table component with advanced features:
- Sorting and filtering
- Pagination (client/server-side)
- Action columns
- Responsive design
- Dark mode support

### Usage Pattern
```tsx
import { DataTable } from 'shared/components/data-table';

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  createActionColumn({
    onView: (row) => navigate(`/users/${row.id}`),
    onEdit: (row) => navigate(`/users/${row.id}/edit`),
    onDelete: (row) => handleDelete(row.id),
  }),
];

<DataTable
  columns={columns}
  data={users}
  pagination={pagination}
  loading={isLoading}
/>
```

## 🧪 Testing Strategy

### Test Types
- **Unit Tests**: Component and utility functions
- **Integration Tests**: API integration and user flows
- **E2E Tests**: Critical user journeys

### Testing Tools
- **Vitest**: Fast unit testing
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Playwright**: E2E testing (planned)

### Coverage Requirements
- Shared components: 80% minimum
- Custom hooks: 100% business logic
- Critical pages: Integration tests required

## 📦 Build & Deployment

### Build Process
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test
npm run test:coverage
```

### Deployment
- **Vercel**: Automatic deployments from Git
- **Environment Variables**: Configured per environment
- **Build Optimization**: Automatic code splitting and optimization

## 🔧 Development Workflow

### Pre-commit Checklist
1. ✅ All imports follow ordering rules
2. ✅ TypeScript errors resolved
3. ✅ Tests passing with coverage
4. ✅ No hardcoded values
5. ✅ Error boundaries in place
6. ✅ Lazy loading implemented
7. ✅ API calls use centralized client
8. ✅ Zustand stores for UI state only
9. ✅ React Query for server state
10. ✅ Environment variables typed

### Code Review Focus
- Performance: Check for unnecessary re-renders
- Security: Validate auth flows and data exposure
- Accessibility: ARIA labels and keyboard navigation
- Error Handling: Graceful degradation
- Type Safety: No `any` types without justification

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### User Management
- `GET /users` - List users
- `POST /users` - Create user
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Role & Permission Management
- `GET /roles` - List roles
- `GET /permissions` - List permissions
- `POST /roles` - Create role
- `PUT /roles/:id` - Update role

### Content Management
- `GET /articles` - List articles
- `POST /articles` - Create article
- `GET /articles/:id` - Get article details
- `PUT /articles/:id` - Update article

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Check types
npm run type-check

# Fix auto-fixable issues
npm run lint:fix
```

#### Test Failures
```bash
# Run tests in watch mode
npm run test:watch

# Check test coverage
npm run test:coverage
```

### Performance Issues
- Check bundle size with `npm run build:analyze`
- Verify lazy loading is working
- Monitor React Query cache usage

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Follow coding standards
4. Write tests for new features
5. Submit a pull request

### Coding Standards
- Follow TypeScript strict mode
- Use ESLint and Prettier
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

---

**Last Updated**: December 2024
**Version**: 1.0.0 