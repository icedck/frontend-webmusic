import React, { useState, useEffect } from "react";
import { premiumService } from "../services/premiumService";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import { Crown, CheckCircle } from "lucide-react";

const PackageCard = ({ title, price, period, features, packageId, paymentMethod }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await premiumService.createPayment(packageId, paymentMethod);
      if (response.success && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error(response.message || `Không thể tạo yêu cầu ${paymentMethod}.`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || `Lỗi khi tạo thanh toán ${paymentMethod}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethodName = paymentMethod === 'MOMO' ? 'MoMo' : 'VNPay';

  return (
      <button 
        onClick={handlePayment} 
        disabled={isLoading}
        className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 ${
          paymentMethod === 'MOMO' 
            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg' 
            : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? "Đang xử lý..." : `Thanh toán với ${paymentMethodName}`}
      </button>
  );
};

const PlanCard = ({ plan }) => {
  // Tính giá gốc dựa trên giá hiện tại (giả sử giá hiện tại đã là giá sau giảm)
  const originalPrice = plan.period === 'tháng' ? 79000 : 899000;
  const currentPrice = plan.period === 'tháng' ? 49000 : 499000;
  const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  return (
      <div className="bg-white dark:bg-slate-800/50 border-2 border-cyan-200 dark:border-cyan-800/50 rounded-2xl p-6 flex flex-col shadow-lg relative overflow-hidden">
        {/* Banner giảm giá Quốc khánh */}
        <div className="absolute top-0 right-0 bg-gradient-to-r from-red-600 to-yellow-500 text-white px-4 py-1 rounded-bl-lg font-bold text-sm">
          - {discountPercent}%
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-4">{plan.name}</h3>
        <div className="my-4">
          {/* Giá gốc bị gạch */}
          <div className="text-lg text-slate-400 line-through mb-1">
            {originalPrice.toLocaleString("vi-VN")}đ
          </div>
          {/* Giá sau giảm */}
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">
              {currentPrice.toLocaleString("vi-VN")}đ
            </span>
            <span className="text-slate-500 dark:text-slate-400 ml-2"> / {plan.period}</span>
          </div>
          {/* Thông báo tiết kiệm */}
          <div className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mt-1">
            Tiết kiệm {(originalPrice - currentPrice).toLocaleString("vi-VN")}đ!
          </div>
        </div>
        <ul className="space-y-3 mb-6 flex-grow">
          {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-300">{feature}</span>
              </li>
          ))}
        </ul>
        <div className="space-y-3">
          <PackageCard packageId={plan.id} paymentMethod="MOMO" />
          <PackageCard packageId={plan.id} paymentMethod="VNPAY" />
        </div>
        
        {/* Countdown timer giả lập */}
        <div className="mt-4 text-center">
          <div className="text-xs text-red-600 dark:text-red-400 font-medium">
            ⏰ Ưu đãi Quốc khánh kết thúc sau: 7 ngày
          </div>
        </div>
      </div>
  );
};

export const PremiumUpgrade = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await premiumService.getSubscriptionPlans();
        if (response.success && Array.isArray(response.data)) {
          setPlans(response.data);
        } else {
          toast.error("Không thể tải danh sách các gói Premium.");
        }
      } catch (error) {
        toast.error("Lỗi khi tải các gói nâng cấp.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Đang tải các gói nâng cấp...</div>;
  }

  return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-10">
          <Crown className="mx-auto w-12 h-12 text-cyan-400 mb-2" />
          <h1 className="text-4xl font-extrabold tracking-tight text-cyan-600 dark:text-cyan-400">
            Nâng cấp lên Premium
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
            Mở khóa toàn bộ tiềm năng nghe nhạc của bạn với các tính năng độc quyền.
          </p>
          {/* Banner khuyến mãi Quốc khánh */}
          <div className="mt-4 inline-block bg-gradient-to-r from-red-600 to-yellow-500 text-white px-6 py-2 rounded-full font-bold text-sm animate-pulse">
            🎉 Khuyến mãi đặc biệt nhân dịp Quốc khánh 2/9 🇻🇳
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
  );
};

export default PremiumUpgrade;