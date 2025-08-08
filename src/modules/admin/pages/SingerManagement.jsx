import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../services/adminService';
import CreateSingerModal from '../components/CreateSingerModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        APPROVED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const SingerManagement = () => {
    const { currentTheme } = useDarkMode();
    const [singers, setSingers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pageInfo, setPageInfo] = useState({
        pageNumber: 0,
        pageSize: 5,
        totalPages: 0,
        totalElements: 0,
    });

    const fetchSingers = async (page, size) => {
        try {
            setLoading(true);
            const response = await adminService.getSingers(page, size);
            if (response.success && response.data) {
                setSingers(Array.isArray(response.data.content) ? response.data.content : []);

                setPageInfo(prev => ({
                    ...prev,
                    pageNumber: response.data.pageInfo.page,
                    totalPages: response.data.pageInfo.totalPages,
                    totalElements: response.data.pageInfo.totalElements,
                }));
            } else {
                setSingers([]);
                setError(response.message || "Không thể tải danh sách ca sĩ.");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải danh sách ca sĩ.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSingers(pageInfo.pageNumber, pageInfo.pageSize);
    }, []);

    const handleSuccess = () => {
        setIsModalOpen(false);
        fetchSingers(0, pageInfo.pageSize);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageInfo.totalPages) {
            fetchSingers(newPage, pageInfo.pageSize);
            setPageInfo(prev => ({ ...prev, pageNumber: newPage }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Quản lý ca sĩ</h1>
                    <p className={`mt-2 ${currentTheme.textSecondary}`}>Thêm, sửa, và quản lý các ca sĩ trong hệ thống.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
                    <PlusCircle className="w-5 h-5" />
                    <span>Thêm ca sĩ</span>
                </Button>
            </div>

            <div className={`overflow-x-auto ${currentTheme.bgCard} rounded-xl border ${currentTheme.border}`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={`${currentTheme.bg}`}>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ca sĩ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading && <tr><td colSpan="3" className="text-center py-4">Đang tải...</td></tr>}
                    {error && <tr><td colSpan="3" className="text-center py-4 text-red-500">{error}</td></tr>}
                    {!loading && !error && singers.length > 0 && singers.map((singer) => (
                        <tr key={singer.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-full object-cover" src={singer.avatarPath ? `${API_BASE_URL}${singer.avatarPath}` : `https://ui-avatars.com/api/?name=${singer.name.replace(/\s/g, '+')}`} alt={singer.name} />
                                    </div>
                                    <div className="ml-4 font-medium">{singer.name}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{singer.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={singer.status} /></td>
                        </tr>
                    ))}
                    {!loading && !error && singers.length === 0 && (
                        <tr><td colSpan="3" className="text-center py-4">Không có dữ liệu.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            {!loading && pageInfo.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm">
                        Trang {isNaN(pageInfo.pageNumber + 1) ? 1 : pageInfo.pageNumber + 1} / {pageInfo.totalPages || 1} (Tổng số {pageInfo.totalElements} ca sĩ)
                    </span>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handlePageChange(pageInfo.pageNumber - 1)} disabled={pageInfo.pageNumber === 0}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handlePageChange(pageInfo.pageNumber + 1)} disabled={pageInfo.pageNumber >= pageInfo.totalPages - 1}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            <CreateSingerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default SingerManagement;
