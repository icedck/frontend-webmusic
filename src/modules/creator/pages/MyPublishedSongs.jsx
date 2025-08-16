import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { creatorService } from '../services/creatorService.js';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Input from '../../../components/common/Input';
import { Search } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const MyPublishedSongs = () => {
    const { currentTheme } = useDarkMode();
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSongs = async () => {
            setLoading(true);
            try {
                const response = await creatorService.getMyPublishedSongs(pageInfo.page, pageInfo.size, searchTerm);
                if (response.success) {
                    setSongs(response.data.content);
                    setPageInfo({
                        ...pageInfo,
                        totalPages: response.data.pageInfo.totalPages,
                        totalElements: response.data.pageInfo.totalElements
                    });
                } else {
                    toast.error("Không thể tải danh sách bài hát.");
                }
            } catch (error) {
                toast.error("Lỗi khi tải dữ liệu. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        const debounceFetch = setTimeout(() => {
            fetchSongs();
        }, 500); // Debounce search input

        return () => clearTimeout(debounceFetch);
    }, [pageInfo.page, pageInfo.size, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPageInfo(prev => ({ ...prev, page: 0 })); // Reset to first page on new search
    };

    const handleRowClick = (songId) => {
        navigate(`/song/${songId}`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Thư viện bài hát</h1>
                <p className={`${currentTheme.textSecondary}`}>Quản lý các bài hát đã được xuất bản của bạn.</p>
            </div>

            <div className={`p-6 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard}`}>
                <div className="flex justify-between items-center mb-4">
                    <div className="w-full max-w-sm">
                        <Input
                            placeholder="Tìm kiếm theo tên bài hát..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            icon={Search}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className={`border-b ${currentTheme.border}`}>
                        <tr>
                            <th className="p-4">Tên bài hát</th>
                            <th className="p-4">Ca sĩ</th>
                            <th className="p-4 text-center">Lượt nghe</th>
                            <th className="p-4 text-center">Lượt thích</th>
                            <th className="p-4">Ngày đăng</th>
                            <th className="p-4">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center p-8">Đang tải...</td></tr>
                        ) : songs.length > 0 ? (
                            songs.map(song => (
                                <tr
                                    key={song.id}
                                    className={`border-b ${currentTheme.border} hover:${currentTheme.bgHover} cursor-pointer transition-colors`}
                                    onClick={() => handleRowClick(song.id)}
                                >
                                    <td className="p-4 font-medium flex items-center gap-4">
                                        <img src={`${API_BASE_URL}${song.thumbnailPath}`} alt={song.title} className="w-12 h-12 rounded-md object-cover" />
                                        <span className="truncate">{song.title}</span>
                                    </td>
                                    <td className="p-4 truncate">{song.singers.map(s => s.name).join(', ')}</td>
                                    <td className="p-4 text-center">{song.listenCount || 0}</td>
                                    <td className="p-4 text-center">{song.likeCount || 0}</td>
                                    <td className="p-4">{format(new Date(song.createdAt), 'dd/MM/yyyy')}</td>
                                    <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${song.isPremium ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                                                {song.isPremium ? 'PREMIUM' : 'MIỄN PHÍ'}
                                            </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="text-center p-8">Không tìm thấy bài hát nào.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination can be added here */}
            </div>
        </div>
    );
};

export default MyPublishedSongs;