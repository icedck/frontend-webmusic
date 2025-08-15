import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Button from "../../../components/common/Button";

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const { revalidateUser } = useAuth();
    const [paymentStatus, setPaymentStatus] = useState("pending");

    useEffect(() => {
        const vnpayResponseCode = searchParams.get("vnp_ResponseCode");
        const momoResultCode = searchParams.get("resultCode");

        if (vnpayResponseCode === "00" || momoResultCode === "0") {
            setPaymentStatus("success");
            revalidateUser();
        } else if (vnpayResponseCode || momoResultCode) {
            setPaymentStatus("failed");
        } else {
            setPaymentStatus("unknown");
        }
    }, [searchParams, revalidateUser]);

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
                            Tài khoản của bạn đã được nâng cấp. Cảm ơn bạn đã sử
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
                return (
                    <>
                        <Loader2 className="w-16 h-16 animate-spin text-cyan-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold">Đang xử lý</h1>
                        <p className="text-slate-500 mt-2">
                            Vui lòng chờ trong giây lát...
                        </p>
                    </>
                );
        }
    };

    return (
        <div className="max-w-md mx-auto text-center py-10 px-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
                {renderContent()}
                <div className="mt-8 flex justify-center gap-4">
                    <Link to="/"><Button variant="outline">Quay về trang chủ</Button></Link>
                    <Link to="/profile/transactions"><Button>Xem lịch sử giao dịch</Button></Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;