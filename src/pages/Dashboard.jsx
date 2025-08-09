import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../hooks/useAuth';
import { Music, Users, Play, Heart, Search, ListPlus } from 'lucide-react';

const Dashboard = () => {
  const { currentTheme } = useDarkMode();
  const { user, isPremium, isAdmin } = useAuth();

  // Đơn giản hóa stats, màu sắc sẽ được điều khiển bởi currentTheme
  const stats = [
    { name: 'Bài hát yêu thích', value: '0', icon: Heart },
    { name: 'Playlist của tôi', value: '0', icon: ListPlus },
    { name: 'Đã nghe', value: '0', icon: Play },
    { name: 'Theo dõi', value: '0', icon: Users }
  ];

  // Quick Actions giờ đây sẽ nhất quán
  const quickActions = [
    {
      title: 'Tìm kiếm nhạc',
      description: 'Khám phá hàng triệu bài hát',
      icon: Search
    },
    {
      title: 'Tạo playlist',
      description: 'Tổ chức nhạc yêu thích',
      icon: ListPlus
    },
    {
      title: 'Theo dõi nghệ sĩ',
      description: 'Kết nối với nghệ sĩ yêu thích',
      icon: Users
    }
  ];

  return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className={`${currentTheme.bgCard} rounded-xl p-6 ${currentTheme.border} border`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${currentTheme.text} mb-2`}>
                Chào mừng trở lại, {user?.displayName || 'User'}!
              </h1>
              <p className={`${currentTheme.textSecondary}`}>
                {isAdmin() ? 'Quản trị hệ thống WebMusic' : 'Sẵn sàng khám phá thế giới âm nhạc hôm nay?'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isPremium() && (
                  <div className="bg-amber-400/10 text-amber-400 px-4 py-2 rounded-full text-sm font-medium border border-amber-400/20">
                    ⭐ Premium
                  </div>
              )}
              {isAdmin() && (
                  <div className="bg-red-400/10 text-red-400 px-4 py-2 rounded-full text-sm font-medium border border-red-400/20">
                    🛡️ Admin
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
              <div key={stat.name} className={`${currentTheme.bgCard} rounded-xl p-6 ${currentTheme.border} border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${currentTheme.textSecondary}`}>{stat.name}</p>
                    <p className={`text-2xl font-bold ${currentTheme.text} mt-1`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${currentTheme.bgSecondary}`}>
                    {/* Tất cả icon giờ đây dùng màu textPrimary */}
                    <stat.icon className={`w-6 h-6 ${currentTheme.textPrimary}`} />
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className={`${currentTheme.bgCard} rounded-xl p-6 ${currentTheme.border} border`}>
          <h2 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>Hoạt động gần đây</h2>
          <div className="text-center py-12">
            <Music className={`w-16 h-16 ${currentTheme.textSecondary} mx-auto mb-4`} />
            <p className={`${currentTheme.textSecondary}`}>Chưa có hoạt động nào. Hãy bắt đầu nghe nhạc!</p>
          </div>
        </div>

        {/* Quick Actions - ĐÃ ĐƯỢC THIẾT KẾ LẠI */}
        <div className={`${currentTheme.bgCard} rounded-xl p-6 ${currentTheme.border} border`}>
          <h2 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>Khám phá ngay</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
                <div
                    key={action.title}
                    // Sử dụng màu primary (teal) duy nhất, loại bỏ hoàn toàn gradient
                    className={`group rounded-lg p-6 ${currentTheme.primary} text-white cursor-pointer transition-transform transform hover:-translate-y-1`}
                >
                  <action.icon className="w-8 h-8 mb-3 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm opacity-80">{action.description}</p>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;