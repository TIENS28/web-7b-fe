/**
 * Trang chỉnh sửa bài viết
 * Sử dụng ArticlesForm component với mode chỉnh sửa
 */

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ArticlesForm from '../components/ArticlesForm';

const ArticleEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Link 
            to="/admin/articles" 
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            Quản lý bài viết
          </Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white">Chỉnh sửa bài viết</span>
        </nav>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          Chỉnh sửa bài viết
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <ArticlesForm articleId={id} />
        </div>
      </div>
    </div>
  );
};

export default ArticleEditPage; 
