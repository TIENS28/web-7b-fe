# Component Library Documentation

## Overview

This document provides comprehensive documentation for the shared component library used throughout the Web 7B Frontend application. All components are built with TypeScript, support dark mode, and follow consistent design patterns.

## 🎨 Design System

### Color Palette

```typescript
// Tailwind CSS color system
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
};
```

### Typography

```typescript
// Text size classes
const textSizes = {
  xs: 'text-xs',      // 12px
  sm: 'text-sm',      // 14px
  base: 'text-base',  // 16px
  lg: 'text-lg',      // 18px
  xl: 'text-xl',      // 20px
  '2xl': 'text-2xl',  // 24px
  '3xl': 'text-3xl',  // 30px
};
```

### Spacing

```typescript
// Spacing scale
const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
};
```

## 🔘 Button Component

### Basic Usage

```tsx
import { Button } from 'shared/components/ui';

// Default button
<Button>Click me</Button>

// With variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Menu</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// With loading state
<Button loading>Loading...</Button>

// With icons
<Button>
  <PlusIcon className="w-4 h-4 mr-2" />
  Add User
</Button>
```

### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
}
```

### Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| `default` | Primary button with solid background | Main actions, CTAs |
| `destructive` | Red button for destructive actions | Delete, remove |
| `outline` | Button with border and transparent background | Secondary actions |
| `ghost` | Transparent button with hover effects | Menu items, subtle actions |
| `link` | Button that looks like a link | Navigation, cancel |

### Examples

```tsx
// Form actions
<div className="flex gap-2">
  <Button type="submit" loading={isSubmitting}>
    Save Changes
  </Button>
  <Button variant="outline" onClick={onCancel}>
    Cancel
  </Button>
</div>

// Action buttons
<div className="flex gap-2">
  <Button variant="outline" size="sm">
    <EyeIcon className="w-4 h-4 mr-1" />
    View
  </Button>
  <Button variant="outline" size="sm">
    <EditIcon className="w-4 h-4 mr-1" />
    Edit
  </Button>
  <Button variant="destructive" size="sm">
    <TrashIcon className="w-4 h-4 mr-1" />
    Delete
  </Button>
</div>
```

## 📋 Input Component

### Basic Usage

```tsx
import { Input } from 'shared/components/ui';

// Basic input
<Input placeholder="Enter your name" />

// With label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>

// With error state
<Input 
  error="Email is required"
  placeholder="Enter your email" 
/>

// With icon
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
  <Input className="pl-10" placeholder="Search..." />
</div>
```

### Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

### Examples

```tsx
// Form input with validation
<div className="space-y-2">
  <Label htmlFor="username">Username</Label>
  <Input
    id="username"
    name="username"
    placeholder="Enter username"
    error={errors.username?.message}
    {...register('username')}
  />
</div>

// Search input
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
  <Input
    className="pl-10 pr-10"
    placeholder="Search users..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  {searchQuery && (
    <button
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      onClick={() => setSearchQuery('')}
    >
      <XIcon className="w-4 h-4" />
    </button>
  )}
</div>
```

## 📊 DataTable Component

### Basic Usage

```tsx
import { DataTable } from 'shared/components/data-table';
import { createActionColumn } from 'shared/components/data-table/data-table-helpers';

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
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
  searchable
  onSearch={handleSearch}
/>
```

### Props

```typescript
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationProps;
  searchable?: boolean;
  onSearch?: (query: string) => void;
  emptyState?: React.ReactNode;
  className?: string;
}
```

### Column Definitions

```typescript
// Basic column
{ accessorKey: 'name', header: 'Name' }

// Custom cell renderer
{
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => (
    <Badge variant={row.original.status === 'active' ? 'success' : 'secondary'}>
      {row.original.status}
    </Badge>
  ),
}

// Sortable column
{
  accessorKey: 'createdAt',
  header: 'Created At',
  cell: ({ row }) => formatDate(row.original.createdAt),
  enableSorting: true,
}
```

### Action Column

```typescript
// Create action column with custom actions
const actionColumn = createActionColumn({
  onView: (row) => navigate(`/users/${row.id}`),
  onEdit: (row) => navigate(`/users/${row.id}/edit`),
  onDelete: (row) => handleDelete(row.id),
  customActions: [
    {
      label: 'Activate',
      icon: CheckIcon,
      onClick: (row) => handleActivate(row.id),
      show: (row) => !row.isActive,
    },
  ],
});
```

### Pagination

```typescript
// Server-side pagination
const pagination = {
  page: 1,
  limit: 10,
  total: 100,
  totalPages: 10,
  onPageChange: (page: number) => setPage(page),
  onLimitChange: (limit: number) => setLimit(limit),
};

// Client-side pagination (no onPageChange needed)
const pagination = {
  page: 1,
  limit: 10,
  total: 100,
  totalPages: 10,
};
```

### Examples

```tsx
// Complete user table
export const UserTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useUsers({ page, limit, search });
  
  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.role}</Badge>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'success' : 'secondary'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    createActionColumn({
      onView: (row) => navigate(`/users/${row.id}`),
      onEdit: (row) => navigate(`/users/${row.id}/edit`),
      onDelete: (row) => handleDelete(row.id),
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={data?.data || []}
      pagination={{
        page,
        limit,
        total: data?.pagination.total || 0,
        totalPages: data?.pagination.totalPages || 0,
        onPageChange: setPage,
        onLimitChange: setLimit,
      }}
      loading={isLoading}
      searchable
      onSearch={setSearch}
      emptyState={
        <div className="text-center py-8">
          <p className="text-gray-500">No users found</p>
        </div>
      }
    />
  );
};
```

## 🎭 Modal/Dialog Component

### Basic Usage

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'shared/components/ui';

const [isOpen, setIsOpen] = useState(false);

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create User</DialogTitle>
    </DialogHeader>
    <UserForm onSubmit={handleSubmit} />
  </DialogContent>
</Dialog>
```

