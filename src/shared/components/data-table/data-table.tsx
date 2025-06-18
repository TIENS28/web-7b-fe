import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type Row,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Search, Eye, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '../shadcn/button';
import { Input } from '../shadcn/input';
import { Card } from '../shadcn/card';
import { DataTableProps, ActionButton } from './data-table-types';

export function createActionColumn<T>(actions: ActionButton<T>[]): ColumnDef<T, unknown> {
  return {
    id: 'actions',
    header: () => (
      <span className="font-medium text-gray-900 dark:text-gray-100">
        Hành động
      </span>
    ),
    cell: ({ row }) => {
      const item = row.original;
      const visibleActions = actions.filter(action => 
        action.show ? action.show(item) : true
      );
      
      if (visibleActions.length === 0) return null;

      return (
        <div className="flex items-center justify-end space-x-2">
          {visibleActions.map((action, index) => {
            const isDisabled = action.disabled ? action.disabled(item) : false;
            
            let icon = action.icon;
            if (!icon) {
              switch (action.type) {
                case 'view':
                  icon = <Eye className="h-4 w-4" />;
                  break;
                case 'edit':
                  icon = <Edit className="h-4 w-4" />;
                  break;
                case 'delete':
                  icon = <Trash2 className="h-4 w-4" />;
                  break;
              }
            }

            return (
              <Button
                key={index}
                size="sm"
                variant="ghost"
                onClick={() => action.onClick(item)}
                disabled={isDisabled}
                className={`inline-flex items-center px-2 py-1 ${action.className || ''} ${
                  action.type === 'delete' 
                    ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
                title={action.label}
              >
                {icon}
              </Button>
            );
          })}
        </div>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  };
}

/**
 * Modern DataTable Component with TanStack Table
 * High-performance table component với advanced features
 */
export function DataTable<T = Record<string, unknown>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Tìm kiếm...',
  loading = false,
  emptyState,
  pagination,
  className = ''
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Global filter function
  const globalFilterFn = (row: Row<T>, _columnId: string, value: string) => {
    if (!value) return true;
    
    // Search through all string values in the row
    const searchValue = value.toLowerCase();
    const rowData = row.original as Record<string, unknown>;
    return Object.values(rowData).some(cellValue => 
      String(cellValue || '').toLowerCase().includes(searchValue)
    );
  };

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    globalFilterFn,
    enableGlobalFilter: searchable,
    initialState: {
      pagination: pagination ? {
        pageIndex: (pagination.current - 1) || 0,
        pageSize: pagination.pageSize || 10,
      } : undefined,
    },
  });

  // Update pagination when external pagination changes
  const paginationCurrent = pagination?.current;
  const paginationPageSize = pagination?.pageSize;
  
  useMemo(() => {
    if (pagination) {
      table.setPageIndex((pagination.current || 1) - 1);
      table.setPageSize(pagination.pageSize || 10);
    }
  }, [paginationCurrent, paginationPageSize, table, pagination]);

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const hasData = table.getRowModel().rows.length > 0;

  return (
    <Card className={`${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 max-w-sm"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                      (header.column.columnDef.meta as { className?: string })?.className || ''
                    }`}
                    style={{ width: (header.column.columnDef.meta as { width?: string })?.width }}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center space-x-2">
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {header.column.getCanSort() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => header.column.toggleSorting(header.column.getIsSorted() === "asc")}
                          >
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="h-3 w-3 text-blue-600" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ChevronDown className="h-3 w-3 text-blue-600" />
                            ) : (
                              <ArrowUpDown className="h-3 w-3 opacity-50" />
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {hasData ? (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {emptyState?.icon && (
                      <div className="text-4xl opacity-50">
                        {emptyState.icon}
                      </div>
                    )}
                    <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {emptyState?.title || 'Không có dữ liệu'}
                    </div>
                    {emptyState?.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {emptyState.description}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && hasData && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Hiển thị{' '}
              <span className="font-medium">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span>{' '}
              đến{' '}
              <span className="font-medium">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  pagination.total
                )}
              </span>{' '}
              trong tổng số{' '}
              <span className="font-medium">{pagination.total}</span> kết quả
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.current - 1)}
                disabled={pagination.current <= 1}
              >
                Trước
              </Button>
              
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Trang {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.current + 1)}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                Tiếp
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
} 
