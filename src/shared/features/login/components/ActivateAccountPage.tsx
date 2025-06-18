import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'shared/components/shadcn/button';
import { Input } from 'shared/components/shadcn/input';
import { Label } from 'shared/components/shadcn/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'shared/components/shadcn/card';
import { useActivateAccountMutation, useVerifyActivationOtpMutation } from 'shared/hooks/useAuthMutations';

// Trang kích hoạt tài khoản
export default function ActivateAccountPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    personalId: '',
    email: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isCompleted, setIsCompleted] = useState(false);

  const activateAccountMutation = useActivateAccountMutation();
  const verifyOtpMutation = useVerifyActivationOtpMutation();

  const handleSendActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.personalId.trim() || !formData.email.trim()) {
      return;
    }

    try {
      await activateAccountMutation.mutateAsync(formData);
      setStep(2);
    } catch {
      // Error đã được xử lý trong mutation
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({
        personalId: formData.personalId,
        otp: otpString
      });
      setIsCompleted(true);
    } catch {
      // Error đã được xử lý trong mutation
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, '');
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setOtp(['', '', '', '', '', '']);
  };

  // Hiển thị màn hình hoàn thành
  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
              Kích hoạt thành công!
            </CardTitle>
            <CardDescription>
              Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ.
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
            {step === 1 ? 'Kích hoạt tài khoản' : 'Xác nhận OTP'}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? 'Nhập thông tin để kích hoạt tài khoản của bạn'
              : 'Nhập mã OTP đã gửi về email/SMS'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleSendActivation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="personalId">CCCD hoặc Số điện thoại</Label>
                <Input
                  id="personalId"
                  type="text"
                  placeholder="Nhập CCCD hoặc số điện thoại"
                  value={formData.personalId}
                  onChange={handleInputChange('personalId')}
                  disabled={activateAccountMutation.isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={activateAccountMutation.isPending}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-700 hover:bg-green-800 text-white"
                disabled={
                  activateAccountMutation.isPending || 
                  !formData.personalId.trim() || 
                  !formData.email.trim()
                }
              >
                {activateAccountMutation.isPending ? 'Đang gửi...' : 'Kích hoạt'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex gap-2 justify-center mb-4">
                {otp.map((value, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg"
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    disabled={verifyOtpMutation.isPending}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleBackToStep1}
                  disabled={verifyOtpMutation.isPending}
                >
                  Quay lại
                </Button>
                
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white"
                  disabled={verifyOtpMutation.isPending || otp.join('').length !== 6}
                >
                  {verifyOtpMutation.isPending ? 'Đang xác nhận...' : 'Xác nhận'}
                </Button>
              </div>
            </form>
          )}

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
