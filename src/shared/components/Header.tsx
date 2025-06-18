import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo7b from "shared/assets/images/logo/logo-7b.png";
import { ThemeSwitcher } from 'shared/components/ThemeSwitcher';
import { LanguageSwitcher } from 'shared/components/LanguageSwitcher';
import { Button } from 'shared/components/shadcn/button';
import { Input } from 'shared/components/shadcn/input';
import LoginModal from 'shared/features/login/components/LoginModal';
import ActivateAccountModal from 'shared/features/login/components/ActivateAccountModal';
import { useLogoutMutation } from 'shared/hooks/useAuthMutations';
import { useAuth } from 'app/stores/authStore';

// Header trang chủ bệnh viện, gồm logo, tên, thông tin liên hệ và ô tìm kiếm
export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogoutMutation();

  const handleOpenLogin = () => {
    setShowLoginModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  const handleOpenActivateModal = () => {
    setShowActivateModal(true);
  };

  const handleCloseActivateModal = () => {
    setShowActivateModal(false);
  };

  const handleOpenForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/");
  };

  return (
    <header className="bg-white dark:bg-gray-900 text-black dark:text-white border-b dark:border-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center py-4 gap-4">
        {/* Cột trái: Logo + tên + địa chỉ */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <img 
            src={logo7b} 
            alt="Logo Bệnh viện Quân Y 7B" 
            className="w-16 h-16 object-contain bg-white dark:bg-gray-900 rounded-full border border-green-600" 
          />
          <div className="text-left min-w-0">
            <h1 className="text-xl md:text-2xl font-bold leading-tight text-red-600 dark:text-red-400 truncate">
              Cục Hậu Cần - Kỹ Thuật Quân Khu 7
            </h1>
            <h1 className="text-2xl md:text-4xl font-bold leading-tight text-green-700 dark:text-green-400 truncate">
              BỆNH VIỆN QUÂN Y 7B
            </h1>
            <div className="text-sm text-black dark:text-gray-200 font-medium truncate">
              Địa chỉ : Đường Nguyễn Ái Quốc, P Tân Mai, Thành phố Biên Hoà, Tỉnh Đồng Nai
            </div>
          </div>
        </div>

        {/* Cột phải: Tìm kiếm, theme, đăng nhập, trực cấp cứu */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 md:basis-1/3">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <form className="relative w-full max-w-xs">
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full pl-8 pr-3 py-2 bg-gray-100 dark:bg-gray-800 placeholder:text-green-700 dark:placeholder:text-green-300 border-green-400 focus:border-green-500"
              />
              <span className="absolute left-2 top-2.5 text-green-700 dark:text-green-300">🔍</span>
            </form>
            
            <LanguageSwitcher />
            <ThemeSwitcher />
            
            {!isAuthenticated ? (
              <Button
                variant="link"
                className="text-red-600 dark:text-red-400 font-semibold ml-2 p-0 h-auto hover:underline"
                onClick={handleOpenLogin}
              >
                Đăng nhập
              </Button>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <span className="font-semibold text-green-700 dark:text-green-300">
                  {user?.fullName}
                </span>
                <Button
                  variant="link"
                  className="text-red-600 dark:text-red-400 font-semibold p-0 h-auto hover:underline"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? 'Đang xuất...' : 'Đăng xuất'}
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm mt-1">
            <span className="text-red-600 text-sm dark:text-red-400 font-semibold">Trực Cấp Cứu:</span>
            <span className="font-normal text-sm text-black dark:text-white">24/7</span>
            <span className="text-red-600 text-sm dark:text-red-400">📞 02513 99 60 60</span>
          </div>
        </div>
      </div>

      {/* Modal đăng nhập */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLogin}
        onOpenActivateModal={handleOpenActivateModal}
        onOpenForgotPassword={handleOpenForgotPassword}
      />

      {/* Modal kích hoạt tài khoản */}
      <ActivateAccountModal
        isOpen={showActivateModal}
        onClose={handleCloseActivateModal}
      />
    </header>
  );
} 
