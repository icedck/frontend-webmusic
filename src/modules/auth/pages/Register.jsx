// src/modules/auth/pages/Register.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { Music, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { authService } from "../services/authService.js";
import { useAuth } from '../../../hooks/useAuth.jsx';
import AuthBrandingPanel from '../components/AuthBrandingPanel';

const Register = () => {
  const navigate = useNavigate();
  const { currentTheme } = useDarkMode();
  const auth = useAuth();

  const [formData, setFormData] = useState({
    displayName: '', email: '', password: '', confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  // --- TOÀN BỘ LOGIC CỦA BẠN ĐƯỢC GIỮ NGUYÊN ---
  const validateForm = () => {
    const newErrors = {};
    if (!formData.displayName.trim()) newErrors.displayName = 'Tên hiển thị không được để trống';
    else if (formData.displayName.trim().length < 2) newErrors.displayName = 'Tên hiển thị phải có ít nhất 2 ký tự';
    if (!formData.email) newErrors.email = 'Email không được để trống';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.password) newErrors.password = 'Mật khẩu không được để trống';
    else if (formData.password.length < 8) newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setServerError('');
    try {
      const registerData = {
        displayName: formData.displayName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      };
      const response = await authService.register(registerData);
      const token = response.data?.token;
      if (token) {
        setSuccess(true);
        await authService.handleLoginSuccess(token);
        auth.login(authService.getStoredUser());
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setServerError(response.message || "Đăng ký thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorData = error.response?.data;
      setServerError(errorData?.message || 'Có lỗi xảy ra hoặc email đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };
  // --- KẾT THÚC LOGIC ---

  if (success) {
    return (
        <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
            <h2 className={`text-2xl font-bold ${currentTheme.text} mb-2`}>Đăng ký thành công!</h2>
            <p className={`${currentTheme.textSecondary} mb-4`}>Đang tự động đăng nhập và chuyển hướng bạn đến trang chủ...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-music-500 mx-auto"></div>
          </div>
        </div>
    );
  }

  return (
      // <<< THAY ĐỔI: Bố cục Grid 2 cột >>>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <AuthBrandingPanel />

        {/* Cột bên phải chứa form */}
        <div className={`w-full ${currentTheme.bg} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Link to="/" className="lg:hidden flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-music-500 to-music-600 rounded-xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
              </Link>
              <h2 className={`text-3xl font-bold ${currentTheme.text}`}>Tạo tài khoản</h2>
              <p className={`mt-2 ${currentTheme.textSecondary}`}>Khám phá thế giới âm nhạc ngay hôm nay</p>
            </div>

            <div className={`${currentTheme.bgCard} p-8 rounded-xl shadow-lg ${currentTheme.border} border`}>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                {serverError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-600 dark:text-red-400 text-sm">{serverError}</p>
                    </div>
                )}

                {/* --- CÁC TRƯỜNG INPUT GIỮ NGUYÊN, CHỈ SỬA LẠI ĐỂ TƯƠNG THÍCH VỚI COMPONENT INPUT MỚI --- */}
                <Input label="Tên hiển thị *" id="displayName" name="displayName" type="text"
                       autoComplete="name" required value={formData.displayName} onChange={handleChange}
                       placeholder="Nhập tên hiển thị của bạn" error={errors.displayName}
                />

                <Input label="Email *" id="email" name="email" type="email"
                       autoComplete="email" required value={formData.email} onChange={handleChange}
                       placeholder="Nhập email của bạn" error={errors.email}
                />

                <div className="relative">
                  <Input label="Mật khẩu *" id="password" name="password" type={showPassword ? 'text' : 'password'}
                         autoComplete="new-password" required value={formData.password} onChange={handleChange}
                         placeholder="Tối thiểu 8 ký tự" error={errors.password}
                  />
                  <button type="button" className="absolute top-[42px] right-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className={`w-5 h-5 ${currentTheme.textSecondary}`} /> : <Eye className={`w-5 h-5 ${currentTheme.textSecondary}`} />}
                  </button>
                </div>

                <div className="relative">
                  <Input label="Xác nhận mật khẩu *" id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
                         autoComplete="new-password" required value={formData.confirmPassword} onChange={handleChange}
                         placeholder="Nhập lại mật khẩu" error={errors.confirmPassword}
                  />
                  <button type="button" className="absolute top-[42px] right-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className={`w-5 h-5 ${currentTheme.textSecondary}`} /> : <Eye className={`w-5 h-5 ${currentTheme.textSecondary}`} />}
                  </button>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className={`text-sm ${currentTheme.textSecondary}`}>
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="font-medium text-music-500 hover:text-music-600">Đăng nhập ngay</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Register;