import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'shared/components/shadcn/button';
import { Input } from 'shared/components/shadcn/input';
import { Label } from 'shared/components/shadcn/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'shared/components/shadcn/card';
import { useForgotPasswordMutation } from 'shared/hooks/useAuthMutations';

// Trang quên mật khẩu
export default function ForgotPasswordPage() {
  const [personalId, setPersonalId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const forgotPasswordMutation = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personalId.trim()) {
      return;
    }

    try {
      await forgotPasswordMutation.mutateAsync(personalId);
      setIsSubmitted(true);
    } catch {
      // Error đã được xử lý trong mutation
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalId(e.target.value);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
              Yêu cầu đã được gửi
            </CardTitle>
            <CardDescription>
              Kiểm tra email hoặc SMS để nhận hướng dẫn đặt lại mật khẩu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Link to="/">
                <Button className="bg-green-700 hover:bg-green-800 text-white">
                  Về trang chủ
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
            Quên mật khẩu
          </CardTitle>
          <CardDescription>
            Nhập CCCD, email hoặc số điện thoại để nhận hướng dẫn đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="personalId">CCCD/Email/Số điện thoại</Label>
              <Input
                id="personalId"
                type="text"
                placeholder="Nhập CCCD, email hoặc số điện thoại"
                value={personalId}
                onChange={handleInputChange}
                disabled={forgotPasswordMutation.isPending}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-700 hover:bg-green-800 text-white"
              disabled={forgotPasswordMutation.isPending || !personalId.trim()}
            >
              {forgotPasswordMutation.isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Quay lại trang chủ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
