// frontend/src/components/layout/DashboardLayout.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useAuth } from '../../hooks/useAuth';
import { useAudio } from '../../hooks/useAudio';
import CommandPalette from './CommandPalette';
import PlayerSidebar from './PlayerSidebar';
import Button from '../common/Button';
import ConfirmationModal from '../common/ConfirmationModal';
import {
  Music, Home, Search, Library, BarChart3, Users as AdminIcon, Mic2, ListMusic as SongIcon, CheckSquare,
  Crown, Upload, LogOut, Sun, Moon, User, Settings, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Repeat1, Briefcase, KeyRound, ChevronDown, BookOpen
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const AppHeader = ({ onOpenPalette, isPlayerVisible, onConfirmLogout }) => {
  const { toggleDarkMode, isDarkMode } = useDarkMode();
  const { user, isPremium, isAdmin, isCreator } = useAuth();
  const {
    currentSong, isPlaying, isRepeat, isShuffle,
    togglePlay, playNext, playPrevious, toggleRepeat, toggleShuffle
  } = useAudio();
  const location = useLocation();

  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
        setIsAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [avatarMenuRef]);

  // COMMENT: Cập nhật mục "Thư viện" để trỏ đến '/my-playlists'
  const mainNavItems = [
    { href: '/dashboard', icon: Home, label: 'Trang chủ' },
    { href: '/my-playlists', icon: Library, label: 'Thư viện' },
    { href: '/charts', icon: BarChart3, label: 'Bảng xếp hạng' },
    { type: 'button', action: onOpenPalette, icon: Search, label: 'Tìm kiếm' },
  ];

  const userMenuItems = [
    { href: '/profile', icon: User, label: 'Cập nhật thông tin' },
    { href: '/profile/change-password', icon: KeyRound, label: 'Đổi mật khẩu' }
  ];

  const creatorMenuItems = [
    { href: '/creator/my-library', icon: BookOpen, label: 'Thư viện bài hát' },
    { href: '/creator/my-submissions', icon: SongIcon, label: 'Quản lý yêu cầu' },
    { href: '/creator/submission/new', icon: Upload, label: 'Tải lên bài hát' }
  ];

  const adminMenuItems = [
    { href: '/admin/users', icon: AdminIcon, label: 'Quản lý người dùng' },
    { href: '/admin/songs', icon: Music, label: 'Quản lý bài hát' },
    { href: '/admin/singers', icon: Mic2, label: 'Quản lý ca sĩ' },
    { href: '/admin/submissions', icon: CheckSquare, label: 'Duyệt bài hát' }
  ];

  const MenuLink = ({ to, icon: Icon, label, onClick }) => (
      <Link to={to} onClick={onClick} className="flex items-center w-full px-3 py-2 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
        <Icon className="w-4 h-4 mr-3" />
        <span>{label}</span>
      </Link>
  );

  return (
      <header className={`sticky top-0 z-40 w-full backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-700/80`}>
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Left Side: Logo & Main Nav */}
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
            </Link>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 ml-2"></div>
            <nav className="hidden md:flex items-center gap-1 pl-2">
              {mainNavItems.map(item => {
                const isActive = item.href && location.pathname.startsWith(item.href);
                const commonContent = (
                    <>
                      <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-black/10 dark:bg-white/10 text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 group-hover:bg-black/5 dark:group-hover:bg-white/5 group-hover:text-slate-800 dark:group-hover:text-white'}`}>
                        <item.icon size={22} />
                      </div>
                      <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out text-slate-800 dark:text-white max-w-0 ml-0 opacity-0 group-hover:max-w-xs group-hover:ml-2 group-hover:opacity-100`}>
                        {item.label}
                      </span>
                    </>
                );
                return item.href ? (
                    <Link key={item.label} to={item.href} className="group flex items-center p-2 rounded-lg text-sm font-semibold">
                      {commonContent}
                    </Link>
                ) : (
                    <button key={item.label} onClick={item.action} className="group flex items-center p-2 rounded-lg text-sm font-semibold">
                      {commonContent}
                    </button>
                );
              })}
            </nav>
          </div>

          {/* Right Side: Player & User Actions */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 transition-all duration-300 ease-in-out ${!isPlayerVisible && currentSong ? 'max-w-md opacity-100' : 'max-w-0 opacity-0'} overflow-hidden`}>
              {currentSong && (
                  <>
                    <Button variant="ghost" size="icon" className={`!w-9 !h-9 ${isShuffle ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`} onClick={toggleShuffle}><Shuffle size={18} /></Button>
                    <Button variant="ghost" size="icon" className="!w-9 !h-9" onClick={playPrevious}><SkipBack size={18} /></Button>
                    <Button size="icon" className="!w-10 !h-10 bg-cyan-500 text-white" onClick={togglePlay}>{isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}</Button>
                    <Button variant="ghost" size="icon" className="!w-9 !h-9" onClick={playNext}><SkipForward size={18} /></Button>
                    <Button variant="ghost" size="icon" className={`!w-9 !h-9 ${isRepeat ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`} onClick={toggleRepeat}>{isRepeat ? <Repeat1 size={18} /> : <Repeat size={18} />}</Button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                    <img src={`${API_BASE_URL}${currentSong.thumbnailPath}`} alt={currentSong.title} className="w-10 h-10 rounded-md hidden md:block" />
                    <div className="hidden lg:block min-w-0">
                      <p className="font-semibold truncate">{currentSong.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{currentSong.singers.map(s => s.name).join(', ')}</p>
                    </div>
                  </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                  <>
                    {!isPremium() && (
                        <Link to="/premium">
                          <button className="hidden lg:inline-flex relative group items-center justify-center h-10 px-4 font-medium text-sm text-white rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 flex-shrink-0 whitespace-nowrap min-w-max">
                            <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <span className="relative flex items-center gap-2">Nâng cấp tài khoản</span>
                          </button>
                        </Link>
                    )}

                    <button onClick={toggleDarkMode} className="p-2 rounded-full text-slate-500 hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/10 transition-colors">
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <div className="relative" ref={avatarMenuRef}>
                      <button onClick={() => setIsAvatarMenuOpen(prev => !prev)} className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center cursor-pointer">
                          {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" /> : <User size={18} />}
                        </div>
                        <ChevronDown size={16} className={`transition-transform ${isAvatarMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isAvatarMenuOpen && (
                          <div className="absolute top-full right-0 mt-2 w-72 p-2 rounded-xl shadow-lg border backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50">
                            <div className="flex items-center gap-3 p-2 mb-2">
                              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0">
                                {user.photoURL && <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold truncate text-slate-800 dark:text-slate-100">{user.displayName}</p>
                                <p className="text-sm truncate text-slate-500 dark:text-slate-400">{user.email}</p>
                              </div>
                            </div>

                            <hr className="my-1 border-slate-200 dark:border-slate-700" />

                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 py-2">Tài khoản</div>
                            {userMenuItems.map(item => <MenuLink key={item.label} to={item.href} icon={item.icon} label={item.label} onClick={() => setIsAvatarMenuOpen(false)} />)}

                            {isCreator() && (
                                <>
                                  <hr className="my-1 border-slate-200 dark:border-slate-700" />
                                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 py-2">Công cụ Creator</div>
                                  {creatorMenuItems.map(item => <MenuLink key={item.label} to={item.href} icon={item.icon} label={item.label} onClick={() => setIsAvatarMenuOpen(false)} />)}
                                </>
                            )}

                            {isAdmin() && (
                                <>
                                  <hr className="my-1 border-slate-200 dark:border-slate-700" />
                                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 py-2">Quản trị viên</div>
                                  {adminMenuItems.map(item => <MenuLink key={item.label} to={item.href} icon={item.icon} label={item.label} onClick={() => setIsAvatarMenuOpen(false)} />)}
                                </>
                            )}

                            <hr className="my-1 border-slate-200 dark:border-slate-700" />

                            <button onClick={() => { setIsAvatarMenuOpen(false); onConfirmLogout(); }} className="flex items-center w-full px-3 py-2 text-sm rounded-md text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20">
                              <LogOut className="w-4 h-4 mr-3" />
                              <span>Đăng xuất</span>
                            </button>
                          </div>
                      )}
                    </div>
                  </>
              ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/register">
                      <Button variant="outline" size="md">Đăng ký</Button>
                    </Link>
                    <Link to="/login">
                      <Button size="md">Đăng nhập</Button>
                    </Link>
                  </div>
              )}
            </div>
          </div>
        </div>
      </header>
  );
};

const DashboardLayout = () => {
  const { currentTheme } = useDarkMode();
  const { user, logout, isAdmin, isCreator, isPremium } = useAuth();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isPlayerCollapsed, setIsPlayerCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
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

  const handleTogglePlayer = () => {
    setIsPlayerCollapsed(prevState => !prevState);
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  const cmdMainNavItems = [
    { name: 'Trang chủ', href: '/dashboard', icon: Home, category: 'Menu' },
    { name: 'Tìm kiếm', href: '/search', icon: Search, category: 'Menu' },
    { name: 'Thư viện', href: '/my-playlists', icon: Library, category: 'Menu' },
  ];
  const cmdCreatorNavItems = [
    { name: 'Tải lên bài hát', href: '/creator/submission/new', icon: Upload, category: 'Creator' },
    { name: 'Yêu cầu của tôi', href: '/creator/my-submissions', icon: SongIcon, category: 'Creator' },
    { name: 'Bảng điều khiển Creator', href: '/creator', icon: Settings, category: 'Creator' }
  ];
  const cmdAdminNavItems = [
    { name: 'Quản lý người dùng', href: '/admin/users', icon: AdminIcon, category: 'Admin' },
    { name: 'Quản lý ca sĩ', href: '/admin/singers', icon: Mic2, category: 'Admin' },
    { name: 'Quản lý bài hát', href: '/admin/songs', icon: SongIcon, category: 'Admin' },
    { name: 'Duyệt bài hát', href: '/admin/submissions', icon: CheckSquare, category: 'Admin' }
  ];
  const cmdUserNavItems = [
    { name: 'Thông tin cá nhân', href: '/profile', icon: User, category: 'Tài khoản' },
    { name: 'Đăng xuất', href: '#', icon: LogOut, category: 'Tài khoản', action: () => setIsLogoutModalOpen(true) }
  ];
  const cmdPremiumNavItem = { name: 'Nâng cấp Premium', href: '/premium', icon: Crown, category: 'Tài khoản' };

  const navigationCommands = [
    ...cmdMainNavItems,
    ...(user && isCreator() ? cmdCreatorNavItems : []),
    ...(user && isAdmin() ? cmdAdminNavItems : []),
    ...(user ? cmdUserNavItems : []),
    ...(user && !isPremium() ? [cmdPremiumNavItem] : [])
  ];

  return (
      <div className={`flex flex-col h-screen ${currentTheme.bg} ${currentTheme.text} font-sans`}>
        <AppHeader
            onOpenPalette={() => setIsPaletteOpen(true)}
            isPlayerVisible={!isPlayerCollapsed}
            onConfirmLogout={() => setIsLogoutModalOpen(true)}
        />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:px-8 transition-all duration-300 ease-in-out">
            <Outlet />
          </main>
          <PlayerSidebar isCollapsed={isPlayerCollapsed} onToggle={handleTogglePlayer} />
        </div>
        <CommandPalette
            isOpen={isPaletteOpen}
            onClose={() => setIsPaletteOpen(false)}
            navigationCommands={navigationCommands}
        />
        <ConfirmationModal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
            onConfirm={handleLogout}
            title="Xác nhận Đăng xuất"
            message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?"
            confirmText="Đăng xuất"
            cancelText="Hủy"
            variant="danger"
        />
      </div>
  );
};

export default DashboardLayout;