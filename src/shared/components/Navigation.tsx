// Thanh điều hướng menu chính
import { useTranslation } from 'react-i18next'; // Import hook
import { useAuth } from 'app/providers/AuthProvider'; // Import auth hook 
import { Link } from 'react-router-dom'; // Import Link để navigation
import { useNavigate } from 'react-router-dom';

export default function Navigation() {  
  const { t } = useTranslation(); // Sử dụng hook useTranslation
  const { isAdmin, isAuthenticated } = useAuth(); // Sử dụng hook auth để check quyền admin
  const navigate = useNavigate();

  return (
      <nav className="bg-green-700 shadow-md dark:bg-gray-800 text-white dark:text-white border-b dark:border-gray-800">
      <div className="container mx-auto">
        <ul className="flex flex-wrap justify-between md:justify-center gap-2 md:gap-6">
          <li className="px-4 py-2 rounded transition-colors hover:bg-green-400 hover:text-green-900 font-semibold cursor-pointer" onClick={() => navigate('/')}>{t('home')}</li>
          <li className="px-4 py-2 rounded transition-colors hover:bg-green-400 hover:text-green-900 font-semibold cursor-pointer" onClick={() => navigate('/news/Test')}>{t('about')}</li>
          <li className="px-4 py-2 rounded transition-colors hover:bg-green-400 hover:text-green-900 font-semibold cursor-pointer" onClick={() => navigate('/services')}>{t('services')}</li>
          {/* <li className="px-4 py-2 rounded transition-colors hover:bg-green-400 hover:text-green-900 font-semibold cursor-pointer">{t('specialties')}</li> */}
          <li className="px-4 py-2 rounded transition-colors hover:bg-green-400 hover:text-green-900 font-semibold cursor-pointer" onClick={() => navigate('/doctors')}>{t('doctors')}</li>
          <li className="px-4 py-2 rounded transition-colors hover:bg-green-400 hover:text-green-900 font-semibold cursor-pointer" onClick={() => navigate('/news')}>{t('news')}</li>
          <li className="px-4 py-2 rounded transition-colors hover:bg-green-400 hover:text-green-900 font-semibold cursor-pointer" onClick={() => navigate('/contact')}>{t('contact')}</li>
          {/* Hiển thị link Admin nếu user đã đăng nhập và có quyền admin */}
          {isAuthenticated && isAdmin() && (
            <li className="px-4 py-2 rounded transition-colors hover:bg-green-400 hover:text-green-900 font-semibold cursor-pointer">
              <Link to="/admin" className="block">
                {t('admin') || 'Quản trị'}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
} 
