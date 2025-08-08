// src/components/layout/DashboardLayout.jsx
import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import {
  Music, Home, Search, Users as AdminIcon, Mic2, ListMusic as SongIcon,
  Crown, Upload, LogOut, Sun, Moon, User, Settings
} from 'lucide-react';

const DashboardLayout = () => {
  const { currentTheme, toggleDarkMode, isDarkMode } = useDarkMode();
  const { user, logout, isAdmin, isCreator, isPremium } = useAuth();

  const handleLogout = () => logout();
  const getNavLinkClass = ({ isActive }) => isActive ? `flex items-center px-4 py-3 mb-1 rounded-lg text-sm font-medium bg-music-500 text-white` : `flex items-center px-4 py-3 mb-1 rounded-lg text-sm font-medium ${currentTheme.text} hover:${currentTheme.bgHover} dark:hover:bg-gray-700`;

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
    { name: 'Quản lý bài hát', href: '/admin/songs', icon: SongIcon }
  ];

  return (
      <div className={`flex h-screen ${currentTheme.bg} text-sm`}>
        <aside className={`w-64 flex-shrink-0 flex flex-col ${currentTheme.bgCard} ${currentTheme.border} border-r`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-music-500 to-music-600 rounded-lg flex items-center justify-center"><Music className="w-5 h-5 text-white" /></div>
              <span className={`text-xl font-bold ${currentTheme.text}`}>WebMusic</span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <h3 className={`px-4 py-2 text-xs font-semibold uppercase ${currentTheme.textSecondary}`}>Menu</h3>
            {mainNavItems.map(item => <NavLink key={item.name} to={item.href} className={getNavLinkClass} end={item.href === '/dashboard'}><item.icon className="w-5 h-5 mr-3" /><span>{item.name}</span></NavLink>)}
            {isCreator() && (<><h3 className={`px-4 pt-4 pb-2 text-xs font-semibold uppercase ${currentTheme.textSecondary}`}>Creator</h3>{creatorNavItems.map(item => <NavLink key={item.name} to={item.href} className={getNavLinkClass} end={item.href === '/creator'}><item.icon className="w-5 h-5 mr-3" /><span>{item.name}</span></NavLink>)}</>)}
            {isAdmin() && (<><h3 className={`px-4 pt-4 pb-2 text-xs font-semibold uppercase ${currentTheme.textSecondary}`}>Admin</h3>{adminNavItems.map(item => <NavLink key={item.name} to={item.href} className={getNavLinkClass}><item.icon className="w-5 h-5 mr-3" /><span>{item.name}</span></NavLink>)}</>)}
          </nav>
          {!isPremium() && (<div className="p-4 flex-shrink-0"><div className="bg-gradient-to-r from-music-500 to-music-600 rounded-lg p-4 text-white"><div className="flex items-center mb-2"><Crown className="w-5 h-5 mr-2" /> <span className="font-medium">Premium</span></div><p className="text-sm opacity-90 mb-3">Nâng cấp để trải nghiệm không giới hạn.</p><Link to="/premium"><Button variant="outline" size="sm" className="w-full text-white border-white hover:bg-white hover:text-music-500">Nâng cấp ngay</Button></Link></div></div>)}
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className={`flex-shrink-0 ${currentTheme.bgCard} ${currentTheme.border} border-b px-6 py-3`}><div className="flex items-center justify-end"><div className="flex items-center space-x-4"><button onClick={toggleDarkMode} className={`p-2 rounded-full ${currentTheme.textSecondary} hover:${currentTheme.bgHover} dark:hover:bg-gray-700`}>{isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button><div className="flex items-center space-x-3 border-l pl-4 border-gray-200 dark:border-gray-700"><div className="text-right hidden sm:block"><p className={`font-medium ${currentTheme.text}`}>{user?.displayName || 'User'}</p><p className={`text-xs ${currentTheme.textSecondary}`}>{user?.email}</p></div><div className="relative group"><NavLink to="/profile" className={getNavLinkClass}><div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"><User className="w-5 h-5" /></div></NavLink></div><button onClick={handleLogout} className={`p-2 rounded-full ${currentTheme.textSecondary} hover:${currentTheme.bgHover} dark:hover:bg-gray-700`}><LogOut className="w-5 h-5" /></button></div></div></div></header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8"><Outlet /></main>
        </div>
      </div>
  );
};
export default DashboardLayout;