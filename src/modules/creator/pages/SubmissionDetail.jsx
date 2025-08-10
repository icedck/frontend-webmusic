import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { submissionService } from '../services/submissionService';
import Button from '../../../components/common/Button';
import { toast } from 'react-toastify';
import { ArrowLeft, Music, User, Tag, AlertTriangle } from 'lucide-react';

const DetailItem = ({ label, value }) => {
    const { currentTheme } = useDarkMode();
    if (!value) return null;
    return (
        <div>
            <dt className={`text-sm font-medium ${currentTheme.textSecondary}`}>{label}</dt>
            <dd className={`mt-1 text-sm ${currentTheme.text}`}>{value}</dd>
        </div>
    );
};

const DetailList = ({ label, items }) => {
    const { currentTheme } = useDarkMode();
    if (!items || items.length === 0) return null;
    return (
        <div>
            <dt className={`text-sm font-medium ${currentTheme.textSecondary}`}>{label}</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
                {items.map(item => (
                    <span key={item.id} className={`px-2 py-1 text-xs rounded-full ${currentTheme.bgCard}`}>
                        {item.name}
                    </span>
                ))}
            </dd>
        </div>
    );
};


const SubmissionDetail = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();
    const { currentTheme } = useDarkMode();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const response = await submissionService.getSubmissionById(submissionId);
                if (response.success) {
                    setSubmission(response.data);
                } else {
                    toast.error(response.message || "Không tìm thấy yêu cầu.");
                    navigate('/creator/my-submissions');
                }
            } catch (error) {
                toast.error("Không thể tải chi tiết yêu cầu.");
                navigate('/creator/my-submissions');
            } finally {
                setLoading(false);
            }
        };
        fetchSubmission();
    }, [submissionId, navigate]);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div></div>;
    if (!submission) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <Button variant="ghost" onClick={() => navigate('/creator/my-submissions')} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại danh sách
                </Button>
                <h1 className={`text-3xl font-bold ${currentTheme.text}`}>{submission.title}</h1>
                <p className={`mt-2 ${currentTheme.textSecondary}`}>Chi tiết yêu cầu đã gửi ngày {new Date(submission.submissionDate).toLocaleDateString('vi-VN')}</p>
            </div>

            {submission.status === 'REJECTED' && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Yêu cầu đã bị từ chối</h3>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                                <p>{submission.rejectionReason || 'Không có lý do cụ thể.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={`p-8 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard}`}>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <DetailItem label="Mô tả" value={submission.description}/>
                    <DetailItem label="Premium" value={submission.isPremium ? 'Có' : 'Không'} />
                    <DetailList label="Ca sĩ" items={submission.singers} />
                    <DetailList label="Thể loại" items={submission.tags} />
                </dl>
            </div>
        </div>
    );
};

export default SubmissionDetail;