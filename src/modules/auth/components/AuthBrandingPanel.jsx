// src/modules/auth/components/AuthBrandingPanel.jsx

import React from 'react';
import { Music } from 'lucide-react';

const AuthBrandingPanel = () => {
    return (
        // Cột bên trái, chỉ hiển thị trên màn hình lớn
        <div className="hidden lg:flex flex-col items-center justify-center relative bg-slate-900">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop')" }}
            />

            {/* Nội dung */}
            <div className="relative z-10 text-center text-white p-8">
                <div className="mb-6 inline-block p-4 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm">
                    <Music className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">
                    Mở Khóa Thế Giới Âm Nhạc
                </h1>
                <p className="mt-4 text-lg text-slate-300 max-w-md mx-auto">
                    Tham gia cùng hàng triệu người yêu nhạc, khám phá playlist độc quyền và tận hưởng không gian âm nhạc không giới hạn.
                </p>
            </div>
        </div>
    );
};

export default AuthBrandingPanel;