import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../hooks/useDarkMode';
import Button from '../common/Button';
import { Music, Play, Heart, Headphones } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { currentTheme, toggleDarkMode, isDarkMode } = useDarkMode();

  const features = [
    {
      icon: <Music className="w-8 h-8" />,
      title: 'Thư viện khổng lồ',
      description: 'Hàng triệu bài hát từ các nghệ sĩ yêu thích của bạn'
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: 'Chất lượng cao',
      description: 'Trải nghiệm âm thanh tuyệt vời với chất lượng lossless'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Playlist cá nhân',
      description: 'Tạo và chia sẻ playlist theo sở thích riêng'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Nghe offline',
      description: 'Tải xuống và nghe nhạc mọi lúc mọi nơi'
    }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      {/* Header */}
      <header className={`${currentTheme.bgCard} ${currentTheme.border} border-b backdrop-blur-md bg-opacity-80 sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-music-500 to-music-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${currentTheme.text}`}>
                WebMusic
              </span>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`
                  p-2 rounded-lg ${currentTheme.textSecondary}
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  transition-colors duration-200
                `}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button>Vào Dashboard</Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="outline">Đăng nhập</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Đăng ký</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-4xl lg:text-6xl font-bold ${currentTheme.text} mb-6`}>
              Âm nhạc cho
              <span className="text-gradient block">mọi cảm xúc</span>
            </h1>
            <p className={`text-xl ${currentTheme.textSecondary} mb-8 max-w-3xl mx-auto`}>
              Khám phá hàng triệu bài hát, tạo playlist cá nhân và chia sẻ âm nhạc 
              yêu thích với bạn bè. Trải nghiệm âm nhạc không giới hạn cùng WebMusic.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated && (
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Bắt đầu miễn phí
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Khám phá âm nhạc
              </Button>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-music-500 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500 opacity-10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl lg:text-4xl font-bold ${currentTheme.text} mb-4`}>
              Tại sao chọn WebMusic?
            </h2>
            <p className={`text-lg ${currentTheme.textSecondary} max-w-2xl mx-auto`}>
              Chúng tôi mang đến trải nghiệm âm nhạc tuyệt vời với những tính năng hiện đại
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`
                  p-6 rounded-xl ${currentTheme.bgCard} ${currentTheme.border} 
                  border hover:shadow-lg transition-all duration-300
                  text-center group
                `}
              >
                <div className="text-music-500 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>
                  {feature.title}
                </h3>
                <p className={`${currentTheme.textSecondary}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`p-12 rounded-2xl ${currentTheme.bgCard} ${currentTheme.border} border`}>
            <h2 className={`text-3xl font-bold ${currentTheme.text} mb-4`}>
              Sẵn sàng bắt đầu hành trình âm nhạc?
            </h2>
            <p className={`text-lg ${currentTheme.textSecondary} mb-8`}>
              Tham gia hàng triệu người dùng đã tin tưởng WebMusic
            </p>
            {!isAuthenticated && (
              <Link to="/register">
                <Button size="lg">
                  Đăng ký ngay - Miễn phí
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${currentTheme.bgCard} ${currentTheme.border} border-t py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-music-500 to-music-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${currentTheme.text}`}>
                WebMusic
              </span>
            </div>
            <p className={`${currentTheme.textMuted} text-center md:text-right`}>
              © 2024 WebMusic. Được phát triển với ❤️ tại Việt Nam.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
