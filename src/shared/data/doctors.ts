import type { Doctor } from 'shared/types/Doctor.types';

/**
 * Dữ liệu đội ngũ bác sĩ Bệnh viện Quân y 7B
 * Nguồn: https://benhvienquany7b.com/doi-ngu-bac-si/
 */
export const doctorsData: Doctor[] = [
  {
    id: '1',
    name: 'Nguyễn Tuấn',
    rank: 'Đại Tá',
    position: 'Giám Đốc Bệnh Viện',
    department: 'Ban Giám đốc',
    specialization: 'Quản lý Y tế',
    avatar: '/src/shared/assets/images/doctors/nguyen-tuan.jpg',
    slug: 'dai-ta-nguyen-tuan',
    experience: 25,
    education: [
      'Bác sĩ Đa khoa - Học viện Quân Y',
      'Thạc sĩ Quản lý Bệnh viện',
      'Tiến sĩ Y học'
    ],
    achievements: [
      'Huân chương Lao động hạng Nhất',
      'Thầy thuốc Ưu tú',
      'Bằng khen của Bộ Quốc phòng'
    ],
    description: 'Với hơn 25 năm kinh nghiệm trong lĩnh vực y tế quân đội, Đại tá Nguyễn Tuấn đã đóng góp tích cực vào việc xây dựng và phát triển Bệnh viện Quân y 7B thành một trong những bệnh viện hàng đầu khu vực.',
    phone: '02513996060',
    email: 'giamdoc@bvquany7b.com'
  },
  {
    id: '2',
    name: 'Trần Văn Duy',
    rank: 'Đại Tá',
    position: 'Chính Ủy Bệnh Viện',
    department: 'Ban Chính trị',
    specialization: 'Công tác Chính trị',
    avatar: '/src/shared/assets/images/doctors/tran-van-duy.jpg',
    slug: 'dai-ta-tran-van-duy',
    experience: 22,
    education: [
      'Đại học Chính trị - Học viện Chính trị Quốc gia',
      'Thạc sĩ Quản lý Nhà nước'
    ],
    achievements: [
      'Huân chương Bảo vệ Tổ quốc hạng Ba',
      'Bằng khen của Thủ tướng Chính phủ'
    ],
    description: 'Đại tá Trần Văn Duy có nhiều năm kinh nghiệm trong công tác chính trị, đảm bảo định hướng phát triển đúng đắn cho bệnh viện.',
    phone: '02513996060',
    email: 'chinhuy@bvquany7b.com'
  },
  {
    id: '3',
    name: 'Phạm Hồng Hà',
    rank: 'Đại Tá',
    position: 'Phó Giám Đốc Bệnh Viện',
    department: 'Ban Giám đốc',
    specialization: 'Ngoại khoa',
    avatar: '/src/shared/assets/images/doctors/pham-hong-ha.jpg',
    slug: 'dai-ta-pham-hong-ha',
    experience: 20,
    education: [
      'Bác sĩ Chuyên khoa I Ngoại - Học viện Quân Y',
      'Thạc sĩ Y học'
    ],
    achievements: [
      'Thầy thuốc Ưu tú',
      'Bằng khen của Bộ trưởng Quốc phòng'
    ],
    description: 'Đại tá Phạm Hồng Hà là chuyên gia đầu ngành về ngoại khoa, có nhiều đóng góp trong việc phát triển kỹ thuật phẫu thuật tiên tiến.',
    phone: '02513996060',
    email: 'phogiamdoc@bvquany7b.com'
  },
  {
    id: '4',
    name: 'Chúc Mai Hiên',
    rank: 'Thượng tá DS-CK II',
    position: 'Chủ Nhiệm Khoa Dược',
    department: 'Khoa Dược',
    specialization: 'Dược học',
    avatar: '/src/shared/assets/images/doctors/chuc-mai-hien.jpg',
    slug: 'thuong-ta-chuc-mai-hien',
    experience: 18,
    education: [
      'Dược sĩ Đại học - Học viện Quân Y',
      'Chuyên khoa II Dược lâm sàng'
    ],
    achievements: [
      'Thầy thuốc Ưu tú',
      'Giải thưởng Sáng tạo Khoa học Công nghệ'
    ],
    description: 'Thượng tá Chúc Mai Hiên có chuyên môn sâu về dược học lâm sàng, đảm bảo an toàn và hiệu quả trong điều trị.',
    phone: '02513996060',
    email: 'khoaduoc@bvquany7b.com'
  },
  {
    id: '5',
    name: 'Đinh Công Tuấn',
    rank: 'Thiếu Tá CN BS',
    position: 'Phụ Trách Khoa Vật Lý Trị Liệu',
    department: 'Khoa Phục Hồi Chức Năng',
    specialization: 'Vật lý trị liệu',
    avatar: '/src/shared/assets/images/doctors/dinh-cong-tuan.jpg',
    slug: 'thieu-ta-dinh-cong-tuan',
    experience: 15,
    education: [
      'Bác sĩ Đa khoa - Đại học Y Hà Nội',
      'Chuyên khoa I Phục hồi chức năng'
    ],
    achievements: [
      'Bằng khen của Bộ Y tế',
      'Giấy khen của UBND tỉnh Đồng Nai'
    ],
    description: 'Thiếu tá Đinh Công Tuấn chuyên về phục hồi chức năng và vật lý trị liệu, giúp nhiều bệnh nhân phục hồi sức khỏe.',
    phone: '02513996060',
    email: 'phcn@bvquany7b.com'
  },
  {
    id: '6',
    name: 'Lê Thanh Sơn',
    rank: 'Trung tá BS CKI',
    position: 'Chủ nhiệm Khoa Ngoại Chuyên Khoa',
    department: 'Khoa Ngoại Chuyên Khoa',
    specialization: 'Ngoại Chấn thương',
    avatar: '/src/shared/assets/images/doctors/le-thanh-son.jpg',
    slug: 'trung-ta-le-thanh-son',
    experience: 16,
    education: [
      'Bác sĩ Đa khoa - Học viện Quân Y',
      'Chuyên khoa I Ngoại'
    ],
    achievements: [
      'Thầy thuốc Trẻ Ưu tú',
      'Bằng khen của Bộ Quốc phòng'
    ],
    description: 'Trung tá Lê Thanh Sơn có kinh nghiệm phong phú trong phẫu thuật chấn thương và ngoại khoa chuyên sâu.',
    phone: '02513996060',
    email: 'ngoaichuyenkhoa@bvquany7b.com'
  },
  {
    id: '7',
    name: 'Đỗ Việt Nam',
    rank: 'Thiếu tá BS CK I',
    position: 'P.CN Khoa Phẫu Thuật - Gây Mê Hồi Sức',
    department: 'Khoa Phẫu Thuật - Gây Mê Hồi Sức',
    specialization: 'Gây mê Hồi sức',
    avatar: '/src/shared/assets/images/doctors/do-viet-nam.jpg',
    slug: 'thieu-ta-do-viet-nam',
    experience: 14,
    education: [
      'Bác sĩ Đa khoa - Đại học Y Dược TP.HCM',
      'Chuyên khoa I Gây mê Hồi sức'
    ],
    achievements: [
      'Bằng khen của Hội Gây mê Hồi sức Việt Nam',
      'Giấy khen của Bệnh viện'
    ],
    description: 'Thiếu tá Đỗ Việt Nam chuyên về gây mê hồi sức, đảm bảo an toàn cho các ca phẫu thuật phức tạp.',
    phone: '02513996060',
    email: 'gaymehoisu@bvquany7b.com'
  },
  {
    id: '8',
    name: 'Nguyễn Thành Trung',
    rank: 'Thượng tá ThS',
    position: 'Chủ nhiệm Khoa Ngoại Chung',
    department: 'Khoa Ngoại Chung',
    specialization: 'Ngoại Tổng quát',
    avatar: '/src/shared/assets/images/doctors/nguyen-thanh-trung.jpg',
    slug: 'thuong-ta-nguyen-thanh-trung',
    experience: 19,
    education: [
      'Bác sĩ Đa khoa - Học viện Quân Y',
      'Thạc sĩ Y học',
      'Chuyên khoa I Ngoại'
    ],
    achievements: [
      'Thầy thuốc Ưu tú',
      'Giải thưởng Sáng tạo Kỹ thuật'
    ],
    description: 'Thượng tá Nguyễn Thành Trung có trình độ chuyên môn cao trong ngoại khoa tổng quát với nhiều kỹ thuật tiên tiến.',
    phone: '02513996060',
    email: 'ngoaichung@bvquany7b.com'
  },
  {
    id: '9',
    name: 'Lê Xuân Nguyên',
    rank: 'Thiếu tá BS CKI',
    position: 'Chủ nhiệm Khoa Nội Truyền Nhiễm - Da Liễu',
    department: 'Khoa Nội Truyền Nhiễm - Da Liễu',
    specialization: 'Truyền nhiễm, Da liễu',
    avatar: '/src/shared/assets/images/doctors/le-xuan-nguyen.jpg',
    slug: 'thieu-ta-le-xuan-nguyen',
    experience: 13,
    education: [
      'Bác sĩ Đa khoa - Đại học Y Hà Nội',
      'Chuyên khoa I Nội'
    ],
    achievements: [
      'Bằng khen trong công tác phòng chống dịch',
      'Giấy khen của Bộ Y tế'
    ],
    description: 'Thiếu tá Lê Xuân Nguyên chuyên điều trị các bệnh truyền nhiễm và da liễu, có kinh nghiệm phong phú trong phòng chống dịch.',
    phone: '02513996060',
    email: 'noitruynhiem@bvquany7b.com'
  },
  {
    id: '10',
    name: 'Nguyễn Thị Sen',
    rank: 'Trung tá BS CKI',
    position: 'Chủ Nhiệm Khoa Khám Bệnh - Cấp Cứu Ban Đầu',
    department: 'Khoa Khám Bệnh - Cấp Cứu',
    specialization: 'Cấp cứu, Nội tổng quát',
    avatar: '/src/shared/assets/images/doctors/nguyen-thi-sen.jpg',
    slug: 'trung-ta-nguyen-thi-sen',
    experience: 17,
    education: [
      'Bác sĩ Đa khoa - Học viện Quân Y',
      'Chuyên khoa I Nội'
    ],
    achievements: [
      'Thầy thuốc Ưu tú',
      'Bằng khen của Chủ tịch UBND tỉnh'
    ],
    description: 'Trung tá Nguyễn Thị Sen có kinh nghiệm dày dặn trong công tác cấp cứu và khám bệnh, luôn sẵn sàng cứu chữa bệnh nhân.',
    phone: '02513996060',
    email: 'capcu@bvquany7b.com'
  },
  {
    id: '11',
    name: 'Lương Văn Toản',
    rank: 'Trung tá CN',
    position: 'Trưởng Ban Y Tá Điều Dưỡng',
    department: 'Ban Điều Dưỡng',
    specialization: 'Điều dưỡng',
    avatar: '/src/shared/assets/images/doctors/luong-van-toan.jpg',
    slug: 'trung-ta-luong-van-toan',
    experience: 20,
    education: [
      'Cử nhân Điều dưỡng - Đại học Y tế Công cộng',
      'Thạc sĩ Quản lý Y tế'
    ],
    achievements: [
      'Điều dưỡng viên Ưu tú',
      'Bằng khen của Bộ Quốc phòng'
    ],
    description: 'Trung tá Lương Văn Toản có nhiều năm kinh nghiệm trong công tác điều dưỡng và quản lý đội ngũ y tá.',
    phone: '02513996060',
    email: 'dieuduong@bvquany7b.com'
  }
];

/**
 * Lấy bác sĩ theo slug
 */
export const getDoctorBySlug = (slug: string): Doctor | undefined => {
  return doctorsData.find(doctor => doctor.slug === slug);
};

/**
 * Lấy danh sách bác sĩ theo bộ lọc
 */
export const getDoctorsByFilter = (filters: {
  department?: string;
  specialization?: string;
  rank?: string;
}): Doctor[] => {
  return doctorsData.filter(doctor => {
    if (filters.department && !doctor.department.includes(filters.department)) {
      return false;
    }
    if (filters.specialization && !doctor.specialization.includes(filters.specialization)) {
      return false;
    }
    if (filters.rank && !doctor.rank.includes(filters.rank)) {
      return false;
    }
    return true;
  });
};

/**
 * Lấy danh sách khoa/phòng ban
 */
export const getDepartments = (): string[] => {
  const departments = doctorsData.map(doctor => doctor.department);
  return [...new Set(departments)].sort();
};

/**
 * Lấy danh sách chuyên khoa
 */
export const getSpecializations = (): string[] => {
  const specializations = doctorsData.map(doctor => doctor.specialization);
  return [...new Set(specializations)].sort();
}; 