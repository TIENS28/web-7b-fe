/**
 * Pricing Table Component
 * Component hiển thị bảng giá dịch vụ với search và filter
 */

import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, Download } from 'lucide-react';
import { Button } from 'shared/components/shadcn/button';
import { Input } from 'shared/components/shadcn/input';
import { Badge } from 'shared/components/shadcn/badge';
import { Card } from 'shared/components/shadcn/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/components/shadcn/select";
import type { MedicalServicePrice, VaccinePrice, DrugPrice } from 'shared/types/Pricing.types';

type PricingData = MedicalServicePrice | VaccinePrice | DrugPrice;

interface PricingTableProps {
  data: PricingData[];
  type: 'medical' | 'vaccine' | 'drug';
  title: string;
  description?: string;
  onViewDetail?: (item: PricingData) => void;
  onDownload?: () => void;
}

export const PricingTable: React.FC<PricingTableProps> = ({
  data,
  type,
  title,
  description,
  onViewDetail,
  onDownload
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Format currency
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD',
    }).format(price);
  };

  // Get categories for filter
  const categories = useMemo(() => {
    const cats = new Set<string>();
    data.forEach(item => {
      if ('category' in item) {
        cats.add(item.category);
      } else if ('manufacturer' in item && 'vaccineName' in item) {
        cats.add((item as VaccinePrice).manufacturer);
      }
    });
    return Array.from(cats);
  }, [data]);

  // Filter and search data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        ('name' in item && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ('vaccineName' in item && (item as VaccinePrice).vaccineName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ('code' in item && item.code.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = categoryFilter === 'all' ||
        ('category' in item && item.category === categoryFilter) ||
        ('manufacturer' in item && (item as VaccinePrice).manufacturer === categoryFilter);

      return matchesSearch && matchesCategory;
    });
  }, [data, searchTerm, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderTableHeader = () => {
    switch (type) {
      case 'medical':
        return (
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Mã DV</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Tên dịch vụ</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Loại</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Đơn vị</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Giá</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Thao tác</th>
          </tr>
        );
      case 'vaccine':
        return (
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Mã</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Tên vaccine</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Hãng SX</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Lứa tuổi</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Giá vaccine</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Tổng tiền</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Thao tác</th>
          </tr>
        );
      case 'drug':
        return (
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Mã</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Tên</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Hoạt chất</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Dạng bào chế</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">ĐVT</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Giá</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Thao tác</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableRow = (item: PricingData, index: number) => {
    switch (type) {
             case 'medical': {
         const medicalItem = item as MedicalServicePrice;
         return (
          <tr key={medicalItem.id} className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-mono">{medicalItem.code}</td>
            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{medicalItem.name}</td>
            <td className="py-3 px-4">
              <Badge variant="outline" className="text-xs">
                {medicalItem.category}
              </Badge>
            </td>
            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{medicalItem.unit}</td>
            <td className="py-3 px-4 text-right text-sm font-semibold text-green-600 dark:text-green-400">
              {formatPrice(medicalItem.price, medicalItem.currency)}
            </td>
            <td className="py-3 px-4 text-center">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewDetail?.(medicalItem)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </td>
                     </tr>
         );
       }
       case 'vaccine': {
         const vaccineItem = item as VaccinePrice;
        return (
          <tr key={vaccineItem.id} className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-mono">{vaccineItem.code}</td>
            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{vaccineItem.vaccineName}</td>
            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{vaccineItem.manufacturer}</td>
            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{vaccineItem.ageGroup}</td>
            <td className="py-3 px-4 text-right text-sm text-gray-900 dark:text-white">
              {formatPrice(vaccineItem.price, vaccineItem.currency)}
            </td>
            <td className="py-3 px-4 text-right text-sm font-semibold text-green-600 dark:text-green-400">
              {formatPrice(vaccineItem.totalPrice, vaccineItem.currency)}
            </td>
            <td className="py-3 px-4 text-center">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewDetail?.(vaccineItem)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </td>
                     </tr>
         );
       }
       case 'drug': {
         const drugItem = item as DrugPrice;
        return (
          <tr key={drugItem.id} className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-mono">{drugItem.code}</td>
            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{drugItem.name}</td>
            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{drugItem.ingredient}</td>
            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{drugItem.form}</td>
            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{drugItem.unit}</td>
            <td className="py-3 px-4 text-right text-sm font-semibold text-green-600 dark:text-green-400">
              {formatPrice(drugItem.price, drugItem.currency)}
            </td>
            <td className="py-3 px-4 text-center">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewDetail?.(drugItem)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </td>
          </tr>
        );
       }
       default:
         return null;
    }
  };

  return (
    <Card className="w-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            {description && (
              <p className="text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          
          {onDownload && (
            <Button onClick={onDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Tải file Excel
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Lọc theo danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {renderTableHeader()}
          </thead>
          <tbody>
            {paginatedData.map((item, index) => renderTableRow(item, index))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} 
              trong tổng số {filteredData.length} kết quả
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                  .map((page, index, array) => {
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return (
                        <React.Fragment key={`gap-${page}`}>
                          <span className="px-2 text-gray-500">...</span>
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}; 