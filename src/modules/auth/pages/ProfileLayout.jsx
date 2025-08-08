// src/modules/auth/pages/ProfileLayout.jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { User, Lock } from 'lucide-react';

const ProfileLayout = () => {
    const { currentTheme } = useDarkMode();

    // Hàm để tạo className động cho NavLink, làm nổi bật tab đang được chọn
    const getNavLinkClass = ({ isActive }) => {
        const baseClasses = `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200`;
        if (isActive) {
            return `${baseClasses} bg-music-500 text-white`;
        }
        return `${baseClasses} ${currentTheme.text} hover:${currentTheme.bgHover} dark:hover:bg-gray-700`;
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            {/* Sidebar cho các trang Profile */}
            <aside className="md:w-64 flex-shrink-0">
                <div className={`p-4 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard}`}>
                    <nav className="space-y-1">
                        {/* <<< SỬA LỖI ĐƯỜNG DẪN TẠI ĐÂY >>> */}
                        <NavLink to="/profile" end className={getNavLinkClass}>
                            <User className="w-4 h-4 mr-3" />
                            <span>Thông tin cá nhân</span>
                        </NavLink>
                        {/* <<< SỬA LỖI ĐƯỜNG DẪN TẠI ĐÂY >>> */}
                        <NavLink to="/profile/password" className={getNavLinkClass}>
                            <Lock className="w-4 h-4 mr-3" />
                            <span>Đổi mật khẩu</span>
                        </NavLink>
                    </nav>
                </div>
            </aside>

            <main className="flex-1">
                <div className={`${currentTheme.bgCard} rounded-xl p-6 lg:p-8 border ${currentTheme.border}`}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ProfileLayout;