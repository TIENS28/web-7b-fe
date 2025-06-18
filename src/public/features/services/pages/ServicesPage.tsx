/**
 * Services Landing Page
 * Trang dịch vụ công khai với danh sách dịch vụ, gói dịch vụ, tiêm chủng và giá công khai
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Heart, 
  Clock, 
  DollarSign, 
  Star, 
  ArrowRight, 
  Shield, 
  Stethoscope,
  TestTube,
  Camera,
  Syringe,
  Package,
  Award,
  CheckCircle,
  FileText,
  Eye
} from 'lucide-react';
import { Button } from 'shared/components/shadcn/button';
import { Card } from 'shared/components/shadcn/card';
import { Badge } from 'shared/components/shadcn/badge';
import { BannerSlider } from 'shared/components';
import { 
  mockPublicServices, 
  mockServicePackages, 
  mockVaccinationServices 
} from '../services/ServicesApi';
import { bannerSlides, medicalServicePrices, vaccinePrices, drugPrices } from 'shared/data/pricing';
import type { PublicService, ServicePackage, VaccinationService } from '../types/Service.types';

const ServicesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'pricing' | 'services' | 'packages' | 'vaccination'>('pricing');

  // Check URL params to set active tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['pricing', 'services', 'packages', 'vaccination'].includes(tab)) {
      setActiveTab(tab as 'pricing' | 'services' | 'packages' | 'vaccination');
    }
  }, [searchParams]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD',
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}p` : `${hours} giờ`;
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'khám bệnh':
        return <Stethoscope className="h-6 w-6" />;
      case 'xét nghiệm':
        return <TestTube className="h-6 w-6" />;
      case 'chẩn đoán hình ảnh':
        return <Camera className="h-6 w-6" />;
      default:
        return <Heart className="h-6 w-6" />;
    }
  };

  const ServiceCard: React.FC<{ service: PublicService }> = ({ service }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-blue-600 dark:text-blue-400">
          {getCategoryIcon(service.category.name)}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {service.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {service.description}
            </p>
            <Badge variant="secondary" className="text-xs">
              {service.category.name}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
            <span className="font-medium text-green-600 dark:text-green-400">
              {formatPrice(service.basePrice, service.currency)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            <span>{formatDuration(service.duration)}</span>
          </div>
        </div>

        {service.features && service.features.length > 0 && (
          <div className="mb-4">
            <div className="space-y-1">
              {service.features.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Đặt lịch khám
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );

  const PackageCard: React.FC<{ package: ServicePackage }> = ({ package: pkg }) => (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden relative ${
      pkg.isPopular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
    }`}>
      {pkg.isPopular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-blue-600 text-white">
            <Star className="h-3 w-3 mr-1" />
            Phổ biến
          </Badge>
        </div>
      )}
      
      <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
        <Package className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {pkg.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {pkg.description}
        </p>

        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatPrice(pkg.discountPrice, pkg.currency)}
          </span>
          <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
            {formatPrice(pkg.originalPrice, pkg.currency)}
          </span>
          <Badge variant="destructive" className="text-xs">
            -{pkg.discount}%
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            <span>Thời gian: {formatDuration(pkg.duration)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Heart className="h-4 w-4 mr-2 text-red-500" />
            <span>{pkg.services.length} dịch vụ</span>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {pkg.features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          Chọn gói này
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );

  const VaccineCard: React.FC<{ vaccine: VaccinationService }> = ({ vaccine }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <Syringe className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {vaccine.name}
            </h3>
            <Badge variant="outline" className="text-xs mb-2">
              {vaccine.vaccineType}
            </Badge>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {vaccine.description}
            </p>
          </div>
          {vaccine.isAvailable && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
              Có sẵn
            </Badge>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
            <span className="font-medium text-green-600 dark:text-green-400">
              {formatPrice(vaccine.price, vaccine.currency)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Shield className="h-4 w-4 mr-2 text-blue-500" />
            <span>{vaccine.ageGroup}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Award className="h-4 w-4 mr-2 text-purple-500" />
            <span>{vaccine.manufacturer} - {vaccine.country}</span>
          </div>
        </div>

        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={!vaccine.isAvailable}
        >
          {vaccine.isAvailable ? 'Đăng ký tiêm' : 'Hết vaccine'}
          {vaccine.isAvailable && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - Banner Slider */}
      <BannerSlider 
        slides={bannerSlides}
        autoSlideInterval={5000}
        showControls={true}
        showDots={true}
      />

      {/* Tab Navigation */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('pricing')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pricing'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Bảng giá các dịch vụ
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'services'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Dịch vụ y tế
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'packages'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Gói dịch vụ
              </button>
              <button
                onClick={() => setActiveTab('vaccination')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'vaccination'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Tiêm chủng
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">
        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-12">
            {/* Pricing Overview */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Bảng giá dịch vụ
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Minh bạch giá cả, chất lượng dịch vụ tốt nhất. Tất cả giá dịch vụ được niêm yết công khai theo quy định.
              </p>
            </div>

            {/* Pricing Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Medical Services */}
              <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col">
                <div className="text-center flex-grow">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Giá khám bệnh
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Dịch vụ kỹ thuật y tế, khám bệnh, xét nghiệm, chẩn đoán hình ảnh
                  </p>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                    {medicalServicePrices.length} dịch vụ
                  </div>
                </div>
                <Link to="/services/pricing/medical">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </Link>
              </Card>

              {/* Vaccine Services */}
              <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col">
                <div className="text-center flex-grow">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Syringe className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Giá tiêm vaccine
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Các loại vaccine phòng bệnh cho trẻ em và người lớn
                  </p>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                    {vaccinePrices.length} vaccine
                  </div>
                </div>
                <Link to="/services/pricing/vaccine">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </Link>
              </Card>

              {/* Drug & Supplies */}
              <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col">
                <div className="text-center flex-grow">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Giá thuốc - VTYT
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Thuốc và vật tư y tế chất lượng cao
                  </p>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                    {drugPrices.length} sản phẩm
                  </div>
                </div>
                <Link to="/services/pricing/drug">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Download Section */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Tải file Excel bảng giá
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Tải về file Excel đầy đủ để xem offline hoặc in ấn
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={() => alert('Tải file "Bang giá DVKT 22.4.2025.xlsx"')}>
                  Tải giá khám bệnh
                </Button>
                <Button variant="outline" onClick={() => alert('Tải file "1. Bảng giá tiêm Vắc xin 2023.xlsx"')}>
                  Tải giá vaccine
                </Button>
                <Button variant="outline" onClick={() => alert('Tải file "GIA THUOC, VTYT.xls"')}>
                  Tải giá thuốc - VTYT
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Cần tư vấn thêm về giá dịch vụ?
                </h3>
                <p className="text-blue-700 dark:text-blue-200 mb-4">
                  Liên hệ hotline để được tư vấn chi tiết về các dịch vụ và chính sách ưu đãi
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="tel:02513996060" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    📞 025 1399 6060
                  </a>
                  <span className="text-blue-600 dark:text-blue-400">|</span>
                  <a href="mailto:bvquany7b@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                    ✉️ bvquany7b@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Dịch vụ y tế chuyên nghiệp
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Chúng tôi cung cấp đa dạng các dịch vụ y tế từ khám bệnh, xét nghiệm đến chẩn đoán hình ảnh 
                với chất lượng cao và giá cả hợp lý.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockPublicServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Gói dịch vụ tiết kiệm
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Chọn gói dịch vụ phù hợp để tiết kiệm chi phí và có trải nghiệm chăm sóc sức khỏe toàn diện.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {mockServicePackages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          </div>
        )}

        {/* Vaccination Tab */}
        {activeTab === 'vaccination' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Dịch vụ tiêm chủng an toàn
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Tiêm chủng đầy đủ với các loại vaccine chất lượng cao, được bảo quản đúng quy chuẩn 
                và tiêm bởi đội ngũ y tế chuyên nghiệp.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockVaccinationServices.map((vaccine) => (
                <VaccineCard key={vaccine.id} vaccine={vaccine} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bạn cần tư vấn thêm?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn miễn phí và hỗ trợ bạn chọn dịch vụ phù hợp nhất.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Gọi ngay: 02513 99 60 60
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-700">
              Chat với Bác sĩ
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage; 
