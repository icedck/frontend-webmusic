import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import { toast } from 'react-toastify';
import RejectReasonModal from '../components/RejectReasonModal';
import { CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubmissionManagement = () => {
    const { currentTheme } = useDarkMode();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminService.getPendingSubmissions();
            if (Array.isArray(response)) {
                setSubmissions(response);
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
        setActionLoading(true);
        try {
            await adminService.approveSubmission(id);
            toast.success("Đã duyệt yêu cầu thành công!");
            setSubmissions(prev => prev.filter(sub => sub.id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi duyệt yêu cầu.");
        } finally {
            setActionLoading(false);
        }
    };

    const openRejectModal = (submission) => {
        setSelectedSubmission(submission);
        setIsRejectModalOpen(true);
    };

    const handleReject = async (reason) => {
        if (!selectedSubmission) return;
        setActionLoading(true);
        try {
            await adminService.rejectSubmission(selectedSubmission.id, reason);
            toast.success("Đã từ chối yêu cầu thành công!");
            setSubmissions(prev => prev.filter(sub => sub.id !== selectedSubmission.id));
            setIsRejectModalOpen(false);
            setSelectedSubmission(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi từ chối yêu cầu.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Duyệt bài hát</h1>
            <p className={`${currentTheme.textSecondary}`}>Xem xét và phê duyệt các yêu cầu đăng bài hát từ Creator.</p>

            <div className={`overflow-x-auto ${currentTheme.bgCard} rounded-xl border ${currentTheme.border}`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Bài hát</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Creator</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày gửi</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading && (<tr><td colSpan="4" className="text-center py-4">Đang tải...</td></tr>)}
                    {error && (<tr><td colSpan="4" className="text-center py-4 text-red-500">{error}</td></tr>)}
                    {!loading && !error && submissions.length === 0 && (<tr><td colSpan="4" className="text-center py-10">Không có yêu cầu nào đang chờ duyệt.</td></tr>)}

                    {!loading && !error && submissions.map(sub => (
                        <tr key={sub.id}>
                            <td className="px-6 py-4 font-medium">
                                <Link to={`/song/${sub.approvedSongId || sub.id}`} target="_blank" className="hover:underline">{sub.title}</Link>
                            </td>
                            <td className="px-6 py-4">{sub.creatorName}</td>
                            <td className="px-6 py-4 text-sm">{new Date(sub.submissionDate).toLocaleDateString('vi-VN')}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                    <Button size="sm" variant="success" onClick={() => handleApprove(sub.id)} disabled={actionLoading}>
                                        <CheckCircle className="w-4 h-4 mr-1"/> Duyệt
                                    </Button>
                                    <Button size="sm" variant="danger" onClick={() => openRejectModal(sub)} disabled={actionLoading}>
                                        <XCircle className="w-4 h-4 mr-1"/> Từ chối
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
                isLoading={actionLoading}
            />
        </div>
    );
};

export default SubmissionManagement;