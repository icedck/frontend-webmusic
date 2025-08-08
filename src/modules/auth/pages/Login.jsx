// src/modules/auth/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useAuth } from '../../../hooks/useAuth.jsx'; // <<< SỬ DỤNG HOOK useAuth
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { Music, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { authService } from "../services/authService.js";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme } = useDarkMode();
  const auth = useAuth(); // <<< LẤY CONTEXT AUTH

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(
      location.state?.message || '' // Hiển thị thông báo từ trang Register nếu có
  );

  // Xác định trang sẽ chuyển đến sau khi đăng nhập thành công
  const from = location.state?.from?.pathname || '/dashboard';

  // <<< ĐÃ XÓA: Toàn bộ logic liên quan đến Google Login

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    }
    // Mật khẩu không cần validate độ dài ở đây, để server kiểm tra
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
    setServerError(''); // Reset lỗi mỗi khi submit

    try {
      // 1. Gọi service để thực hiện logic API (lưu token, user vào localStorage)
      const response = await authService.login({
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });

      // 2. Nếu thành công, sử dụng hàm `login` từ AuthContext để cập nhật state toàn cục
      auth.login(response.user);

      // 3. Chuyển hướng người dùng
      navigate(from, { replace: true });

    } catch (error) {
      console.error('Login error:', error);
      const errorData = error.response?.data;
      if (error.response?.status === 401 || error.response?.status === 404) {
        setServerError('Email hoặc mật khẩu không chính xác.');
      } else {
        setServerError(errorData?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-music-500 to-music-600 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h2 className={`text-3xl font-bold ${currentTheme.text}`}>Đăng nhập</h2>
            <p className={`mt-2 ${currentTheme.textSecondary}`}>Chào mừng trở lại!</p>
          </div>

          <div className={`${currentTheme.bgCard} p-8 rounded-xl shadow-lg ${currentTheme.border} border`}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {serverError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">{serverError}</p>
                  </div>
              )}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${currentTheme.text} mb-2`}>Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                  </div>
                  <Input
                      id="email" name="email" type="email" autoComplete="email" required
                      value={formData.email} onChange={handleChange}
                      className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Nhập email của bạn"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${currentTheme.text} mb-2`}>Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                  </div>
                  <Input
                      id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
                      value={formData.password} onChange={handleChange}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Nhập mật khẩu"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className={`w-5 h-5 ${currentTheme.textSecondary}`} /> : <Eye className={`w-5 h-5 ${currentTheme.textSecondary}`} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className={`text-sm ${currentTheme.textSecondary}`}>
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-medium text-music-500 hover:text-music-600">Đăng ký ngay</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;