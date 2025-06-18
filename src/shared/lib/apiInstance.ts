import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig,
    type AxiosResponse,
  } from 'axios';
  import { API_CONFIG } from 'shared/config/config'; // Điều chỉnh đường dẫn nếu cần
  
  /**
   * Lấy token từ localStorage - sử dụng key 'token' để đồng nhất với authStore
   */
  const getToken = (): string | null => {
    try {
      const token = localStorage.getItem('token'); // Sử dụng key 'token' thay vì 'authToken'
      return token;
    } catch (error) {
      // Trường hợp localStorage không khả dụng (ví dụ: trong một số môi trường SSR nghiêm ngặt hoặc khi bị tắt)
      console.error('Error getting token:', error);
      console.warn('localStorage is not available for getting token.');
      return null;
    }
  };
  
  /**
   * Xóa token và dữ liệu user khi logout hoặc token hết hạn
   */
  const clearTokenAndUserData = (): void => {
    try {
      localStorage.removeItem('token'); // Sử dụng key 'token'
      localStorage.removeItem('user'); // Xóa thông tin user
    } catch (error) {
      console.error('Error clearing token:', error);
      console.warn('localStorage is not available for clearing token.');
    }
  };
  
  const axiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // Timeout sau 10 giây
  });
  
  // --- Request Interceptor ---
  // Interceptor này sẽ được gọi TRƯỚC KHI request được gửi đi.
  axiosInstance.interceptors.request.use(
    (axiosConfig: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token && axiosConfig.headers) {
        // Nếu có token, đính kèm vào header Authorization
        axiosConfig.headers.Authorization = `Bearer ${token}`;
      }
      // Bạn có thể thêm các headers mặc định khác ở đây nếu cần
      return axiosConfig;
    },
    (error: AxiosError) => {
      // Xử lý lỗi từ việc thiết lập request
      console.error('[Request Interceptor Error]', error);
      return Promise.reject(error);
    }
  );
  
  // --- Response Interceptor ---
  // Interceptor này sẽ được gọi SAU KHI nhận được response từ server.
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Bất kỳ status code nào trong khoảng 2xx sẽ vào đây
      // Bạn có thể xử lý data response ở đây trước khi trả về cho nơi gọi API
      // Ví dụ: return response.data; (tuy nhiên, thường thì để component/service tự lấy data)
      return response;
    },
    (error: AxiosError) => {
      // Bất kỳ status code nào ngoài khoảng 2xx sẽ vào đây
      if (error.response) {
        // Request đã được gửi và server đã trả về response với status code lỗi
        const { status, data } = error.response;
  
        switch (status) {
          case 400:
            console.error('[API Error 400 - Bad Request]', data);
            // Có thể hiển thị thông báo lỗi cụ thể từ server nếu có
            break;
          case 401:
            console.warn('[API Error 401 - Unauthorized]', data);
            // Xử lý lỗi 401 Unauthorized
            clearTokenAndUserData();
  
            // Redirect về trang login
            // Lưu ý: Trong ứng dụng React SPA, việc sử dụng window.location.href sẽ làm reload trang.
            // Một giải pháp tốt hơn là sử dụng history object từ react-router-dom
            // hoặc một custom navigation service.
            // Tuy nhiên, để đơn giản cho ví dụ:
            if (window.location.pathname !== '/login') { // Tránh vòng lặp redirect nếu đã ở trang login
              // alert('Phiên làm việc của bạn đã hết hạn hoặc bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
              window.location.href = '/login';
            }
            break;
          case 403:
            console.warn('[API Error 403 - Forbidden]', data);
            // Xử lý khi người dùng không có quyền truy cập tài nguyên
            // alert('Bạn không có quyền thực hiện hành động này.');
            break;
          case 404:
            console.error('[API Error 404 - Not Found]', data);
            break;
          case 500:
            console.error('[API Error 500 - Server Error]', data);
            // alert('Có lỗi xảy ra ở phía máy chủ. Vui lòng thử lại sau.');
            break;
          default:
            console.error(`[API Error ${status}]`, data);
        }
      } else if (error.request) {
        // Request đã được gửi nhưng không nhận được response
        // (ví dụ: lỗi mạng, server không phản hồi)
        console.error('[Network Error / No Response]', error.message);
        // alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Có lỗi xảy ra trong quá trình thiết lập request mà gây ra Error
        console.error('[Request Setup Error]', error.message);
      }
  
      // Quan trọng: Trả về Promise.reject(error) để cho phép .catch() ở nơi gọi API
      // có thể bắt và xử lý lỗi cụ thể cho từng request nếu cần.
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;
