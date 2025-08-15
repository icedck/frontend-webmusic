import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import Button from "../../../components/common/Button";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, success, failed

  useEffect(() => {
    const vnpayResponseCode = searchParams.get("vnp_ResponseCode");
    const momoResultCode = searchParams.get("resultCode");

    if (vnpayResponseCode === "00" || momoResultCode === "0") {
      setPaymentStatus("success");
    } else if (vnpayResponseCode || momoResultCode) {
      setPaymentStatus("failed");
    } else {
      setPaymentStatus("unknown");
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (paymentStatus) {
      case "success":
        return (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Thanh toán thành công!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Tài khoản của bạn đã được nâng cấp lên Premium. Cảm ơn bạn đã sử
              dụng dịch vụ.
            </p>
          </>
        );
      case "failed":
        return (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Thanh toán thất bại
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Giao dịch không thể hoàn tất. Vui lòng thử lại hoặc chọn phương
              thức thanh toán khác.
            </p>
          </>
        );
      default:
        return <p>Đang xử lý kết quả giao dịch...</p>;
    }
  };

  return (
    <div className="max-w-md mx-auto text-center py-10 px-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        {renderContent()}
        <Link to="/" className="mt-6 inline-block">
          <Button>Quay về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentResult;
