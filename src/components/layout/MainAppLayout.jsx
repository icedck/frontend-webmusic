import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import PlayerSidebar from './PlayerSidebar';
import DashboardLayout from './DashboardLayout';

const MainAppLayout = () => {
    const { currentTheme } = useDarkMode();

    return (
        <div className={`flex h-screen overflow-hidden ${currentTheme.bg} ${currentTheme.text}`}>
            <DashboardLayout.Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
            <PlayerSidebar />
        </div>
    );
};

export default MainAppLayout;