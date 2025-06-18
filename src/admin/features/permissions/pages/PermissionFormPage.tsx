/**
 * Trang form tạo/sửa permission
 * Sử dụng chung cho cả tạo mới và chỉnh sửa
 */

import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const PermissionFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    action: '',
    resource: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log('Form data:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Link 
            to="/admin/permissions" 
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            Quản lý quyền
          </Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white">
            {isEdit ? 'Chỉnh sửa quyền' : 'Tạo quyền mới'}
          </span>
        </nav>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          {isEdit ? `Chỉnh sửa quyền #${id}` : 'Tạo quyền mới'}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Thông tin quyền
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label 
                htmlFor="action" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Action <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="action"
                name="action"
                value={formData.action}
                onChange={handleChange}
                placeholder="create, read, update, delete, list..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Chỉ sử dụng chữ thường và dấu gạch dưới
              </p>
            </div>

            <div>
              <label 
                htmlFor="resource" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Resource <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="resource"
                name="resource"
                value={formData.resource}
                onChange={handleChange}
                placeholder="users, articles, roles, permissions..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Chỉ sử dụng chữ thường và dấu gạch dưới
              </p>
            </div>

            <div className="sm:col-span-2">
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Mô tả chi tiết về quyền này..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Permission: <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                {formData.resource || 'resource'}:{formData.action || 'action'}
              </code>
            </p>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Link
              to="/admin/permissions"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isEdit ? 'Cập nhật' : 'Tạo quyền'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionFormPage; 
