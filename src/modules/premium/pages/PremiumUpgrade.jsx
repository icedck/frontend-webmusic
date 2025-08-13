import React, { useState } from 'react';
import { premiumService } from '../services/premiumService';
import { toast } from 'react-toastify';
import Button from '../../../components/common/Button';
import { Crown, Zap, CheckCircle } from 'lucide-react';

const PackageCard = ({ title, price, period, features, packageId, onPay }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await premiumService.createMomoPayment(packageId);
            if (response.success && response.data.paymentUrl) {
                // Chuyển hướng người dùng đến trang thanh toán của MoMo
                window.location.href = response.data.paymentUrl;
            } else {
                toast.error(response.message || "Không thể tạo yêu cầu thanh toán.");
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
            <div className="my-4">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{price}</span>
                <span className="text-slate-500 dark:text-slate-400"> / {period}</span>
            </div>
            <ul className="space-y-3 mb-6 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                    </li>
                ))}
            </ul>
            <Button size="lg" onClick={handlePayment} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Thanh toán với MoMo'}
            </Button>
        </div>
    );
};

export const PremiumUpgrade = () => {
    const packages = [
        {
            packageId: "monthly_premium",
            title: "Gói Tháng",
            price: "49.000đ",
            period: "tháng",
            features: [
                "Nghe nhạc không quảng cáo",
                "Chất lượng âm thanh cao nhất",
                "Tải nhạc không giới hạn (sắp ra mắt)",
                "Tạo và chia sẻ playlist",
            ]
        },
        {
            packageId: "yearly_premium",
            title: "Gói Năm",
            price: "499.000đ",
            period: "năm",
            features: [
                "Tất cả quyền lợi của Gói Tháng",
                "Tiết kiệm hơn 2 tháng so với gói tháng",
                "Ưu tiên hỗ trợ khách hàng",
                "Nhận các tính năng mới sớm nhất",
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="text-center mb-10">
                <Crown className="mx-auto w-12 h-12 text-yellow-400 mb-2" />
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Nâng cấp lên Premium
                </h1>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
                    Mở khóa toàn bộ tiềm năng nghe nhạc của bạn với các tính năng độc quyền.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {packages.map(pkg => <PackageCard key={pkg.packageId} {...pkg} />)}
            </div>
        </div>
    );
};

export default PremiumUpgrade;