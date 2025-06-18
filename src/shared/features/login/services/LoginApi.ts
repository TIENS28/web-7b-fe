import axiosInstance from 'shared/lib/apiInstance';

// Interface cho các request/response theo OpenAPI
export interface LoginRequest {
  personalId: string; // CCCD/Email/SĐT để đăng nhập
  password: string;
}

export interface RegisterRequest {
  personalId: string; // CCCD 12 chữ số
  fullName: string;
  password: string;
  email?: string; // Tùy chọn
  phoneNumber?: string; // Tùy chọn
}

export interface User {
  id: string;
  personalId: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  isLocked: boolean;
  permissions?: string[]; // Thêm permissions vào User interface
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

// API functions theo OpenAPI
export const authApi = {
  /**
   * Đăng nhập với CCCD/Email/SĐT và mật khẩu
   */
  login: async (loginData: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', {
      personalId: loginData.personalId,
      password: loginData.password
    });
    
    // Lưu token vào localStorage
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  /**
   * Đăng ký tài khoản mới
   */
  register: async (registerData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axiosInstance.post<RegisterResponse>('/auth/register', registerData);
    return response.data;
  },

  /**
   * Lấy thông tin người dùng hiện tại
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data.data.user;
  },

  /**
   * Đăng xuất
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Gửi yêu cầu quên mật khẩu (giả định API này sẽ có)
   */
  forgotPassword: async (personalId: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post('/auth/forgot-password', { personalId });
    return response.data;
  },

  /**
   * Kích hoạt tài khoản (giả định API này sẽ có)
   */
  activateAccount: async (data: { personalId: string; email: string }): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post('/auth/activate', data);
    return response.data;
  },

  /**
   * Xác nhận OTP kích hoạt (giả định API này sẽ có)
   */
  verifyActivationOtp: async (data: { personalId: string; otp: string }): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post('/auth/verify-activation-otp', data);
    return response.data;
  }
}; 
