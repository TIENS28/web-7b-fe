import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Award, MapPin, Phone } from 'lucide-react';
import { Button } from 'shared/components/shadcn/button';
import { doctorsData } from 'shared/data/doctors';
import DoctorAvatar from 'shared/components/DoctorAvatar';

/**
 * Section đội ngũ bác sĩ tiêu biểu với slider
 * Hiển thị data thật từ website Bệnh viện Quân y 7B
 */
export default function DoctorSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(doctorsData.length / itemsPerPage);

  // Lấy 4 bác sĩ hiện tại để hiển thị
  const currentDoctors = doctorsData.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="bg-green-50 py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4 dark:bg-gray-900 dark:text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-4 flex items-center justify-center gap-2">
            <Award className="h-8 w-8" />
            Đội ngũ bác sĩ tiêu biểu
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Đội ngũ bác sĩ chuyên nghiệp với nhiều năm kinh nghiệm, luôn tận tâm phục vụ sức khỏe cộng đồng
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={totalPages <= 1}
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={totalPages <= 1}
          >
            <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-8">
            {currentDoctors.map((doctor) => (
              <Link
                key={doctor.id}
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
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {doctor.name}
                  </h3>
                  
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                    {doctor.position}
                  </p>
                  
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{doctor.department}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      <span>{doctor.specialization}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{doctor.experience} năm kinh nghiệm</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                      Xem chi tiết →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-green-600 dark:bg-green-400'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button 
            asChild
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors dark:bg-green-500 dark:hover:bg-green-600"
          >
            <Link to="/doctors">
              Xem tất cả đội ngũ ({doctorsData.length} bác sĩ)
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 
