import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginRequest, RegisterRequest } from 'shared/features/login/services/LoginApi';
import { useAuthStore } from 'app/stores/authStore';
import { toast } from 'sonner';

// Interface cho error response
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Hook cho đăng nhập
export const useLoginMutation = () => {
  const { login, setLoading, clearError } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loginData: LoginRequest) => {
      // Convert LoginRequest to AuthLoginRequest
      await login({
        email: loginData.personalId, // Sử dụng personalId như email
        password: loginData.password,
        rememberMe: false
      });
      return { success: true, message: 'Đăng nhập thành công' };
    },
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Đăng nhập thành công');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      toast.error(message);
    },
    onSettled: () => {
      setLoading(false);
    }
  });
};

// Hook cho đăng ký
export const useRegisterMutation = () => {
  const { setLoading } = useAuthStore();

  return useMutation({
    mutationFn: (registerData: RegisterRequest) => authApi.register(registerData),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Đăng ký thành công');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      toast.error(message);
    },
    onSettled: () => {
      setLoading(false);
    }
  });
};

// Hook cho quên mật khẩu
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (personalId: string) => authApi.forgotPassword(personalId),
    onSuccess: (data) => {
      toast.success(data.message || 'Yêu cầu đặt lại mật khẩu đã được gửi');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Gửi yêu cầu thất bại';
      toast.error(message);
    }
  });
};

// Hook cho kích hoạt tài khoản
export const useActivateAccountMutation = () => {
  return useMutation({
    mutationFn: (data: { personalId: string; email: string }) => authApi.activateAccount(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Yêu cầu kích hoạt đã được gửi');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Gửi yêu cầu kích hoạt thất bại';
      toast.error(message);
    }
  });
};

// Hook cho xác nhận OTP kích hoạt
export const useVerifyActivationOtpMutation = () => {
  return useMutation({
    mutationFn: (data: { personalId: string; otp: string }) => authApi.verifyActivationOtp(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Kích hoạt tài khoản thành công');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Xác nhận OTP thất bại';
      toast.error(message);
    }
  });
};

// Hook cho đăng xuất
export const useLogoutMutation = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('Đăng xuất thành công');
    }
  });
}; 
