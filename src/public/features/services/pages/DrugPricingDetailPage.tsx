/**
 * Drug & Medical Supply Pricing Detail Page
 * Trang chi tiết giá thuốc và vật tư y tế
 */

import React from 'react';
import { ArrowLeft, Download, PrinterIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from 'shared/components/shadcn/button';
import { PricingTable } from 'shared/components/ui/PricingTable';
import { drugPrices } from 'shared/data/pricing';
import type { MedicalServicePrice, VaccinePrice, DrugPrice } from 'shared/types/Pricing.types';

type PricingData = MedicalServicePrice | VaccinePrice | DrugPrice;

const DrugPricingDetailPage: React.FC = () => {
  const handleViewDetail = (item: PricingData) => {
    // Show modal or navigate to detail view
    console.log('View detail:', item);
  };

  const handleDownload = () => {
    // Simulate download
    alert('Đang tải file Excel "GIA THUOC, VTYT.xls"...');
  };

  const handlePrint = () => {
    window.print();
  };

  const drugItems = drugPrices.filter(item => item.category === 'thuoc');
  const supplyItems = drugPrices.filter(item => item.category === 'vtyt');

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
                Bảng giá thuốc và vật tư y tế
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Cập nhật năm 2025 - Bệnh viện Quân y 7B
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
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-green-600 dark:text-green-400 mt-0.5">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                Thông tin về thuốc và vật tư y tế
              </h3>
              <div className="text-sm text-green-700 dark:text-green-200 space-y-1">
                <p>• Giá thuốc đã bao gồm VAT</p>
                <p>• Thuốc được cung cấp theo đơn thuốc của bác sĩ</p>
                <p>• Vật tư y tế đảm bảo chất lượng theo tiêu chuẩn</p>
                <p>• Có sẵn thuốc bảo hiểm y tế và tự nguyện</p>
                <p>• Liên hệ nhà thuốc: <strong>02513996060</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {drugItems.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Loại thuốc</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {supplyItems.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Vật tư y tế</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {drugPrices.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Tổng cộng</div>
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <PricingTable
          data={drugPrices}
          type="drug"
          title="Chi tiết giá thuốc và vật tư y tế"
          description={`Danh mục ${drugPrices.length} sản phẩm thuốc và vật tư y tế tại Bệnh viện Quân y 7B`}
          onViewDetail={handleViewDetail}
          onDownload={handleDownload}
        />

        {/* Insurance Notice */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 dark:text-blue-400 mt-0.5">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Bảo hiểm y tế và thanh toán
              </h3>
              <div className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                <p>• Chấp nhận thẻ BHYT theo quy định hiện hành</p>
                <p>• Thanh toán: Tiền mặt, thẻ ATM, chuyển khoản</p>
                <p>• Xuất hóa đơn VAT theo yêu cầu</p>
                <p>• Bảo quản thuốc đúng cách, hướng dẫn sử dụng chi tiết</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pharmacy Info */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Nhà thuốc - Bệnh viện Quân y 7B
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Thông tin liên hệ</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Địa chỉ: Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hòa, Tỉnh Đồng Nai</p>
                <p>Điện thoại: <a href="tel:02513996060" className="text-blue-600 hover:underline">025 1399 6060</a></p>
                <p>Email: <a href="mailto:bvquany7b@gmail.com" className="text-blue-600 hover:underline">bvquany7b@gmail.com</a></p>
                <p>Dược sĩ trực: 24/7</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Giờ bán thuốc</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Thứ 2 - Thứ 6: 6:30 - 17:30</p>
                <p>Thứ 7: 6:30 - 12:00</p>
                <p>Chủ nhật: 7:00 - 11:00</p>
                <p className="text-red-600 dark:text-red-400">Cấp cứu: 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugPricingDetailPage; 