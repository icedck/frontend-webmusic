// src/modules/auth/pages/ChangePassword.jsx
import React, { useState } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { authService } from '../services/authService';
import { Eye, EyeOff } from 'lucide-react'; // Sử dụng lại Lucide icons

const ChangePassword = () => {
  const { currentTheme } = useDarkMode();
  const auth = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmationPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Mật khẩu hiện tại không được để trống';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được để trống';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự';
    }
    if (formData.newPassword && formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu cũ.';
    }
    if (!formData.confirmationPassword) {
      newErrors.confirmationPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (formData.confirmationPassword !== formData.newPassword) {
      newErrors.confirmationPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');
    setSuccessMessage('');
    try {
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmationPassword: formData.confirmationPassword,
      });
      setSuccessMessage('Đổi mật khẩu thành công! Bạn sẽ được đăng xuất sau 3 giây.');
      setTimeout(() => {
        auth.logout();
      }, 3000);
    } catch (error) {
      console.error('Change password error:', error);
      const errorData = error.response?.data;
      setServerError(errorData?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      setLoading(false); // Chỉ reset loading nếu có lỗi
    }
  };

  return (
      <div className="space-y-6">
        <div>
          <h1 className={`text-2xl font-bold ${currentTheme.text}`}>Đổi mật khẩu</h1>
          <p className={`mt-1 ${currentTheme.textSecondary}`}>Để đảm bảo an toàn, bạn nên sử dụng mật khẩu mạnh và không chia sẻ cho bất kỳ ai.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg pt-4 border-t border-gray-200 dark:border-gray-700">
          {serverError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{serverError}</p>
              </div>
          )}
          {successMessage && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-600 dark:text-green-400 text-sm">✅ {successMessage}</p>
              </div>
          )}

          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>Mật khẩu hiện tại</label>
            <div className="relative">
              <Input name="currentPassword" type={showPasswords.current ? 'text' : 'password'} value={formData.currentPassword} onChange={handleChange} className={errors.currentPassword ? 'border-red-500' : ''} placeholder="Nhập mật khẩu hiện tại" disabled={loading || !!successMessage} />
              <button type="button" className={`absolute inset-y-0 right-0 pr-3 flex items-center ${currentTheme.textSecondary}`} onClick={() => togglePasswordVisibility('current')}>
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>Mật khẩu mới</label>
            <div className="relative">
              <Input name="newPassword" type={showPasswords.new ? 'text' : 'password'} value={formData.newPassword} onChange={handleChange} className={errors.newPassword ? 'border-red-500' : ''} placeholder="Tối thiểu 8 ký tự" disabled={loading || !!successMessage} />
              <button type="button" className={`absolute inset-y-0 right-0 pr-3 flex items-center ${currentTheme.textSecondary}`} onClick={() => togglePasswordVisibility('new')}>
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>Xác nhận mật khẩu mới</label>
            <div className="relative">
              <Input name="confirmationPassword" type={showPasswords.confirm ? 'text' : 'password'} value={formData.confirmationPassword} onChange={handleChange} className={errors.confirmationPassword ? 'border-red-500' : ''} placeholder="Nhập lại mật khẩu mới" disabled={loading || !!successMessage} />
              <button type="button" className={`absolute inset-y-0 right-0 pr-3 flex items-center ${currentTheme.textSecondary}`} onClick={() => togglePasswordVisibility('confirm')}>
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmationPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmationPassword}</p>}
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={loading || !!successMessage} className="w-full sm:w-auto">
              {loading ? 'Đang xử lý...' : 'Lưu mật khẩu mới'}
            </Button>
          </div>
        </form>
      </div>
  );
};

export default ChangePassword;