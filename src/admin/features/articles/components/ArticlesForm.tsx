import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArticleBySlug, getArticleById, createArticle, updateArticle } from 'shared/features/articles/services/ArticlesApi';
import type { Article, CreateArticleRequest, UpdateArticleRequest } from 'shared/features/articles/types/Article.types';
import { Button } from 'shared/components/shadcn/button';
import { Input } from 'shared/components/shadcn/input';
import { Label } from 'shared/components/shadcn/label';
import { TipTapEditor } from 'shared/components/editor/tiptap-editor';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider';

// ==================== Props Interface ====================
interface ArticlesFormProps {
  mode?: 'create' | 'edit';
  articleId?: string;
}

// Zod schema cho một bản dịch
const articleTranslationSchema = z.object({
  languageCode: z.string().min(2, { message: "Mã ngôn ngữ phải có ít nhất 2 ký tự." }),
  title: z.string().min(1, { message: "Tiêu đề không được để trống." }),
  content: z.string().min(1, { message: "Nội dung không được để trống." }),
  excerpt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Zod schema cho toàn bộ form bài viết
const articleFormSchema = z.object({
  slug: z.string().min(1, { message: "Slug chính không được để trống." }),
  authorName: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  featuredImage: z.string().url({ message: "URL ảnh đại diện không hợp lệ." }).optional().or(z.literal('')),
  translations: z.array(articleTranslationSchema).min(1, { message: "Phải có ít nhất một bản dịch." }),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

const ArticlesForm: React.FC<ArticlesFormProps> = ({ mode, articleId }) => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Xác định mode dựa trên props hoặc URL params
  const finalSlugOrId = articleId || slug;
  const isEditMode = mode === 'edit' || !!finalSlugOrId;

  // Lấy bài viết theo slug để có được ID và thông tin đầy đủ
  const { data: existingArticle, isLoading: isLoadingArticle, error: loadingError } = useQuery<Article | null, Error>({
    queryKey: ['adminArticleDetail', finalSlugOrId],
    queryFn: async () => {
      if (!finalSlugOrId) return null;
      
      // Nếu là edit mode và có slug, trước tiên lấy bài viết theo slug để có ID
      try {
        return await getArticleBySlug(finalSlugOrId);
      } catch {
        // Nếu không tìm thấy theo slug, thử theo ID
        try {
          return await getArticleById(finalSlugOrId);
        } catch {
          throw new Error(`Không thể tải bài viết với slug/ID: ${finalSlugOrId}`);
        }
      }
    },
    enabled: isEditMode && !!finalSlugOrId,
    staleTime: 5 * 60 * 1000,
  });

  const defaultValues: ArticleFormValues = {
    slug: '',
    authorName: '',
    status: 'DRAFT',
    featuredImage: '',
    translations: [{ 
      languageCode: 'vi', 
      title: '', 
      content: '', 
      excerpt: '', 
      metaTitle: '', 
      metaDescription: '' 
    }],
  };

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: defaultValues
  });

  const { fields: translationFields, append: appendTranslation, remove: removeTranslation } = useFieldArray({
    control,
    name: "translations"
  });
  
  useEffect(() => {
    if (isEditMode && existingArticle) {
      const formData: ArticleFormValues = {
        slug: existingArticle.slug,
        authorName: existingArticle.authorName || '',
        status: existingArticle.status,
        featuredImage: existingArticle.featuredImage || '',
        translations: existingArticle.translations.map(t => ({
          languageCode: t.languageCode,
          title: t.title,
          content: t.content,
          excerpt: t.excerpt || '',
          metaTitle: t.metaTitle || '',
          metaDescription: t.metaDescription || '',
        })),
      };
      reset(formData);
    } else if (!isEditMode) {
        reset(defaultValues);
    }
  }, [existingArticle, isEditMode, reset]);

  const createArticleMutation = useMutation<Article, Error, CreateArticleRequest>({
    mutationFn: createArticle,
    onSuccess: () => {
      toast.success('Tạo bài viết thành công!');
      queryClient.invalidateQueries({ queryKey: ['adminArticlesList'] });
      navigate('/admin/articles');
    },
    onError: (error) => {
      toast.error(`Lỗi khi tạo bài viết: ${error.message}`);
    }
  });

  const updateArticleMutation = useMutation<Article, Error, { id: string; payload: UpdateArticleRequest }>({
    mutationFn: (variables) => updateArticle(variables.id, variables.payload),
    onSuccess: () => {
      toast.success('Cập nhật bài viết thành công!');
      queryClient.invalidateQueries({ queryKey: ['adminArticlesList'] });
      queryClient.invalidateQueries({ queryKey: ['adminArticleDetail', finalSlugOrId] });
      navigate('/admin/articles');
    },
    onError: (error) => {
      toast.error(`Lỗi khi cập nhật bài viết: ${error.message}`);
    }
  });

  const onSubmit = async (data: ArticleFormValues) => {
    if (isEditMode && existingArticle?.id) {
      await updateArticleMutation.mutateAsync({ id: existingArticle.id, payload: data });
    } else {
      // Lấy createdByUserId từ auth context
      if (!user?.id) {
        toast.error('Không thể xác định người dùng hiện tại. Vui lòng đăng nhập lại.');
        return;
      }
      
      const createPayload: CreateArticleRequest = {
        ...data,
        createdByUserId: user.id,
      };
      await createArticleMutation.mutateAsync(createPayload);
    }
  };

  // Hiển thị loading khi đang tải dữ liệu edit
  if (isLoadingArticle && isEditMode) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu bài viết...</p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi nếu không thể tải dữ liệu trong edit mode
  if (isEditMode && loadingError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Không thể tải dữ liệu bài viết: {loadingError.message}
          </p>
          <div className="space-x-4">
            <Button 
              onClick={() => navigate('/admin/articles')} 
              variant="outline"
              className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              Quay lại danh sách
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Nếu là edit mode nhưng không có dữ liệu (và không có lỗi), không hiển thị form
  if (isEditMode && !existingArticle && !isLoadingArticle) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Không tìm thấy bài viết với slug/ID: {finalSlugOrId}
          </p>
          <Button 
            onClick={() => navigate('/admin/articles')} 
            variant="outline"
            className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        {isEditMode ? 'Chỉnh sửa Bài viết' : 'Tạo mới Bài viết'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div>
          <Label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug chính</Label>
          <Controller
            name="slug"
            control={control}
            render={({ field }) => <Input id="slug" {...field} className="mt-1 block w-full" />}
          />
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
        </div>

        <div>
          <Label htmlFor="authorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên tác giả</Label>
          <Controller
            name="authorName"
            control={control}
            render={({ field }) => <Input id="authorName" {...field} className="mt-1 block w-full" />}
          />
          {errors.authorName && <p className="mt-1 text-sm text-red-600">{errors.authorName.message}</p>}
        </div>

        <div>
          <Label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select {...field} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2">
                <option value="DRAFT">Bản nháp</option>
                <option value="PUBLISHED">Đã xuất bản</option>
                <option value="ARCHIVED">Đã lưu trữ</option>
              </select>
            )}
          />
          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
        </div>

        <div>
          <Label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Ảnh đại diện</Label>
          <Controller
            name="featuredImage"
            control={control}
            render={({ field }) => <Input id="featuredImage" {...field} className="mt-1 block w-full" />}
          />
          {errors.featuredImage && <p className="mt-1 text-sm text-red-600">{errors.featuredImage.message}</p>}
        </div>

        {/* Translations */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Bản dịch</h2>
          {errors.translations?.root && <p className="mt-1 text-sm text-red-600">{errors.translations.root.message}</p>}
          {translationFields.map((item, index) => (
            <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md space-y-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Bản dịch #{index + 1}</h3>
                {translationFields.length > 1 && (
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeTranslation(index)}>
                    Xóa bản dịch
                  </Button>
                )}
              </div>
              
              <div>
                <Label htmlFor={`translations.${index}.languageCode`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mã ngôn ngữ (vd: vi, en)</Label>
                <Controller
                  name={`translations.${index}.languageCode`}
                  control={control}
                  render={({ field }) => <Input id={`translations.${index}.languageCode`} {...field} className="mt-1 block w-full" />}
                />
                {errors.translations?.[index]?.languageCode && <p className="mt-1 text-sm text-red-600">{errors.translations?.[index]?.languageCode?.message}</p>}
              </div>
              
              <div>
                <Label htmlFor={`translations.${index}.title`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề</Label>
                <Controller
                  name={`translations.${index}.title`}
                  control={control}
                  render={({ field }) => <Input id={`translations.${index}.title`} {...field} className="mt-1 block w-full" />}
                />
                {errors.translations?.[index]?.title && <p className="mt-1 text-sm text-red-600">{errors.translations?.[index]?.title?.message}</p>}
              </div>
              
              <div>
                <Label htmlFor={`translations.${index}.content`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nội dung</Label>
                <div className="mt-1">
                  <Controller
                    name={`translations.${index}.content`}
                    control={control}
                    render={({ field }) => (
                      <TipTapEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="Nhập nội dung bài viết..."
                        className="min-h-[400px] border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                    )}
                  />
                </div>
                {errors.translations?.[index]?.content && <p className="mt-1 text-sm text-red-600">{errors.translations?.[index]?.content?.message}</p>}
              </div>
              
              <div>
                <Label htmlFor={`translations.${index}.excerpt`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tóm tắt</Label>
                <Controller
                  name={`translations.${index}.excerpt`}
                  control={control}
                  render={({ field }) => <Input id={`translations.${index}.excerpt`} {...field} className="mt-1 block w-full" />}
                />
              </div>
              
              <div>
                <Label htmlFor={`translations.${index}.metaTitle`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meta Title (SEO)</Label>
                <Controller
                  name={`translations.${index}.metaTitle`}
                  control={control}
                  render={({ field }) => <Input id={`translations.${index}.metaTitle`} {...field} className="mt-1 block w-full" />}
                />
              </div>
              
              <div>
                <Label htmlFor={`translations.${index}.metaDescription`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meta Description (SEO)</Label>
                <Controller
                  name={`translations.${index}.metaDescription`}
                  control={control}
                  render={({ field }) => <Input id={`translations.${index}.metaDescription`} {...field} className="mt-1 block w-full" />}
                />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendTranslation({ 
            languageCode: 'en', 
            title: '', 
            content: '', 
            excerpt: '', 
            metaTitle: '', 
            metaDescription: '' 
          })}>
            Thêm bản dịch
          </Button>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/articles')} 
            disabled={isSubmitting || createArticleMutation.isPending || updateArticleMutation.isPending}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || createArticleMutation.isPending || updateArticleMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white border-0"
          >
            {isSubmitting || createArticleMutation.isPending || updateArticleMutation.isPending ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArticlesForm; 
