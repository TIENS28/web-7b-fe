import axiosInstance from 'shared/lib/apiInstance';
import { 
  UserListResponse, 
  UserResponse, 
  UpdateProfileRequest,
  AssignRolesRequest,
  RevokeRolesRequest,
  ToggleLockStatusRequest,
  UsersQueryParams
} from '../types/userTypes';

/**
 * API Service cho quản lý người dùng
 * Endpoints dựa trên OpenAPI specification
 */
export class UserApiService {
  private readonly baseUrl = '/users';

  /**
   * Lấy danh sách tất cả users với phân trang
   * GET /users
   */
  async getUsers(params?: UsersQueryParams): Promise<UserListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }

    const url = queryParams.toString() 
      ? `${this.baseUrl}?${queryParams.toString()}`
      : this.baseUrl;

    const response = await axiosInstance.get<UserListResponse>(url);
    return response.data;
  }

  /**
   * Lấy chi tiết user theo ID
   * GET /users/{id}
   */
  async getUserById(id: string): Promise<UserResponse> {
    const response = await axiosInstance.get<UserResponse>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Cập nhật thông tin user (Admin)
   * PUT /auth/update/{id}
   */
  async updateUser(id: string, data: UpdateProfileRequest): Promise<UserResponse> {
    const response = await axiosInstance.put<UserResponse>(`/auth/update/${id}`, data);
    return response.data;
  }

  /**
   * Xóa user (Admin only)
   * DELETE /auth/delete/{id}
   */
  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete(`/auth/delete/${id}`);
    return response.data;
  }

  /**
   * Gán roles cho user
   * POST /users/{id}/roles
   */
  async assignRoles(id: string, data: AssignRolesRequest): Promise<UserResponse> {
    const response = await axiosInstance.post<UserResponse>(`${this.baseUrl}/${id}/roles`, data);
    return response.data;
  }

  /**
   * Thu hồi roles từ user
   * DELETE /users/{id}/roles
   */
  async revokeRoles(id: string, data: RevokeRolesRequest): Promise<UserResponse> {
    const response = await axiosInstance.delete<UserResponse>(`${this.baseUrl}/${id}/roles`, {
      data
    });
    return response.data;
  }

  /**
   * Khóa/Mở khóa tài khoản user
   * PATCH /users/{id}/lock-status
   */
  async toggleLockStatus(id: string, data: ToggleLockStatusRequest): Promise<UserResponse> {
    const response = await axiosInstance.patch<UserResponse>(`${this.baseUrl}/${id}/lock-status`, data);
    return response.data;
  }
}

// Export singleton instance
export const userApi = new UserApiService(); 
