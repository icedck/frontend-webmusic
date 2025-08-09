import React from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import { Check, Star, Zap, Download, Headphones, X } from 'lucide-react';

// --- COMPONENT THẺ GIÁ ĐÃ ĐƯỢC THIẾT KẾ LẠI HOÀN TOÀN ---
const PricingCard = ({ plan, price, description, features, isFeatured = false }) => {
    const { isDarkMode } = useDarkMode();

    // Logic màu sắc thông minh cho cả 2 chế độ
    const cardStyles = isFeatured
        ? (isDarkMode ? 'bg-amber-950/30 border-amber-400/50' : 'bg-amber-50 border-amber-200 text-amber-900')
        : (isDarkMode ? 'bg-indigo-950/30 border-slate-700/50' : 'bg-indigo-50 border-indigo-200 text-indigo-900');

    const buttonStyles = isFeatured
        ? (isDarkMode ? '!bg-amber-500 !text-amber-950 hover:!bg-amber-600' : '!bg-amber-400 !text-amber-950 hover:!bg-amber-500')
        : (isDarkMode ? '!bg-indigo-500 hover:!bg-indigo-600' : '!bg-indigo-500 hover:!bg-indigo-600 text-white');

    const checkmarkStyles = isFeatured
        ? (isDarkMode ? 'text-amber-400' : 'text-amber-500')
        : (isDarkMode ? 'text-indigo-400' : 'text-indigo-500');

    const priceSubtextStyles = isDarkMode ? 'text-slate-400' : 'text-slate-500';

    return (
        <div className={`flex flex-col p-8 rounded-2xl border backdrop-blur-sm ${cardStyles}`}>
            <div className="flex-grow">
                <h3 className="text-2xl font-semibold">{plan}</h3>
                <p className={`mt-2 h-10 ${isDarkMode ? 'text-slate-400' : ''}`}>{description}</p>
                <div className="mt-6">
                    <span className="text-5xl font-bold">{price}</span>
                    <span className={priceSubtextStyles}>/tháng</span>
                </div>
                <Button size="lg" className={`w-full mt-8 ${buttonStyles}`}>
                    Đăng ký gói
                </Button>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-700/50 dark:border-slate-700/50">
                <h4 className="font-semibold mb-4">Đặc quyền đặc biệt:</h4>
                <ul className="space-y-4 text-sm text-left">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <Check className={`w-5 h-5 flex-shrink-0 ${checkmarkStyles}`} />
                            <span className={isDarkMode ? 'text-slate-300' : ''}>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const FeatureShowcaseCard = ({ icon, title, description }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 text-center flex flex-col items-center">
        <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            {icon}
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
    </div>
);


const PremiumUpgrade = () => {
    const { currentTheme } = useDarkMode();

    const plusFeatures = [ "Nghe nhạc không quảng cáo", "Nghe và tải nhạc Lossless", "Lưu trữ nhạc không giới hạn", "Tính năng nghe nhạc nâng cao", "Mở rộng khả năng Upload" ];
    const premiumFeatures = [ "Kho nhạc Premium", "Nghe nhạc không quảng cáo", "Nghe và tải nhạc Lossless", "Lưu trữ nhạc không giới hạn", "Tính năng nghe nhạc nâng cao", "Mở rộng khả năng Upload" ];

    return (
        <div className="max-w-5xl mx-auto space-y-20 py-12">
            <section className="text-center px-4">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    Âm nhạc không giới hạn
                </h1>
                <p className={`mt-4 text-xl max-w-2xl mx-auto ${currentTheme.textSecondary}`}>
                    Nâng cấp tài khoản để trải nghiệm các tính năng và nội dung cao cấp, độc quyền từ WebMusic.
                </p>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
                <PricingCard
                    plan="WebMusic PLUS"
                    price="13.000đ"
                    description="Nghe nhạc với chất lượng cao nhất, không quảng cáo."
                    features={plusFeatures}
                />
                <PricingCard
                    plan="WebMusic PREMIUM"
                    price="41.000đ"
                    description="Toàn bộ đặc quyền Plus cùng kho nhạc Premium độc quyền."
                    features={premiumFeatures}
                    isFeatured={true}
                />
            </section>
        </div>
    );
};

export default PremiumUpgrade;