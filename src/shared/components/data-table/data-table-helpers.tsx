/**
 * Generic DataTable Helper Functions
 * Chuẩn hóa patterns cho DataTable across features
 */

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ActionButton } from './data-table-types';
import { createActionColumn } from './data-table';

/**
 * Generic pagination handler
 */
export function usePagination(
  currentPage: number,
  pageSize: number,
  total: number,
  onPageChange: (page: number) => void
) {
  return useMemo(() => ({
    current: currentPage,
    pageSize,
    total,
    onPageChange,
  }), [currentPage, pageSize, total, onPageChange]);
}

/**
 * Generic empty state configs
 */
export const createEmptyState = (
  icon: React.ReactNode,
  title: string,
  description: string
) => ({
  icon,
  title,
  description,
});

/**
 * Generic search config
 */
export const createSearchConfig = (placeholder: string) => ({
  searchable: true,
  searchPlaceholder: placeholder,
});

/**
 * Create table columns with actions helper
 */
export function createTableColumns<T>(
  baseColumns: ColumnDef<T, unknown>[],
  actions: ActionButton<T>[]
): ColumnDef<T, unknown>[] {
  return [
    ...baseColumns,
    createActionColumn(actions)
  ];
} 
