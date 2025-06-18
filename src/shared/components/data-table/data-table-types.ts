/**
 * Data Table Types and Interfaces
 * Tách riêng để tránh fast refresh warning
 */

import { ReactNode } from 'react';
import { ColumnDef } from '@tanstack/react-table';

// TanStack Table DataTable Props Interface
export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyState?: {
    icon?: ReactNode;
    title?: string;
    description?: string;
  };
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
}

// Helper để tạo action columns
export interface ActionButton<T> {
  type: 'view' | 'edit' | 'delete' | 'custom';
  label?: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  disabled?: (item: T) => boolean;
  className?: string;
  show?: (item: T) => boolean;
} 
