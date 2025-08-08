import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import {
  Music, Home, Search, Users as AdminIcon, Mic2, ListMusic as SongIcon, CheckSquare,
  Crown, Upload, LogOut, Sun, Moon, User, Settings, Sparkles
} from 'lucide-react';

const DashboardLayout = () => {
  const { currentTheme, toggleDarkMode, isDarkMode } = useDarkMode();
  const { user, logout, isAdmin, isCreator, isPremium } = useAuth();

  const handleLogout = () => logout();
  
  const getNavLinkClass = ({ isActive }) => 
    isActive 
      ? `group relative flex items-center px-4 py-3 mb-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 text-white shadow-lg shadow-slate-900/25 border border-slate-600/50`
      : `group relative flex items-center px-4 py-3 mb-2 rounded-2xl text-sm font-medium ${currentTheme.text} hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-all duration-200 hover:translate-x-1`;

  const mainNavItems = [
    { name: 'Trang chủ', href: '/dashboard', icon: Home },
    { name: 'Tìm kiếm', href: '/search', icon: Search },
    { name: 'Thư viện', href: '/songs', icon: Music },
  ];

  const creatorNavItems = [
    { name: 'Tải lên', href: '/creator/submission/new', icon: Upload },
    { name: 'Yêu cầu của tôi', href: '/creator/my-submissions', icon: SongIcon },
    { name: 'Bảng điều khiển', href: '/creator', icon: Settings }
  ];

  const adminNavItems = [
    { name: 'Quản lý người dùng', href: '/admin/users', icon: AdminIcon },
    { name: 'Quản lý ca sĩ', href: '/admin/singers', icon: Mic2 },
    { name: 'Quản lý bài hát', href: '/admin/songs', icon: SongIcon },
    { name: 'Duyệt bài hát', href: '/admin/submissions', icon: CheckSquare }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
      {/* Enhanced Sidebar */}
      <aside className="w-72 flex-shrink-0 flex flex-col">
        {/* Sidebar Background with Blur */}
        <div className="absolute inset-y-0 left-0 w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <Music className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className={`text-2xl font-bold ${currentTheme.text} tracking-tight`}>WebMusic</span>
                <div className="text-xs text-slate-500 font-medium tracking-wider">MUSIC PLATFORM</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-6 overflow-y-auto">
            {/* Main Navigation */}
            <div className="mb-8">
              <h3 className="px-2 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Khám phá
              </h3>
              {mainNavItems.map(item => (
                <NavLink key={item.name} to={item.href} className={getNavLinkClass} end={item.href === '/dashboard'}>
                  <item.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>

            {/* Creator Navigation */}
            {isCreator() && (
              <div className="mb-8">
                <h3 className="px-2 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Sáng tạo
                </h3>
                {creatorNavItems.map(item => (
                  <NavLink key={item.name} to={item.href} className={getNavLinkClass} end={item.href === '/creator'}>
                    <item.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            )}

            {/* Admin Navigation */}
            {isAdmin() && (
              <div className="mb-8">
                <h3 className="px-2 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Quản trị
                </h3>
                {adminNavItems.map(item => (
                  <NavLink key={item.name} to={item.href} className={getNavLinkClass}>
                    <item.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </nav>

          {/* Premium Upgrade Card */}
          {!isPremium() && (
            <div className="p-6 border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="relative">
                  <div className="flex items-center mb-3">
                    <Crown className="w-6 h-6 mr-2" />
                    <Sparkles className="w-4 h-4 opacity-80" />
                  </div>
                  <h4 className="font-semibold mb-2">Nâng cấp Premium</h4>
                  <p className="text-sm opacity-90 mb-4 leading-relaxed">
                    Trải nghiệm âm nhạc không giới hạn với chất lượng cao nhất.
                  </p>
                  <Link to="/premium">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 backdrop-blur-sm"
                    >
                      Nâng cấp ngay
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 px-8 py-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleDarkMode} 
                className="w-10 h-10 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60 hover:scale-105"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-200/60 dark:border-slate-700/60">
                <div className="text-right hidden sm:block">
                  <p className={`font-semibold ${currentTheme.text}`}>
                    {user?.displayName || user?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </p>
                </div>
                
                <NavLink to="/profile" className="group">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-lg">
                    <User className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                  </div>
                </NavLink>

                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all duration-200 flex items-center justify-center border border-red-200/50 dark:border-red-800/50 hover:scale-105"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;