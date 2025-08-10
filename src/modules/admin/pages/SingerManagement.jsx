import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../services/adminService';
import CreateSingerModal from '../components/CreateSingerModal';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
        APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
        REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const SingerManagement = () => {
    const { currentTheme } = useDarkMode();
    const [singers, setSingers] = useState([]);
    const [loading, setLoading] = useState(true);
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
                setPageInfo({
                    pageNumber: response.data.pageInfo.page,
                    pageSize: response.data.pageInfo.size,
                    totalPages: response.data.pageInfo.totalPages,
                    totalElements: response.data.pageInfo.totalElements,
                });
            } else {
                setSingers([]);
                toast.error(response.message || "Không thể tải danh sách ca sĩ.");
            }
        } catch (err) {
            toast.error("Đã xảy ra lỗi khi tải danh sách ca sĩ.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSingers(pageInfo.pageNumber, pageInfo.pageSize);
    }, []);

    const handleSuccess = () => {
        setIsModalOpen(false);
        toast.success("Thêm ca sĩ mới thành công!");
        fetchSingers(0, pageInfo.pageSize);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageInfo.totalPages) {
            fetchSingers(newPage, pageInfo.pageSize);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Quản lý ca sĩ</h1>
                    <p className={`mt-2 ${currentTheme.textSecondary}`}>Thêm, sửa, và quản lý các ca sĩ trong hệ thống.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} size="icon" data-tooltip-id="global-tooltip" data-tooltip-content="Thêm ca sĩ">
                    <PlusCircle className="w-5 h-5" />
                </Button>
            </div>

            <div className={`overflow-x-auto ${currentTheme.bgCard} rounded-xl border ${currentTheme.border}`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={`${currentTheme.bg}`}>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ca sĩ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading && <tr><td colSpan="4" className="text-center py-4">Đang tải...</td></tr>}
                    {!loading && singers.length === 0 && (
                        <tr><td colSpan="4" className="text-center py-4">Không có dữ liệu.</td></tr>
                    )}
                    {!loading && singers.map((singer) => (
                        <tr key={singer.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{singer.id}</td>
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
                    </tbody>
                </table>
            </div>

            {!loading && pageInfo.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm">
                        Trang {pageInfo.pageNumber + 1} / {pageInfo.totalPages} (Tổng số {pageInfo.totalElements} ca sĩ)
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