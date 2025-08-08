import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../hooks/useAuth';
import { Music, Users, Play, Heart } from 'lucide-react';

const Dashboard = () => {
  const { currentTheme } = useDarkMode();
  const { user, isPremium, isAdmin } = useAuth();

  const stats = [
    {
      name: 'Bài hát yêu thích',
      value: '0',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      name: 'Playlist của tôi',
      value: '0',
      icon: Music,
      color: 'text-music-500'
    },
    {
      name: 'Đã nghe',
      value: '0',
      icon: Play,
      color: 'text-green-500'
    },
    {
      name: 'Theo dõi',
      value: '0',
      icon: Users,
      color: 'text-blue-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className={`${currentTheme.bgCard} rounded-xl p-6 ${currentTheme.border} border`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${currentTheme.text} mb-2`}>
              Chào mừng trở lại, {user?.fullName || user?.name || 'User'}!
            </h1>
            <p className={`${currentTheme.textSecondary}`}>
              {isAdmin() ? 'Quản trị hệ thống WebMusic' : 'Sẵn sàng khám phá thế giới âm nhạc hôm nay?'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {isPremium() && (
              <div className="bg-gradient-to-r from-music-500 to-music-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                ⭐ Premium
              </div>
            )}
            {isAdmin() && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                🛡️ Admin
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`${currentTheme.bgCard} rounded-xl p-6 ${currentTheme.border} border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${currentTheme.textSecondary}`}>
                  {stat.name}
                </p>
                <p className={`text-2xl font-bold ${currentTheme.text} mt-1`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className={`${currentTheme.bgCard} rounded-xl p-6 ${currentTheme.border} border`}>
        <h2 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>
          Hoạt động gần đây
        </h2>
        <div className="text-center py-12">
          <Music className={`w-16 h-16 ${currentTheme.textSecondary} mx-auto mb-4`} />
          <p className={`${currentTheme.textSecondary}`}>
            Chưa có hoạt động nào. Hãy bắt đầu nghe nhạc!
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${currentTheme.bgCard} rounded-xl p-6 ${currentTheme.border} border`}>
        <h2 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>
          Khám phá ngay
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-music-500 to-music-600 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
            <Music className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-2">Tìm kiếm nhạc</h3>
            <p className="text-sm opacity-90">Khám phá hàng triệu bài hát</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
            <Heart className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-2">Tạo playlist</h3>
            <p className="text-sm opacity-90">Tổ chức nhạc yêu thích</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
            <Users className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-2">Theo dõi nghệ sĩ</h3>
            <p className="text-sm opacity-90">Kết nối với nghệ sĩ yêu thích</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
