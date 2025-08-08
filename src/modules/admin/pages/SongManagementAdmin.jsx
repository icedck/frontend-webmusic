import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import { PlusCircle, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../services/adminService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        APPROVED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
}

const SongManagementAdmin = () => {
    const { currentTheme } = useDarkMode();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageInfo, setPageInfo] = useState({
        pageNumber: 0,
        pageSize: 5,
        totalPages: 0,
        totalElements: 0,
    });

    const fetchSongs = async (page, size) => {
        try {
            setLoading(true);
            const response = await adminService.getSongs(page, size);
            if (response.success && response.data && response.data.pageInfo) {
                setSongs(Array.isArray(response.data.content) ? response.data.content : []);
                setPageInfo(prevInfo => ({
                    ...prevInfo,
                    pageNumber: response.data.pageInfo.page,
                    totalPages: response.data.pageInfo.totalPages,
                    totalElements: response.data.pageInfo.totalElements,
                }));
            } else {
                setSongs([]);
                setError("Dữ liệu không hợp lệ hoặc không có thông tin phân trang.");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải danh sách bài hát.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSongs(pageInfo.pageNumber, pageInfo.pageSize);
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageInfo.totalPages) {
            fetchSongs(newPage, pageInfo.pageSize);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Quản lý bài hát</h1>
                    <p className={`mt-2 ${currentTheme.textSecondary}`}>Thêm, sửa, và quản lý các bài hát trong hệ thống.</p>
                </div>
                <Link to="/admin/songs/new">
                    <Button className="flex items-center space-x-2">
                        <PlusCircle className="w-5 h-5" />
                        <span>Thêm bài hát</span>
                    </Button>
                </Link>
            </div>

            <div className={`overflow-x-auto ${currentTheme.bgCard} rounded-xl border ${currentTheme.border}`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={`${currentTheme.bg}`}>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Bài hát</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ca sĩ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading && <tr><td colSpan="4" className="text-center py-4">Đang tải...</td></tr>}
                    {error && <tr><td colSpan="4" className="text-center py-4 text-red-500">{error}</td></tr>}
                    {!loading && !error && songs.map((song) => (
                        <tr key={song.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-lg object-cover" src={song.thumbnailPath ? `${API_BASE_URL}${song.thumbnailPath}` : `https://ui-avatars.com/api/?name=${song.title.replace(/\s/g, '+')}&background=random`} alt={song.title} />
                                    </div>
                                    <div className="ml-4">
                                        <Link to={`/song/${song.id}`} className="font-medium hover:underline">
                                            {song.title}
                                        </Link>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{song.singers?.map(s => s.name).join(', ') || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={song.status} /></td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Link to={`/admin/songs/edit/${song.id}`} className="text-music-500 hover:text-music-600">
                                    <Edit className="w-5 h-5" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {!loading && pageInfo.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm">
                        Trang {pageInfo.pageNumber + 1} / {pageInfo.totalPages} (Tổng số {pageInfo.totalElements} bài hát)
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
        </div>
    );
};

export default SongManagementAdmin;