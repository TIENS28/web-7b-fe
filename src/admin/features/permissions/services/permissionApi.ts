import axiosInstance from 'shared/lib/apiInstance';
import { 
  PermissionResponse, 
  PermissionListResponse,
  CreatePermissionRequest,
  UpdatePermissionRequest
} from '../types/permissionTypes';

/**
 * API Service cho quản lý permissions
 */
export class PermissionApiService {
  private readonly baseUrl = '/permissions';

  /**
   * Lấy danh sách tất cả permissions
   * GET /permissions
   */
  async getPermissions(): Promise<PermissionListResponse> {
    const response = await axiosInstance.get<PermissionListResponse>(this.baseUrl);
    return response.data;
  }

  /**
   * Lấy chi tiết permission theo ID
   * GET /permissions/{id}
   */
  async getPermissionById(id: number): Promise<PermissionResponse> {
    const response = await axiosInstance.get<PermissionResponse>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Tạo permission mới
   * POST /permissions
   */
  async createPermission(data: CreatePermissionRequest): Promise<PermissionResponse> {
    const response = await axiosInstance.post<PermissionResponse>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Cập nhật permission
   * PUT /permissions/{id}
   */
  async updatePermission(id: number, data: UpdatePermissionRequest): Promise<PermissionResponse> {
    const response = await axiosInstance.put<PermissionResponse>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Xóa permission
   * DELETE /permissions/{id}
   */
  async deletePermission(id: number): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

// Export singleton instance
export const permissionApi = new PermissionApiService(); 
