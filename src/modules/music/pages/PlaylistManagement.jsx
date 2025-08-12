// frontend/src/modules/music/pages/PlaylistManagement.jsx

import React, { useState, useEffect } from 'react';
import { CreatePlaylistModal } from '../components/CreatePlaylistModal';
import Button from '../../../components/common/Button';
import PlaylistCard from '../../../components/music/PlaylistCard';
import PlaylistListItem from '../../../components/music/PlaylistListItem'; // Import component mới
import { musicService } from '../services/musicService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Music, LayoutGrid, List } from 'lucide-react'; // Import icons cho toggle

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const ViewModeToggle = ({ viewMode, setViewMode }) => {
    const baseClasses = "p-2 rounded-md transition-colors duration-200";
    const activeClasses = "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm";
    const inactiveClasses = "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200";

    return (
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <button
                onClick={() => setViewMode('grid')}
                className={`${baseClasses} ${viewMode === 'grid' ? activeClasses : inactiveClasses}`}
                aria-label="Grid View"
            >
                <LayoutGrid size={20} />
            </button>
            <button
                onClick={() => setViewMode('list')}
                className={`${baseClasses} ${viewMode === 'list' ? activeClasses : inactiveClasses}`}
                aria-label="List View"
            >
                <List size={20} />
            </button>
        </div>
    );
};


const PlaylistManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // State quản lý chế độ xem

    const fetchPlaylists = async () => {
        try {
            setIsLoading(true);
            const response = await musicService.getMyPlaylists();
            if (response.success && Array.isArray(response.data)) {
                setPlaylists(response.data);
            } else {
                setPlaylists([]);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách playlist.");
            setPlaylists([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const handlePlaylistCreated = (newPlaylist) => {
        toast.success("Tạo playlist thành công!");
        setIsModalOpen(false);
        fetchPlaylists();
    };

    const renderContent = () => {
        if (isLoading) {
            return <p className="col-span-full text-center py-10 text-gray-400">Đang tải...</p>;
        }

        if (playlists.length === 0) {
            return (
                <div className="col-span-full text-center py-20 flex flex-col items-center">
                    <Music className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Chưa có playlist nào</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Hãy tạo một playlist để bắt đầu sắp xếp âm nhạc của bạn!
                    </p>
                </div>
            );
        }

        return playlists.map(p => {
            const itemData = {
                id: p.id,
                title: p.name,
                description: `${p.songCount} bài hát`,
                imageUrl: p.thumbnailPath ? `${API_BASE_URL}${p.thumbnailPath}` : `https://via.placeholder.com/300/1e293b/FFFFFF?text=${p.name.charAt(0)}`,
                createdAt: p.createdAt
            };

            if (viewMode === 'grid') {
                return <PlaylistCard key={p.id} playlist={itemData} />;
            }
            return <PlaylistListItem key={p.id} playlist={itemData} />;
        });
    }

    const containerClasses = viewMode === 'grid'
        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-8"
        : "flex flex-col space-y-2";


    return (
        <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Thư viện Playlist
                </h2>
                <div className="flex items-center gap-4">
                    <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
                    <Button onClick={() => setIsModalOpen(true)}>
                        Tạo playlist mới
                    </Button>
                </div>
            </div>

            <div className={containerClasses}>
                {renderContent()}
            </div>

            <CreatePlaylistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handlePlaylistCreated}
            />
        </div>
    );
};

export default PlaylistManagement;