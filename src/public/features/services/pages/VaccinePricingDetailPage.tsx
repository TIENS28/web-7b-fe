/**
 * Vaccine Pricing Detail Page
 * Trang chi tiết giá tiêm vaccine
 */

import React from 'react';
import { ArrowLeft, Download, PrinterIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from 'shared/components/shadcn/button';
import { PricingTable } from 'shared/components/ui/PricingTable';
import { vaccinePrices } from 'shared/data/pricing';
import type { MedicalServicePrice, VaccinePrice, DrugPrice } from 'shared/types/Pricing.types';

type PricingData = MedicalServicePrice | VaccinePrice | DrugPrice;

const VaccinePricingDetailPage: React.FC = () => {
  const handleViewDetail = (item: PricingData) => {
    // Show modal or navigate to detail view
    console.log('View detail:', item);
  };

  const handleDownload = () => {
    // Simulate download
    alert('Đang tải file Excel "1. Bảng giá tiêm Vắc xin 2023.xlsx"...');
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
                Bảng giá tiêm vaccine
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Cập nhật năm 2023 - Bệnh viện Quân y 7B
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
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-purple-600 dark:text-purple-400 mt-0.5">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                Thông tin dịch vụ tiêm vaccine
              </h3>
              <div className="text-sm text-purple-700 dark:text-purple-200 space-y-1">
                <p>• Giá vaccine chưa bao gồm phí dịch vụ tiêm (đã hiển thị riêng)</p>
                <p>• Vaccine được bảo quản theo chuẩn quốc tế WHO</p>
                <p>• Tư vấn miễn phí trước khi tiêm</p>
                <p>• Theo dõi sau tiêm 30 phút</p>
                <p>• Liên hệ đặt lịch: <strong>02513996060</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <PricingTable
          data={vaccinePrices}
          type="vaccine"
          title="Chi tiết giá tiêm vaccine"
          description={`Tổng cộng ${vaccinePrices.length} loại vaccine có sẵn tại Bệnh viện Quân y 7B`}
          onViewDetail={handleViewDetail}
          onDownload={handleDownload}
        />

        {/* Vaccine Schedule Notice */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 dark:text-yellow-400 mt-0.5">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Lịch tiêm và tư vấn
              </h3>
              <div className="text-sm text-yellow-700 dark:text-yellow-200 space-y-1">
                <p>• Thời gian tiêm vaccine: Thứ 2 - Thứ 6 (7:00 - 16:00), Thứ 7 (7:00 - 11:00)</p>
                <p>• Cần đặt lịch trước tối thiểu 1 ngày</p>
                <p>• Mang theo CMND/CCCD và sổ tiêm chủng (nếu có)</p>
                <p>• Tham khảo lịch tiêm chuẩn tại: <a href="https://tiemchungmorenh.vn" className="underline">tiemchungmorenh.vn</a></p>
              </div>
            </div>
          </div>
        </div>

        {/* Hospital Info */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Phòng tiêm chủng - Bệnh viện Quân y 7B
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Thông tin liên hệ</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Địa chỉ: Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hòa, Tỉnh Đồng Nai</p>
                <p>Điện thoại: <a href="tel:02513996060" className="text-blue-600 hover:underline">025 1399 6060</a></p>
                <p>Email: <a href="mailto:bvquany7b@gmail.com" className="text-blue-600 hover:underline">bvquany7b@gmail.com</a></p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Giờ tiêm vaccine</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Thứ 2 - Thứ 6: 7:00 - 16:00</p>
                <p>Thứ 7: 7:00 - 11:00</p>
                <p>Chủ nhật: Nghỉ</p>
                <p className="text-green-600 dark:text-green-400">Cần đặt lịch trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinePricingDetailPage; 