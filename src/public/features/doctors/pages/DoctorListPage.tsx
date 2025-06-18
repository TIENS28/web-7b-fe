import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Award, MapPin, Phone, Mail, ChevronDown } from 'lucide-react';
import { Button } from 'shared/components/shadcn/button';
import { Input } from 'shared/components/shadcn/input';
import { doctorsData, getDepartments, getSpecializations } from 'shared/data/doctors';
import type { Doctor } from 'shared/types/Doctor.types';
import DoctorAvatar from 'shared/components/DoctorAvatar';

/**
 * Trang danh sách đội ngũ bác sĩ
 * Hiển thị toàn bộ đội ngũ với tính năng filter và search
 */
export default function DoctorListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const departments = getDepartments();
  const specializations = getSpecializations();

  // Filter doctors based on search and filters
  const filteredDoctors = useMemo(() => {
    return doctorsData.filter((doctor) => {
      const matchesSearch = 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = !selectedDepartment || doctor.department === selectedDepartment;
      const matchesSpecialization = !selectedSpecialization || doctor.specialization.includes(selectedSpecialization);

      return matchesSearch && matchesDepartment && matchesSpecialization;
    });
  }, [searchTerm, selectedDepartment, selectedSpecialization]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedSpecialization('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
              <Award className="h-10 w-10 text-green-600 dark:text-green-400" />
              Đội ngũ bác sĩ
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-4xl mx-auto text-lg">
              Bệnh viện Quân y 7B tự hào có đội ngũ bác sĩ chuyên nghiệp, giàu kinh nghiệm và tận tâm với nghề
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên, chức vụ, chuyên khoa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Bộ lọc
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Khoa/Phòng ban
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Tất cả</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specialization Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chuyên khoa
                  </label>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Tất cả</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Hiển thị {filteredDoctors.length} / {doctorsData.length} bác sĩ
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Không tìm thấy bác sĩ
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
            <Button onClick={clearFilters} variant="outline">
              Xóa tất cả bộ lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Component card hiển thị thông tin bác sĩ
 */
function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link
      to={`/doctors/${doctor.slug}`}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Avatar */}
      <div className="relative overflow-hidden">
        <div className="w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 flex items-center justify-center">
          {/* Doctor Avatar với image loading */}
          <DoctorAvatar 
            doctorSlug={doctor.slug}
            doctorName={doctor.name}
            size="md"
            className="group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        
        {/* Rank Badge */}
        <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {doctor.rank}
        </div>
      </div>

      {/* Doctor Info */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
          {doctor.name}
        </h3>
        
        <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-3">
          {doctor.position}
        </p>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{doctor.department}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{doctor.specialization}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{doctor.experience} năm kinh nghiệm</span>
          </div>

          {doctor.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1 text-xs">{doctor.email}</span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
            Xem chi tiết →
          </span>
        </div>
      </div>
    </Link>
  );
} 