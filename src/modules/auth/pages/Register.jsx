// src/modules/auth/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { Music, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { authService } from "../services/authService.js";
import { useAuth } from '../../../hooks/useAuth.jsx'; // <<< THÊM MỚI

const Register = () => {
  const navigate = useNavigate();
  const { currentTheme } = useDarkMode();
  const auth = useAuth(); // <<< THÊM MỚI: Lấy context authentication

  const [formData, setFormData] = useState({
    displayName: '', // <<< ĐÃ SỬA: Đổi fullName thành displayName để khớp với backend
    email: '',
    // <<< ĐÃ XÓA: Loại bỏ trường 'phone'
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.displayName.trim()) { // <<< ĐÃ SỬA
      newErrors.displayName = 'Tên hiển thị không được để trống'; // <<< ĐÃ SỬA
    } else if (formData.displayName.trim().length < 2) { // <<< ĐÃ SỬA
      newErrors.displayName = 'Tên hiển thị phải có ít nhất 2 ký tự'; // <<< ĐÃ SỬA
    }

    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // <<< ĐÃ XÓA: Validation cho phone

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError(''); // Reset lỗi server mỗi khi submit

    try {
      const registerData = {
        displayName: formData.displayName.trim(), // <<< ĐÃ SỬA
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      };

      // <<< LOGIC ĐĂNG KÝ VÀ TỰ ĐỘNG ĐĂNG NHẬP MỚI
      const response = await authService.register(registerData);
      const token = response.data?.token;

      if (token) {
        // Nếu có token, đăng ký thành công
        setSuccess(true);
        // Sử dụng hàm từ authService để lưu token và thông tin người dùng
        await authService.handleLoginSuccess(token);
        // Cập nhật trạng thái auth trong context
        auth.login(authService.getStoredUser());

        // Chờ 2 giây để người dùng thấy thông báo, sau đó chuyển hướng đến dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        // Nếu API trả về thành công nhưng không có token (trường hợp hiếm)
        setServerError(response.message || "Đăng ký thất bại, vui lòng thử lại.");
      }

    } catch (error) {
      console.error('Registration error:', error);
      const errorData = error.response?.data;
      if (errorData) {
        setServerError(errorData.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      } else {
        setServerError('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
        <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className={`text-2xl font-bold ${currentTheme.text} mb-2`}>
              Đăng ký thành công!
            </h2>
            <p className={`${currentTheme.textSecondary} mb-4`}>
              Đang tự động đăng nhập và chuyển hướng bạn đến trang chủ...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-music-500 mx-auto"></div>
          </div>
        </div>
    );
  }

  return (
      <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-music-500 to-music-600 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
              Tạo tài khoản
            </h2>
            <p className={`mt-2 ${currentTheme.textSecondary}`}>
              Khám phá thế giới âm nhạc ngay hôm nay
            </p>
          </div>

          <div className={`${currentTheme.bgCard} p-8 rounded-xl shadow-lg ${currentTheme.border} border`}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {serverError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">{serverError}</p>
                  </div>
              )}

              <div>
                <label htmlFor="displayName" className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                  Tên hiển thị *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                  </div>
                  <Input
                      id="displayName"
                      name="displayName" // <<< ĐÃ SỬA
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.displayName} // <<< ĐÃ SỬA
                      onChange={handleChange}
                      className={`pl-10 ${errors.displayName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`} // <<< ĐÃ SỬA
                      placeholder="Nhập tên hiển thị của bạn"
                  />
                </div>
                {errors.displayName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.displayName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                  </div>
                  <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Nhập email của bạn"
                  />
                </div>
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* <<< ĐÃ XÓA: Toàn bộ div cho trường nhập số điện thoại */}

              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                  Mật khẩu *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                  </div>
                  <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Tối thiểu 8 ký tự"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className={`w-5 h-5 ${currentTheme.textSecondary}`} /> : <Eye className={`w-5 h-5 ${currentTheme.textSecondary}`} />}
                  </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                  Xác nhận mật khẩu *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                  </div>
                  <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Nhập lại mật khẩu"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className={`w-5 h-5 ${currentTheme.textSecondary}`} /> : <Eye className={`w-5 h-5 ${currentTheme.textSecondary}`} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className={`text-sm ${currentTheme.textSecondary}`}>
                Đã có tài khoản?{' '}
                <Link to="/login" className="font-medium text-music-500 hover:text-music-600">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Register;