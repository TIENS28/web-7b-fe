import { useState, useEffect } from 'react';

// --- Sử dụng import.meta.glob của Vite để xử lý ảnh động ---
// Vite sẽ tìm tất cả các file ảnh khớp với pattern này tại thời điểm build
// và tạo ra một object chứa các module tương ứng.
// { eager: true } đảm bảo các module ảnh được tải ngay lập tức.
const doctorImageModules = import.meta.glob('/src/shared/assets/images/doctors/*.{jpg,png,jpeg,svg}', { eager: true });

/**
 * Lấy đường dẫn URL cuối cùng của ảnh bác sĩ sau khi đã được Vite xử lý.
 * @param slug Slug của bác sĩ (ví dụ: 'tran-van-a')
 * @returns Đường dẫn URL cuối cùng của ảnh, hoặc null nếu không tìm thấy.
 */
function getDoctorImageUrl(slug: string): string | null {
  // Thử các định dạng ảnh phổ biến
  const possibleExtensions = ['jpg', 'png', 'jpeg', 'svg'];
  for (const ext of possibleExtensions) {
    const path = `/src/shared/assets/images/doctors/${slug}.${ext}`;
    // Kiểm tra xem đường dẫn có tồn tại trong các module đã import không
    if (doctorImageModules[path]) {
      // TypeScript có thể không biết 'default' tồn tại, nên cần ép kiểu
      const module = doctorImageModules[path] as { default: string };
      return module.default;
    }
  }
  // Trả về null nếu không tìm thấy ảnh với bất kỳ định dạng nào
  return null;
}


interface DoctorAvatarProps {
  /**
   * Slug định danh của bác sĩ, dùng để tìm ảnh.
   * Ví dụ: 'tran-van-a'
   */
  doctorSlug: string;
  /**
   * Tên đầy đủ của bác sĩ, dùng cho alt text.
   */
  doctorName: string;
  /**
   * Kích thước của avatar. Mặc định là 'md'.
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Các class CSS tùy chỉnh khác.
   */
  className?: string;
}

/**
 * Component hiển thị avatar của bác sĩ với cơ chế fallback thông minh.
 * Sử dụng phương pháp được Vite khuyến nghị để xử lý ảnh động,
 * đảm bảo hoạt động chính xác cả trong môi trường dev và production.
 */
export default function DoctorAvatar({
  doctorSlug,
  doctorName,
  size = 'md',
  className = '',
}: DoctorAvatarProps) {
  // State chỉ cần lưu trữ URL của ảnh hoặc null
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  // State để hiển thị skeleton loading trong khi chờ xử lý
  const [isLoading, setIsLoading] = useState(true);

  // --- Cấu hình kích thước ---
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-40 h-40 text-4xl',
    lg: 'w-40 h-40 text-6xl',
    xl: 'w-40 h-40 text-8xl'
  };



  const placeholderIconSize = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-4xl',
    xl: 'w-20 h-20 text-5xl'
  };



  useEffect(() => {
    setIsLoading(true);

    // Việc tìm kiếm URL giờ đây là đồng bộ, không cần new Image()
    const resolvedUrl = getDoctorImageUrl(doctorSlug);
    setImageSrc(resolvedUrl);

    // Dùng một timeout nhỏ để tránh skeleton nhấp nháy quá nhanh trên các máy mạnh
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // 100ms delay

    return () => clearTimeout(timer);

  }, [doctorSlug]);

  // 1. Trạng thái tải (Loading Skeleton)
  if (isLoading) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} animate-pulse rounded-full bg-gray-200 dark:bg-gray-700`}
        aria-label="Đang tải ảnh đại diện"
      ></div>
    );
  }

  // 2. Hiển thị ảnh nếu tìm thấy (imageSrc có giá trị)
  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={`Ảnh đại diện của ${doctorName}`}
        className={`${sizeClasses[size]} ${className} rounded-full object-cover object-center bg-gray-200`}
      />
    );
  }

  // 3. Fallback: hiển thị icon nếu không tìm thấy ảnh (imageSrc là null)
  return (
    <div
      className={`${sizeClasses[size]} ${className} flex items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-300`}
      title={doctorName}
    >
      <span className={placeholderIconSize[size]} role="img" aria-label="Biểu tượng bác sĩ">
        👨‍⚕️
      </span>
    </div>
  );
}
