/**
 * Trang quản lý bài viết
 * Hiển thị danh sách bài viết với tính năng tìm kiếm, lọc, phân trang
 * Sử dụng DataTable component với TanStack Table
 */

import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArticles, deleteArticle } from 'shared/features/articles/services/ArticlesApi';
import { Article } from 'shared/features/articles/types/Article.types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DataTable, createActionColumn } from 'shared/components/data-table/data-table';
import { Button } from 'shared/components/shadcn/button';
import { Badge } from 'shared/components/shadcn/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';

const ArticlesManagement: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: articlesList, isLoading, isError, error } = useQuery<Article[], Error>({
    queryKey: ['adminArticlesList'],
    queryFn: () => getArticles({ language: 'vi' }),
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteArticle,
    onSuccess: () => {
      toast.success('Xóa bài viết thành công!');
      queryClient.invalidateQueries({ queryKey: ['adminArticlesList'] });
    },
    onError: (err) => {
      toast.error(`Lỗi khi xóa bài viết: ${err.message}`);
    },
  });

  

  // Định nghĩa columns cho DataTable
  const columnHelper = createColumnHelper<Article>();

  const columns = useMemo(() => [
    columnHelper.accessor(
      row => row.translations.find(t => t.languageCode === 'vi')?.title || '',
      {
        id: 'title',
        header: 'Tiêu đề',
        enableSorting: true,
        cell: info => {
          const article = info.row.original;
          const translation = article.translations.find(t => t.languageCode === 'vi') || article.translations[0];
          return (
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {translation?.title || 'N/A'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {article.slug}
              </div>
            </div>
          );
        }
      }
    ),
  
    columnHelper.accessor('authorName', {
      id: 'author',
      header: 'Tác giả',
      enableSorting: true,
      cell: info => (
        <div className="text-sm text-gray-900 dark:text-white">
          {info.getValue() || 'Không có tác giả'}
        </div>
      )
    }),
  
    columnHelper.accessor('status', {
      header: 'Trạng thái',
      enableSorting: true,
      cell: info => {
        const status = info.getValue();
        const statusConfig = {
          PUBLISHED: { label: 'Đã xuất bản', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' },
          DRAFT: { label: 'Bản nháp', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' },
          ARCHIVED: { label: 'Đã lưu trữ', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200' }
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ARCHIVED;
        return (
          <Badge className={`text-xs ${config.className}`}>
            {config.label}
          </Badge>
        );
      }
    }),
  
    columnHelper.accessor('createdAt', {
      header: 'Ngày tạo',
      enableSorting: true,
      cell: info => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(info.getValue()).toLocaleDateString('vi-VN')}
        </div>
      )
    }),
  ], [columnHelper]);

  // Create complete columns with actions
  const tableColumns = useMemo(() => {
    const handleDelete = (article: Article) => {
      if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${article.translations.find(t => t.languageCode === 'vi')?.title || 'N/A'}"?`)) {
        deleteMutation.mutate(article.id);
      }
    };
    const actions = [
      {
        type: 'view' as const,
        label: 'Xem chi tiết',
        onClick: (article: Article) => navigate(`/admin/articles/${article.slug}`),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        type: 'edit' as const,
        label: 'Chỉnh sửa',
        onClick: (article: Article) => navigate(`/admin/articles/${article.slug}/edit`),
        icon: <Edit className="h-4 w-4" />,
      },
      {
        type: 'delete' as const,
        label: 'Xóa bài viết',
        onClick: handleDelete,
        icon: <Trash2 className="h-4 w-4" />,
        disabled: (article: Article) => deleteMutation.isPending && deleteMutation.variables === article.id,
      },
    ];

    return [
      ...columns,
      createActionColumn(actions)
    ];
  }, [columns, navigate, deleteMutation.isPending, deleteMutation.variables]);

  if (isError) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">Lỗi khi tải dữ liệu</div>
          <p className="text-gray-600 dark:text-gray-400">{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý bài viết
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Quản lý tất cả bài viết trong hệ thống
            </p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/admin/articles/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo bài viết
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        data={articlesList || []}
        columns={tableColumns as ColumnDef<Article, unknown>[]}
        loading={isLoading}
        searchable={true}
        searchPlaceholder="Tìm kiếm bài viết..."
        emptyState={{
          icon: <FileText className="h-12 w-12" />,
          title: 'Không có bài viết nào',
          description: 'Bắt đầu bằng cách tạo bài viết đầu tiên'
        }}
        className="bg-white dark:bg-gray-800 dark:border-gray-700"
      />
    </div>
  );
};

export default ArticlesManagement; 
