import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useAuth } from '../../hooks/useAuth';
import CommandPalette from './CommandPalette';
import {
  Music, Home, Search, Users as AdminIcon, Mic2, ListMusic as SongIcon, CheckSquare,
  Crown, Upload, LogOut, Sun, Moon, User, Settings
} from 'lucide-react';

const DashboardLayout = () => {
  const { currentTheme, toggleDarkMode, isDarkMode } = useDarkMode();
  const { user, logout, isAdmin, isCreator, isPremium } = useAuth();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainNavItems = [
    { name: 'Trang chủ', href: '/dashboard', icon: Home, category: 'Menu' },
    { name: 'Tìm kiếm', href: '/search', icon: Search, category: 'Menu' },
    { name: 'Thư viện', href: '/songs', icon: Music, category: 'Menu' },
  ];

  const creatorNavItems = [
    { name: 'Tải lên bài hát', href: '/creator/submission/new', icon: Upload, category: 'Creator' },
    { name: 'Yêu cầu của tôi', href: '/creator/my-submissions', icon: SongIcon, category: 'Creator' },
    { name: 'Bảng điều khiển Creator', href: '/creator', icon: Settings, category: 'Creator' }
  ];

  const adminNavItems = [
    { name: 'Quản lý người dùng', href: '/admin/users', icon: AdminIcon, category: 'Admin' },
    { name: 'Quản lý ca sĩ', href: '/admin/singers', icon: Mic2, category: 'Admin' },
    { name: 'Quản lý bài hát', href: '/admin/songs', icon: SongIcon, category: 'Admin' },
    { name: 'Duyệt bài hát', href: '/admin/submissions', icon: CheckSquare, category: 'Admin' }
  ];

  const userNavItems = [
    { name: 'Thông tin cá nhân', href: '/profile', icon: User, category: 'Tài khoản' },
    { name: 'Đăng xuất', href: '#', icon: LogOut, category: 'Tài khoản', action: handleLogout }
  ];

  const premiumNavItem = { name: 'Nâng cấp Premium', href: '/premium', icon: Crown, category: 'Tài khoản' };

  const navigationCommands = [
    ...mainNavItems,
    ...(isCreator() ? creatorNavItems : []),
    ...(isAdmin() ? adminNavItems : []),
    ...userNavItems,
    ...(!isPremium() ? [premiumNavItem] : [])
  ];

  return (
      <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} font-sans`}>
        <header className={`sticky top-0 z-40 w-full backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-700/80`}>
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">WebMusic</span>
            </Link>

            <div className="flex-1 flex justify-center px-8">
              <button
                  onClick={() => setIsPaletteOpen(true)}
                  className="w-full max-w-md flex items-center text-sm p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-colors"
              >
                <Search className={`w-4 h-4 mr-2 ${currentTheme.textSecondary}`} />
                <span className={`${currentTheme.textSecondary}`}>Điều hướng hoặc tìm kiếm...</span>
                <span className="ml-auto text-xs border border-gray-300 dark:border-gray-600 rounded-md px-1.5 py-0.5">⌘K</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-black/5 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/10 transition-colors">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="group relative">
                <Link to="/profile">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer">
                    {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" /> : <User className="w-5 h-5" />}
                  </div>
                </Link>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-black/5 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/10 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <CommandPalette
            isOpen={isPaletteOpen}
            onClose={() => setIsPaletteOpen(false)}
            navigationCommands={navigationCommands}
        />
      </div>
  );
};

export default DashboardLayout;