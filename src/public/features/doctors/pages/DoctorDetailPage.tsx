import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, MapPin, Phone, Mail, Calendar, GraduationCap, Trophy, User } from 'lucide-react';
import { Button } from 'shared/components/shadcn/button';
import { getDoctorBySlug } from 'shared/data/doctors';
import DoctorAvatar from 'shared/components/DoctorAvatar';

/**
 * Trang chi tiết bác sĩ
 * Hiển thị thông tin đầy đủ về một bác sĩ cụ thể
 */
export default function DoctorDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const doctor = slug ? getDoctorBySlug(slug) : undefined;

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Không tìm thấy thông tin bác sĩ
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Bác sĩ bạn đang tìm không tồn tại hoặc đã bị xóa
          </p>
          <Button asChild>
            <Link to="/doctors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Link to="/" className="hover:text-green-600 dark:hover:text-green-400">
              Trang chủ
            </Link>
            <span>/</span>
            <Link to="/doctors" className="hover:text-green-600 dark:hover:text-green-400">
              Đội ngũ bác sĩ
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {doctor.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button asChild variant="outline" className="mb-6">
          <Link to="/doctors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-1">
            {/* Doctor Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden sticky top-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 flex items-center justify-center">
                  {/* Doctor Avatar với image loading */}
                  <DoctorAvatar 
                    doctorSlug={doctor.slug}
                    doctorName={doctor.name}
                    size="lg"
                    className=""
                  />
                </div>
                
                {/* Rank Badge */}
                <div className="absolute top-4 right-4 bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {doctor.rank}
                </div>
              </div>

              {/* Basic Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {doctor.name}
                </h1>
                
                <p className="text-lg font-medium text-green-600 dark:text-green-400 mb-4">
                  {doctor.position}
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {doctor.department}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {doctor.specialization}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {doctor.experience} năm kinh nghiệm
                    </span>
                  </div>

                  {doctor.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <a 
                        href={`tel:${doctor.phone}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {doctor.phone}
                      </a>
                    </div>
                  )}

                  {doctor.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <a 
                        href={`mailto:${doctor.email}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {doctor.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Contact Buttons */}
                <div className="mt-6 space-y-3">
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link to="/appointment">
                      📅 Đặt lịch khám
                    </Link>
                  </Button>
                  
                  {doctor.phone && (
                    <Button asChild variant="outline" className="w-full">
                      <a href={`tel:${doctor.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Gọi điện tư vấn
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                Giới thiệu
              </h2>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {doctor.description}
              </p>
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
                Học vấn & Đào tạo
              </h2>
              
              <ul className="space-y-3">
                {doctor.education.map((edu, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
                Thành tích & Khen thưởng
              </h2>
              
              <ul className="space-y-3">
                {doctor.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hospital Info */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                📍 Thông tin khám bệnh
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Địa chỉ:</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    1137 Đường Nguyễn Ái Quốc, Phường Tân Mai, Biên Hòa, Đồng Nai
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Giờ làm việc:</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Thứ 2-6: 7:00-11:30, 13:30-17:00<br />
                    Thứ 7: 7:00-11:30<br />
                    Cấp cứu: 24/7
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <Link to="/services">
                      📋 Xem bảng giá
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="sm">
                    <Link to="/contact">
                      📞 Liên hệ
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="sm">
                    <a href="https://maps.google.com/?q=1137+Đường+Nguyễn+Ái+Quốc,+Phường+Tân+Mai,+Biên+Hòa,+Đồng+Nai" target="_blank">
                      🗺️ Xem bản đồ
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 