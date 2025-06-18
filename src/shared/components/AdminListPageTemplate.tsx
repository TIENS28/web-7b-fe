/**
 * Generic Admin List Page Template
 * Chuẩn hóa structure và patterns cho admin list pages
 */

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from 'shared/components/shadcn/button';
import { Card } from 'shared/components/shadcn/card';
import { DataTable } from 'shared/components/data-table/data-table';
import { LucideIcon } from 'lucide-react';

interface AdminListPageTemplateProps<T> {
  // Header
  title: string;
  description: string;
  icon: LucideIcon;
  createButtonText?: string;
  onCreateClick?: () => void;

  // Data
  data: T[];
  columns: ColumnDef<T, unknown>[];
  loading?: boolean;
  error?: Error | null;

  // Search
  searchPlaceholder?: string;

  // Stats (optional)
  stats?: Array<{
    icon: LucideIcon;
    label: string;
    value: string | number;
    color: string;
  }>;

  // Empty state
  emptyState?: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };

  // Pagination (optional)
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export function AdminListPageTemplate<T>({
  title,
  description,
  icon: Icon,
  createButtonText,
  onCreateClick,
  data,
  columns,
  loading = false,
  error,
  searchPlaceholder = 'Tìm kiếm...',
  stats,
  emptyState,
  pagination
}: AdminListPageTemplateProps<T>) {
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Có lỗi xảy ra khi tải dữ liệu
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
        {createButtonText && onCreateClick && (
          <Button 
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {createButtonText}
          </Button>
        )}
      </div>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-xl font-bold dark:text-white">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* DataTable */}
      <DataTable<T>
        data={data}
        columns={columns}
        loading={loading}
        searchable={true}
        searchPlaceholder={searchPlaceholder}
        pagination={pagination}
        emptyState={emptyState}
        className="bg-white dark:bg-gray-800 dark:border-gray-700"
      />
    </div>
  );
}

export default AdminListPageTemplate; 
