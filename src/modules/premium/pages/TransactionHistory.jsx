import React, { useState, useEffect, useCallback } from 'react';
import { premiumService } from '../services/premiumService';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import Button from '../../../components/common/Button';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async (page = 0) => {
        setLoading(true);
        try {
            const response = await premiumService.getTransactionHistory(page);
            // --- BẮT ĐẦU SỬA ĐỔI ---
            // Sửa lỗi: response đã là đối tượng dữ liệu, không cần .data
            if (response && response.content) {
                setTransactions(response.content || []);
                setPageInfo({
                    currentPage: response.pageInfo.page,
                    totalPages: response.pageInfo.totalPages,
                    totalElements: response.pageInfo.totalElements,
                });
            } else {
                // Xử lý trường hợp response không có content
                setTransactions([]);
            }
            // --- KẾT THÚC SỬA ĐỔI ---
        } catch (error) {
            toast.error("Không thể tải lịch sử giao dịch.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory(0);
    }, [fetchHistory]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageInfo.totalPages) {
            fetchHistory(newPage);
        }
    };

    const getStatusChip = (status) => {
        switch(status) {
            case 'SUCCESS': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Thành công</span>;
            case 'FAILED': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Thất bại</span>;
            case 'PENDING': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Đang chờ</span>;
            default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">{status}</span>;
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Lịch sử giao dịch</h1>
            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gói</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Số tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày GD</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày hết hạn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center p-4"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></td></tr>
                        ) : transactions.length > 0 ? (
                            transactions.map(tx => (
                                <tr key={tx.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{tx.packageName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{tx.amount.toLocaleString('vi-VN')}đ</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{format(new Date(tx.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{tx.premiumEndDate ? format(new Date(tx.premiumEndDate), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getStatusChip(tx.status)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center p-4 text-slate-500">Chưa có giao dịch nào.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
                {pageInfo.totalPages > 1 && (
                    <div className="p-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-500">
                    Trang {pageInfo.currentPage + 1} / {pageInfo.totalPages}
                </span>
                        <div className="flex gap-2">
                            <Button onClick={() => handlePageChange(pageInfo.currentPage - 1)} disabled={pageInfo.currentPage === 0}>Trước</Button>
                            <Button onClick={() => handlePageChange(pageInfo.currentPage + 1)} disabled={pageInfo.currentPage >= pageInfo.totalPages - 1}>Sau</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;