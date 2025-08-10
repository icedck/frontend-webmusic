import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useAuth } from '../../../hooks/useAuth.jsx';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { Music, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';
import { authService } from "../services/authService.js";
import AuthBrandingPanel from '../components/AuthBrandingPanel';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, currentTheme } = useDarkMode();
  const auth = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Xóa state khỏi location để không hiển thị lại khi refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    setServerError('');
    try {
      const response = await authService.loginWithGoogle(credentialResponse.credential);
      auth.login(response.user);
      navigate(from, { replace: true });
    } catch (error) {
      setServerError('Đăng nhập với Google thất bại. Vui lòng thử lại.');
      console.error('Google Login Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    setServerError('Quá trình đăng nhập với Google đã bị hủy hoặc có lỗi xảy ra.');
    console.error('Google Login Error');
  };

  const handleFacebookLogin = () => { console.log('Đăng nhập với Facebook'); };

  const handleGuestAccess = () => {
    navigate('/dashboard');
  };

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setServerError('');
    setSuccessMessage('');
    try {
      const response = await authService.login({
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });
      auth.login(response.user);
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
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <AuthBrandingPanel />
        <div className={`relative w-full ${currentTheme.bg} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Link to="/" className="lg:hidden flex justify-center mb-4">
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
                    <div className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-600 dark:text-red-400 text-sm">{serverError}</p>
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-green-600 dark:text-green-400 text-sm">{successMessage}</p>
                    </div>
                )}
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${currentTheme.text} mb-2`}>Email</label>
                  <div className="relative">
                    <Mail className={`w-5 h-5 ${currentTheme.textSecondary} absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none`} />
                    <Input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="pl-10" placeholder="Nhập email của bạn" />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="password" className={`block text-sm font-medium ${currentTheme.text} mb-2`}>Mật khẩu</label>
                  <div className="relative">
                    <Lock className={`w-5 h-5 ${currentTheme.textSecondary} absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none`} />
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={formData.password} onChange={handleChange} className="pl-10 pr-10" placeholder="Nhập mật khẩu" />
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
              <div className="flex items-center my-6">
                <hr className={`flex-grow ${currentTheme.border}`} />
                <span className={`mx-4 text-sm ${currentTheme.textSecondary}`}>hoặc</span>
                <hr className={`flex-grow ${currentTheme.border}`} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} theme={isDarkMode ? 'filled_black' : 'outline'} text="continue_with" shape="pill" width="300px" />
                </div>
                <Button onClick={handleFacebookLogin} className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white">
                  <FaFacebook />
                  <span>Tiếp tục với Facebook</span>
                </Button>
              </div>
              <div className="mt-8 text-center">
                <p className={`text-sm ${currentTheme.textSecondary}`}>
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="font-medium text-music-500 hover:text-music-600">Đăng ký ngay</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <button onClick={handleGuestAccess} className={`fixed top-6 right-6 lg:top-8 lg:right-8 flex items-center gap-2.5 py-2.5 px-5 rounded-full text-sm font-semibold bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm border ${currentTheme.border} shadow-lg ${currentTheme.textSecondary} hover:${currentTheme.text} hover:shadow-xl hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300 transform hover:scale-105 active:scale-100`}>
          <span>Khám phá ngay</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
  );
};

export default Login;