### Props

```typescript
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

### Examples

```tsx
// Confirmation dialog
const ConfirmDeleteDialog = ({ isOpen, onClose, onConfirm, itemName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to delete "{itemName}"?</p>
          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Form dialog
const UserFormDialog = ({ isOpen, onClose, user, onSubmit }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Edit User' : 'Create User'}
          </DialogTitle>
        </DialogHeader>
        <UserForm
          user={user}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
```

## 🏷️ Badge Component

### Basic Usage

```tsx
import { Badge } from 'shared/components/ui';

// Default badge
<Badge>New</Badge>

// With variants
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="outline">Draft</Badge>

// With sizes
<Badge size="sm">Small</Badge>
<Badge size="default">Default</Badge>
```

### Props

```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'default';
  children: React.ReactNode;
}
```

### Examples

```tsx
// Status badges
const StatusBadge = ({ status }) => {
  const variants = {
    active: 'success',
    inactive: 'secondary',
    pending: 'warning',
    suspended: 'error',
  };

  return (
    <Badge variant={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Role badges
const RoleBadge = ({ role }) => {
  const variants = {
    admin: 'error',
    moderator: 'warning',
    user: 'default',
  };

  return (
    <Badge variant={variants[role]}>
      {role}
    </Badge>
  );
};
```

## 📝 Form Components

### Form Field

```tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from 'shared/components/ui';

<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} type="email" placeholder="Enter your email" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Select Field

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'shared/components/ui';

<FormField
  control={form.control}
  name="role"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Role</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="moderator">Moderator</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Checkbox Field

```tsx
import { Checkbox } from 'shared/components/ui';

<FormField
  control={form.control}
  name="isActive"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Active</FormLabel>
        <p className="text-sm text-gray-500">
          User account is active and can access the system
        </p>
      </div>
    </FormItem>
  )}
/>
```

## 🎨 Layout Components

### Card Component

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'shared/components/ui';

<Card>
  <CardHeader>
    <CardTitle>User Information</CardTitle>
    <CardDescription>
      Basic information about the user
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <p className="text-sm text-gray-600">John Doe</p>
      </div>
      <div>
        <Label>Email</Label>
        <p className="text-sm text-gray-600">john@example.com</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### Loading Spinner

```tsx
import { LoadingSpinner } from 'shared/components/ui';

// Default spinner
<LoadingSpinner />

// With size
<LoadingSpinner size="sm" />
<LoadingSpinner size="lg" />

// With text
<LoadingSpinner>Loading users...</LoadingSpinner>
```

### Error Fallback

```tsx
import { ErrorFallback } from 'shared/components';

<ErrorFallback
  error={error}
  resetErrorBoundary={() => window.location.reload()}
/>
```

## 🌙 Dark Mode Support

All components automatically support dark mode through Tailwind CSS classes:

```tsx
// Example of dark mode classes
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
  <h1 className="text-gray-900 dark:text-gray-100">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### Theme Switching

```tsx
import { useTheme } from 'shared/hooks/useTheme';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="outline" onClick={toggleTheme}>
      {theme === 'dark' ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
    </Button>
  );
};
```

## 📱 Responsive Design

All components are built with responsive design in mind:

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>
    <CardContent>Content</CardContent>
  </Card>
</div>

// Responsive text
<h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Title</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">Content</div>
```

## 🧪 Testing Components

### Component Testing

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should show loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Accessibility Testing

```typescript
// Accessibility tests
it('should have proper ARIA labels', () => {
  render(<Button aria-label="Delete user">Delete</Button>);
  expect(screen.getByLabelText('Delete user')).toBeInTheDocument();
});

it('should be keyboard accessible', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  screen.getByText('Click me').focus();
  fireEvent.keyDown(screen.getByText('Click me'), { key: 'Enter' });
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## 📚 Component Guidelines

### 1. Props Interface

Always define proper TypeScript interfaces for component props:

```typescript
interface ComponentProps {
  // Required props
  children: React.ReactNode;
  
  // Optional props with defaults
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  
  // Event handlers
  onClick?: () => void;
  onChange?: (value: string) => void;
  
  // HTML attributes
  className?: string;
  disabled?: boolean;
}
```

### 2. Default Props

Use default props for optional values:

```typescript
const Component: React.FC<ComponentProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  // Component implementation
};
```

### 3. Forwarding Refs

Forward refs when needed:

```typescript
const Component = React.forwardRef<HTMLButtonElement, ComponentProps>(
  ({ children, ...props }, ref) => {
    return (
      <button ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Component.displayName = 'Component';
```

### 4. Compound Components

Use compound components for complex UI patterns:

```typescript
const Card = ({ children, ...props }: CardProps) => (
  <div {...props}>{children}</div>
);

Card.Header = ({ children, ...props }: CardHeaderProps) => (
  <div {...props}>{children}</div>
);

Card.Content = ({ children, ...props }: CardContentProps) => (
  <div {...props}>{children}</div>
);

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Content>Content</Card.Content>
</Card>
```

---

This component library documentation provides comprehensive guidance for using and extending the shared components in the Web 7B Frontend application. Follow these patterns to ensure consistency and maintainability across the codebase. 