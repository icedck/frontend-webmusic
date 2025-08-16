import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-900 text-center px-4">
            <AlertTriangle className="w-24 h-24 text-yellow-400 mb-6" />
            <h1 className="text-6xl font-extrabold text-slate-800 dark:text-white">
                404
            </h1>
            <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300 mt-2">
                Trang không tồn tại
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-md">
                Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có thể
                nó đã bị xóa hoặc bạn đã gõ sai địa chỉ.
            </p>
            <Link to="/" className="mt-8">
                <Button size="lg">Quay về Trang chủ</Button>
            </Link>
        </div>
    );
};

export default NotFoundPage;