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
      <Button size="lg" onClick={handlePayment} disabled={isLoading} variant={paymentMethod === 'MOMO' ? 'solid' : 'outline'}>
        {isLoading ? "Đang xử lý..." : `Thanh toán với ${paymentMethodName}`}
      </Button>
  );
};

const PlanCard = ({ plan }) => {
  return (
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col shadow-lg">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{plan.name}</h3>
        <div className="my-4">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                    {plan.price.toLocaleString("vi-VN")}đ
                </span>
          <span className="text-slate-500 dark:text-slate-400"> / {plan.period}</span>
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
          <Crown className="mx-auto w-12 h-12 text-yellow-400 mb-2" />
          <h1 className="text-4xl font-extrabold tracking-tight">Nâng cấp lên Premium</h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
            Mở khóa toàn bộ tiềm năng nghe nhạc của bạn với các tính năng độc quyền.
          </p>
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