// src/modules/premium/pages/PremiumUpgrade.jsx

import React, { useState, useEffect } from "react";
import { premiumService } from "../services/premiumService";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import { Crown, CheckCircle } from "lucide-react";

const PackageCard = ({ title, price, period, features, packageId }) => {
  const [loadingMomo, setLoadingMomo] = useState(false);
  const [loadingVnpay, setLoadingVnpay] = useState(false);

  // Logic xử lý thanh toán MoMo
  const handleMomoPayment = async () => {
    setLoadingMomo(true);
    try {
      const response = await premiumService.createMomoPayment(packageId);
      if (response.success && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error(response.message || "Không thể tạo yêu cầu MoMo.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Lỗi khi tạo thanh toán MoMo."
      );
    } finally {
      setLoadingMomo(false);
    }
  };

  // Logic xử lý thanh toán VNPay
  const handleVnpayPayment = async () => {
    setLoadingVnpay(true);
    try {
      const response = await premiumService.createVnpayPayment(packageId);
      if (response.success && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error(response.message || "Không thể tạo yêu cầu VNPay.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Lỗi khi tạo thanh toán VNPay."
      );
    } finally {
      setLoadingVnpay(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col shadow-lg">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white">
        {title}
      </h3>
      <div className="my-4">
        <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
          {price}
        </span>
        <span className="text-slate-500 dark:text-slate-400"> / {period}</span>
      </div>
      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <div className="space-y-3">
        <Button
          size="lg"
          onClick={handleMomoPayment}
          disabled={loadingMomo || loadingVnpay}
        >
          {loadingMomo ? "Đang xử lý..." : "Thanh toán với MoMo"}
        </Button>
        <Button
          size="lg"
          onClick={handleVnpayPayment}
          disabled={loadingMomo || loadingVnpay}
          variant="outline"
        >
          {loadingVnpay ? "Đang xử lý..." : "Thanh toán với VNPay"}
        </Button>
      </div>
    </div>
  );
};

export const PremiumUpgrade = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await premiumService.getAvailablePackages();
        if (response.success && response.data) {
          const packagesArray = Object.keys(response.data).map((key) => ({
            packageId: key,
            title: response.data[key].name,
            price: response.data[key].price.toLocaleString("vi-VN") + "đ",
            period: key.includes("monthly") ? "tháng" : "năm",
            features: response.data[key].features,
          }));
          setPackages(packagesArray);
        } else {
          toast.error("Không thể tải danh sách các gói Premium.");
        }
      } catch (error) {
        toast.error("Lỗi khi tải các gói nâng cấp.");
        console.error("Error fetching packages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 dark:text-slate-400">
        Đang tải các gói nâng cấp...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <Crown className="mx-auto w-12 h-12 text-yellow-400 mb-2" />
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Nâng cấp lên Premium
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
          Mở khóa toàn bộ tiềm năng nghe nhạc của bạn với các tính năng độc
          quyền.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {packages.map((pkg) => (
          <PackageCard key={pkg.packageId} {...pkg} />
        ))}
      </div>
    </div>
  );
};

export default PremiumUpgrade;
