/**
 * Interface cho thông tin bác sĩ
 */
export interface Doctor {
  id: string;
  name: string;
  rank: string; // Cấp bậc quân đội
  position: string; // Chức vụ
  department: string; // Khoa/Phòng ban
  specialization: string; // Chuyên khoa
  avatar: string; // Đường dẫn ảnh
  slug: string; // Slug cho URL
  experience: number; // Số năm kinh nghiệm
  education: string[]; // Học vấn
  achievements: string[]; // Thành tích
  description: string; // Mô tả chi tiết
  phone?: string;
  email?: string;
}

/**
 * Interface cho params lọc bác sĩ
 */
export interface DoctorFilters {
  department?: string;
  specialization?: string;
  rank?: string;
} 