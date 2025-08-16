import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import { toast } from 'react-toastify';
import RejectReasonModal from '../components/RejectReasonModal';
import SubmissionDetailModal from '../components/SubmissionDetailModal';
import { CheckCircle, XCircle, Eye, MoreVertical } from 'lucide-react';

const SubmissionManagement = () => {
    const { currentTheme } = useDarkMode();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {
                page: 0,
                size: 20,
                status: 'PENDING'
            };
            const response = await adminService.getSubmissions(params);

            if (response && Array.isArray(response.content)) {
                setSubmissions(response.content);
            } else {
                setSubmissions([]);
            }
        } catch (err) {
            console.error("Failed to fetch submissions:", err);
            setError(err.response?.data?.message || "Không thể tải danh sách chờ duyệt.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            await adminService.approveSubmission(id);
            toast.success("Đã duyệt yêu cầu thành công!");
            setSubmissions(prev => prev.filter(sub => sub.id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi duyệt yêu cầu.");
        } finally {
            setActionLoading(null);
        }
    };

    const openRejectModal = (submission) => {
        setSelectedSubmission(submission);
        setIsRejectModalOpen(true);
    };

    const openDetailModal = (submission) => {
        setSelectedSubmission(submission);
        setIsDetailModalOpen(true);
    };

    const handleReject = async (reason) => {
        if (!selectedSubmission) return;
        setActionLoading(selectedSubmission.id);
        try {
            await adminService.rejectSubmission(selectedSubmission.id, reason);
            toast.success("Đã từ chối yêu cầu thành công!");
            setSubmissions(prev => prev.filter(sub => sub.id !== selectedSubmission.id));
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi từ chối yêu cầu.");
        } finally {
            setActionLoading(null);
            setIsRejectModalOpen(false);
            setSelectedSubmission(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Duyệt bài hát</h1>
            <p className={`${currentTheme.textSecondary}`}>Xem xét và phê duyệt các yêu cầu đăng bài hát từ Creator.</p>

            <div className={`overflow-x-auto ${currentTheme.bgCard} rounded-xl border ${currentTheme.border}`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-slate-800/50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Bài hát</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Creator</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Ngày gửi</th>
                        <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading && (<tr><td colSpan="4" className="text-center py-4">Đang tải...</td></tr>)}
                    {error && (<tr><td colSpan="4" className="text-center py-4 text-red-500">{error}</td></tr>)}
                    {!loading && !error && submissions.length === 0 && (<tr><td colSpan="4" className="text-center py-10">Không có yêu cầu nào đang chờ duyệt.</td></tr>)}

                    {!loading && !error && submissions.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="px-6 py-4 font-medium">{sub.title}</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{sub.creatorName}</td>
                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(sub.submissionDate).toLocaleDateString('vi-VN')}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end items-center space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openDetailModal(sub)}
                                        data-tooltip-id="global-tooltip"
                                        data-tooltip-content="Xem chi tiết"
                                    >
                                        <Eye className="w-5 h-5 text-slate-500" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleApprove(sub.id)}
                                        disabled={actionLoading === sub.id}
                                        data-tooltip-id="global-tooltip"
                                        data-tooltip-content="Duyệt"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openRejectModal(sub)}
                                        disabled={actionLoading === sub.id}
                                        data-tooltip-id="global-tooltip"
                                        data-tooltip-content="Từ chối"
                                    >
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <RejectReasonModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleReject}
                isLoading={!!actionLoading}
            />

            <SubmissionDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                submissionId={selectedSubmission?.id}
            />
        </div>
    );
};

export default SubmissionManagement;