// src/components/layout/MainAppLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import PlayerSidebar from './PlayerSidebar';
// Chúng ta sẽ cần một NavigationSidebar nữa, sẽ được tách ra từ DashboardLayout
import DashboardLayout from './DashboardLayout'; // Tạm thời dùng lại

const MainAppLayout = () => {
    const { currentTheme } = useDarkMode();

    return (
        <div className={`flex h-screen overflow-hidden ${currentTheme.bg} ${currentTheme.text}`}>
            {/* Đây sẽ là NavigationSidebar sau này */}
            <DashboardLayout.Sidebar />

            {/* Cột giữa - Nội dung chính */}
            <main className="flex-1 overflow-y-auto">
                {/* Header (nếu cần) có thể đặt ở đây */}
                <div className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>

            {/* Cột phải - Trình phát cố định */}
            <PlayerSidebar />
        </div>
    );
};

export default MainAppLayout;