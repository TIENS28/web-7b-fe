/**
 * Medical Service Pricing Detail Page
 * Trang chi tiết giá dịch vụ khám bệnh
 */

import React from 'react';
import { ArrowLeft, Download, PrinterIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from 'shared/components/shadcn/button';
import { PricingTable } from 'shared/components/ui/PricingTable';
import { medicalServicePrices } from 'shared/data/pricing';
import type { MedicalServicePrice, VaccinePrice, DrugPrice } from 'shared/types/Pricing.types';

type PricingData = MedicalServicePrice | VaccinePrice | DrugPrice;

const MedicalPricingDetailPage: React.FC = () => {
  const handleViewDetail = (item: PricingData) => {
    // Show modal or navigate to detail view
    console.log('View detail:', item);
  };

  const handleDownload = () => {
    // Simulate download
    alert('Đang tải file Excel "Bang giá DVKT 22.4.2025.xlsx"...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/services?tab=pricing"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại bảng giá
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Bảng giá dịch vụ kỹ thuật y tế
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Hiệu lực từ ngày 22/04/2025 - Bệnh viện Quân y 7B
              </p>
            </div>
            
            <div className="flex gap-2">
                             <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
                 <PrinterIcon className="h-4 w-4" />
                 In bảng giá
               </Button>
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Tải Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 dark:text-blue-400 mt-0.5">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Lưu ý quan trọng
              </h3>
              <div className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                <p>• Giá dịch vụ đã bao gồm VAT</p>
                <p>• Giá có thể thay đổi mà không báo trước</p>
                <p>• Để biết thêm chi tiết, vui lòng liên hệ: <strong>02513996060</strong></p>
                <p>• Bảng giá này áp dụng cho tất cả bệnh nhân</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <PricingTable
          data={medicalServicePrices}
          type="medical"
          title="Chi tiết giá dịch vụ kỹ thuật y tế"
          description={`Tổng cộng ${medicalServicePrices.length} dịch vụ y tế được niêm yết tại Bệnh viện Quân y 7B`}
          onViewDetail={handleViewDetail}
          onDownload={handleDownload}
        />

        {/* Hospital Info */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thông tin liên hệ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bệnh viện Quân y 7B</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Địa chỉ: Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hòa, Tỉnh Đồng Nai</p>
                <p>Điện thoại: <a href="tel:02513996060" className="text-blue-600 hover:underline">025 1399 6060</a></p>
                <p>Email: <a href="mailto:bvquany7b@gmail.com" className="text-blue-600 hover:underline">bvquany7b@gmail.com</a></p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Giờ làm việc</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Thứ 2 - Thứ 6: 7:00 - 11:30, 13:30 - 17:00</p>
                <p>Thứ 7: 7:00 - 11:30</p>
                <p>Chủ nhật: Nghỉ</p>
                <p className="text-red-600 dark:text-red-400">Cấp cứu 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalPricingDetailPage; 