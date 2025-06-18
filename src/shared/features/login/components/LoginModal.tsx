import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'shared/components/shadcn/dialog';
import { Button } from 'shared/components/shadcn/button';
import { Input } from 'shared/components/shadcn/input';
import { Label } from 'shared/components/shadcn/label';
import { useLoginMutation } from 'shared/hooks/useAuthMutations';
import { useAuth } from 'app/stores/authStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenActivateModal: () => void;
  onOpenForgotPassword: () => void;
}

// Modal đăng nhập với CCCD/Email/SĐT
export default function LoginModal({ 
  isOpen, 
  onClose, 
  onOpenActivateModal, 
  onOpenForgotPassword 
}: LoginModalProps) {
  const [formData, setFormData] = useState({
    personalId: '',
    password: ''
  });

  const loginMutation = useLoginMutation();
  const { isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.personalId.trim() || !formData.password.trim()) {
      return;
    }

    try {
      await loginMutation.mutateAsync(formData);
      onClose();
      setFormData({ personalId: '', password: '' });
    } catch {
      // Error đã được xử lý trong mutation
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

  const handleActivateAccount = () => {
    onClose();
    onOpenActivateModal();
  };

  const handleForgotPassword = () => {
    onClose();
    onOpenForgotPassword();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Đăng nhập</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="personalId">CCCD/Email/Số điện thoại</Label>
            <Input
              id="personalId"
              type="text"
              placeholder="Nhập CCCD, Email hoặc Số điện thoại"
              value={formData.personalId}
              onChange={handleInputChange('personalId')}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleInputChange('password')}
              disabled={isLoading}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-700 hover:bg-green-800 text-white"
            disabled={isLoading || !formData.personalId.trim() || !formData.password.trim()}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="flex flex-col gap-2 pt-4 border-t">
          <Button 
            variant="link" 
            className="text-blue-600 hover:text-blue-800 p-0 h-auto"
            onClick={handleForgotPassword}
          >
            Quên mật khẩu?
          </Button>
          
          <Button 
            variant="link" 
            className="text-blue-600 hover:text-blue-800 p-0 h-auto"
            onClick={handleActivateAccount}
          >
            Kích hoạt tài khoản
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
