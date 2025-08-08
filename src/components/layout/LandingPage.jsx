import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../hooks/useDarkMode';
import Button from '../common/Button';
import { Music, Play, Heart, Headphones, Sun, Moon, Sparkles, Zap, Shield, Users } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { currentTheme, toggleDarkMode, isDarkMode } = useDarkMode();

  const features = [
    {
      icon: <Music className="w-8 h-8" />,
      title: 'Kho nhạc bất tận',
      description: 'Khám phá hàng triệu bài hát từ các nghệ sĩ hàng đầu thế giới'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Streaming siêu nhanh',
      description: 'Công nghệ streaming hiện đại, không gián đoạn, zero delay'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'AI đề xuất thông minh',
      description: 'Thuật toán AI học theo sở thích, gợi ý nhạc hoàn hảo'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Chất lượng Studio',
      description: 'Hi-Res Audio, Lossless, trải nghiệm âm thanh đỉnh cao'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
      {/* Enhanced Header */}
      <header className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl blur opacity-20"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <Music className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className={`text-2xl font-bold ${currentTheme.text} tracking-tight`}>
                  WebMusic
                </span>
                <div className="text-xs text-slate-500 font-medium tracking-wider">
                  NEXT-GEN MUSIC
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-6">
              <button 
                onClick={toggleDarkMode} 
                className="w-10 h-10 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60 hover:scale-105"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="primary" className="shadow-lg">
                    Vào ứng dụng
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <Button variant="ghost">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="accent">
                      Đăng ký ngay
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Main Title */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-100/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 rounded-full border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nền tảng âm nhạc thế hệ mới
                </span>
              </div>
              
              <h1 className={`text-5xl lg:text-7xl font-bold ${currentTheme.text} tracking-tight leading-tight`}>
                Âm nhạc cho
                <br />
                <span className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 dark:from-slate-300 dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  mọi cảm xúc
                </span>
              </h1>
              
              <p className={`text-xl lg:text-2xl ${currentTheme.textSecondary} max-w-4xl mx-auto leading-relaxed font-light`}>
                Khám phá thế giới âm nhạc không giới hạn với công nghệ AI tiên tiến, 
                chất lượng studio và trải nghiệm được cá nhân hóa hoàn toàn.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              {!isAuthenticated && (
                <>
                  <Link to="/register">
                    <Button variant="accent" size="lg" className="w-full sm:w-auto shadow-2xl shadow-indigo-500/25">
                      <Play className="w-5 h-5 mr-2" />
                      Bắt đầu ngay - Miễn phí
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Đăng nhập
                    </Button>
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <Link to="/dashboard">
                  <Button variant="accent" size="lg" className="shadow-2xl shadow-indigo-500/25">
                    <Music className="w-5 h-5 mr-2" />
                    Vào ứng dụng
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="pt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: '10M+', label: 'Bài hát' },
                { number: '500K+', label: 'Nghệ sĩ' },
                { number: '1M+', label: 'Người dùng' },
                { number: '99.9%', label: 'Uptime' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl lg:text-4xl font-bold ${currentTheme.text} mb-2`}>
                    {stat.number}
                  </div>
                  <div className={`text-sm ${currentTheme.textSecondary} uppercase tracking-wider font-medium`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className={`text-4xl lg:text-5xl font-bold ${currentTheme.text} mb-6 tracking-tight`}>
              Tại sao chọn WebMusic?
            </h2>
            <p className={`text-xl ${currentTheme.textSecondary} max-w-3xl mx-auto font-light`}>
              Trải nghiệm âm nhạc được thiết kế cho tương lai với những tính năng độc quyền
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-8 hover:border-slate-300/80 dark:hover:border-slate-600/80 transition-all duration-500 group-hover:scale-105 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-600 dark:to-slate-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className={`text-2xl font-semibold ${currentTheme.text} tracking-tight`}>
                        {feature.title}
                      </h3>
                      <p className={`text-lg ${currentTheme.textSecondary} leading-relaxed`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 via-blue-50/30 to-indigo-100/50 dark:from-slate-800/50 dark:via-slate-900/30 dark:to-slate-800/50"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-12 lg:p-16 shadow-2xl shadow-slate-900/10">
            <h2 className={`text-4xl lg:text-5xl font-bold ${currentTheme.text} mb-6 tracking-tight`}>
              Sẵn sàng bắt đầu hành trình âm nhạc?
            </h2>
            <p className={`text-xl ${currentTheme.textSecondary} mb-10 max-w-2xl mx-auto font-light`}>
              Tham gia cộng đồng hàng triệu người yêu âm nhạc trên khắp thế giới
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/register">
                  <Button variant="accent" size="lg" className="w-full sm:w-auto shadow-2xl shadow-indigo-500/25">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Đăng ký miễn phí
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Đã có tài khoản?
                  </Button>
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <Link to="/dashboard">
                <Button variant="accent" size="lg" className="shadow-2xl shadow-indigo-500/25">
                  <Music className="w-5 h-5 mr-2" />
                  Khám phá ngay
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-900 dark:bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo & Description */}
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold tracking-tight">WebMusic</span>
                  <div className="text-xs text-slate-400 font-medium tracking-wider">
                    NEXT-GEN MUSIC
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Nền tảng âm nhạc hiện đại nhất, mang đến trải nghiệm nghe nhạc đỉnh cao 
                cho mọi người yêu âm nhạc.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Ứng dụng Web</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ứng dụng Mobile</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API cho Developer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Premium</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bảo mật</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 mb-4 md:mb-0">
              © 2024 WebMusic. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="text-sm">Được phát triển với</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm">tại Việt Nam</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
