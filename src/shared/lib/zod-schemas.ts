import { z } from 'zod';

// ✅ REQUIRED: Shared validation schemas using Zod

// Common validation patterns
export const emailSchema = z.string().email('Email không hợp lệ');
export const passwordSchema = z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự');
export const phoneSchema = z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ');

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  total: z.number().min(0).default(0),
});

// Common response schema
export const apiResponseSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    errors: z.array(z.string()).optional(),
  });

// Error response schema
export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(z.string()).optional(),
  statusCode: z.number().optional(),
});

// File upload schema
export const fileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  url: z.string().url(),
  createdAt: z.string().datetime(),
});

// Common entity schemas
export const baseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Export types
export type PaginationData = z.infer<typeof paginationSchema>;
export type ApiResponse<T> = z.infer<ReturnType<typeof apiResponseSchema<T>>>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type FileData = z.infer<typeof fileSchema>;
export type BaseEntity = z.infer<typeof baseEntitySchema>; 
