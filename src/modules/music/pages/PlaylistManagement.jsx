import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreatePlaylistModal } from '../components/CreatePlaylistModal';
import { EditPlaylistModal } from '../components/EditPlaylistModal';
import AddSongsToPlaylistModal from '../components/AddSongsToPlaylistModal';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import Button from '../../../components/common/Button';
import PlaylistCard from '../../../components/music/PlaylistCard';
import PlaylistListItem from '../../../components/music/PlaylistListItem';
import { musicService } from '../services/musicService';
import { toast } from 'react-toastify';
import { Music, LayoutGrid, List, Play, ChevronLeft, Edit, Trash2 } from 'lucide-react';
import { useAudio } from '../../../hooks/useAudio';
import CommentSection from '../components/CommentSection';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const PlaylistDetailView = ({ playlist, onBack, onPlaySongFromPlaylist, onEdit, onDeletePlaylist, onRemoveSong }) => {
    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center justify-between mb-6 gap-4">
                    <div className="flex items-center flex-1 min-w-0">
                        <Button variant="ghost" size="icon" onClick={onBack} className="mr-4 flex-shrink-0">
                            <ChevronLeft size={24} />
                        </Button>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate" title={playlist.name}>
                            {playlist.name}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
                            <Edit size={16} />
                            <span>Chỉnh sửa</span>
                        </Button>
                        <Button variant="danger_outline" onClick={onDeletePlaylist} className="flex items-center gap-2">
                            <Trash2 size={16} />
                            <span>Xóa</span>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    {playlist.songs && playlist.songs.length > 0 ? (
                        playlist.songs.map((song, index) => (
                            <div key={song.id} className="group flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-200">
                                <div className="text-sm text-slate-400 w-6 text-center">{index + 1}</div>
                                <img src={song.thumbnailPath ? `${API_BASE_URL}${song.thumbnailPath}` : 'https://via.placeholder.com/48'} alt={song.title} className="w-12 h-12 rounded-md object-cover" />
                                <div className="flex-1 min-w-0">
                                    <Link to={`/song/${song.id}`} className="font-semibold text-slate-800 dark:text-slate-100 truncate hover:underline">
                                        {song.title}
                                    </Link>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                        {song.singers.map(s => s.name).join(', ')}
                                    </p>
                                </div>
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" onClick={() => onPlaySongFromPlaylist(song)}>
                                        <Play size={20} />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => onRemoveSong(song)} className="text-red-500 hover:text-red-700">
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <Music className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-slate-500">Playlist này chưa có bài hát nào.</p>
                        </div>
                    )}
                </div>
            </div>
            <CommentSection commentableId={playlist.id} commentableType="PLAYLIST" />
        </div>
    );
};

const ViewModeToggle = ({ viewMode, setViewMode }) => {
    const baseClasses = "p-2 rounded-md transition-colors duration-200";
    const activeClasses = "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm";
    const inactiveClasses = "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200";

    return (
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <button onClick={() => setViewMode('grid')} className={`${baseClasses} ${viewMode === 'grid' ? activeClasses : inactiveClasses}`} aria-label="Grid View"><LayoutGrid size={20} /></button>
            <button onClick={() => setViewMode('list')} className={`${baseClasses} ${viewMode === 'list' ? activeClasses : inactiveClasses}`} aria-label="List View"><List size={20} /></button>
        </div>
    );
};

const PlaylistManagement = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddSongsModalOpen, setIsAddSongsModalOpen] = useState(false);
    const [playlistToAddSongs, setPlaylistToAddSongs] = useState(null);
    const [isConfirmDeletePlaylistOpen, setIsConfirmDeletePlaylistOpen] = useState(false);
    const [isConfirmRemoveSongOpen, setIsConfirmRemoveSongOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [playlistToEdit, setPlaylistToEdit] = useState(null);
    const [playlistToDelete, setPlaylistToDelete] = useState(null);
    const [songToRemove, setSongToRemove] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const { playSong } = useAudio();

    const fetchPlaylists = async () => {
        try {
            setIsLoading(true);
            const response = await musicService.getMyPlaylists();
            setPlaylists(response.success && Array.isArray(response.data) ? response.data : []);
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

    const handlePlaylistSelect = async (playlistId) => {
        setIsDetailLoading(true);
        try {
            const response = await musicService.getPlaylistById(playlistId);
            if(response.success) {
                setSelectedPlaylist(response.data);
            } else {
                toast.error(response.message || "Không thể tải chi tiết playlist.");
                setSelectedPlaylist(null);
            }
        } catch (error) {
            toast.error("Lỗi khi tải chi tiết playlist.");
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleBackToList = () => {
        setSelectedPlaylist(null);
    };

    const handlePlaylistCreated = (newPlaylist) => {
        toast.success("Tạo playlist thành công!");
        setIsCreateModalOpen(false);
        setPlaylists(prevPlaylists => [newPlaylist, ...prevPlaylists]);
    };

    const handleOpenEditModal = () => {
        setPlaylistToEdit(selectedPlaylist);
        setIsEditModalOpen(true);
    };

    const handlePlaylistUpdated = (updatedPlaylist) => {
        setSelectedPlaylist(updatedPlaylist);
        setPlaylists(prevPlaylists =>
            prevPlaylists.map(p => p.id === updatedPlaylist.id ? { ...p, name: updatedPlaylist.name, thumbnailPath: updatedPlaylist.thumbnailPath } : p)
        );
    };

    const handleOpenDeletePlaylistModal = () => {
        setPlaylistToDelete(selectedPlaylist);
        setIsConfirmDeletePlaylistOpen(true);
    };

    const handleConfirmDeletePlaylist = async () => {
        if (!playlistToDelete) return;
        setIsProcessing(true);
        try {
            const response = await musicService.deletePlaylist(playlistToDelete.id);
            if (response.success) {
                toast.success(`Đã xóa playlist "${playlistToDelete.name}".`);
                setIsConfirmDeletePlaylistOpen(false);
                setPlaylistToDelete(null);
                setSelectedPlaylist(null);
                setPlaylists(prev => prev.filter(p => p.id !== playlistToDelete.id));
            } else {
                toast.error(response.message || "Xóa playlist thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi xóa playlist.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOpenRemoveSongModal = (song) => {
        setSongToRemove(song);
        setIsConfirmRemoveSongOpen(true);
    };

    const handleConfirmRemoveSong = async () => {
        if (!songToRemove || !selectedPlaylist) return;
        setIsProcessing(true);
        try {
            const response = await musicService.removeSongFromPlaylist(selectedPlaylist.id, songToRemove.id);
            if (response.success) {
                toast.success(`Đã xóa "${songToRemove.title}" khỏi playlist.`);
                setIsConfirmRemoveSongOpen(false);
                setSelectedPlaylist(prev => ({
                    ...prev,
                    songs: prev.songs.filter(s => s.id !== songToRemove.id)
                }));
                setSongToRemove(null);
            } else {
                toast.error(response.message || "Xóa bài hát thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi xóa bài hát.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePlaySongFromPlaylist = (song) => {
        if (selectedPlaylist && selectedPlaylist.songs) {
            playSong(song, selectedPlaylist.songs);
        }
    };

    const handleOpenAddSongsModal = async (playlist) => {
        setIsProcessing(true);
        try {
            const response = await musicService.getPlaylistById(playlist.id);
            if (response.success) {
                setPlaylistToAddSongs(response.data);
                setIsAddSongsModalOpen(true);
            } else {
                toast.error(response.message || "Không thể lấy thông tin playlist.");
            }
        } catch (error) {
            toast.error("Lỗi khi lấy thông tin chi tiết playlist.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSongsAdded = (updatedPlaylist) => {
        setPlaylists(prev => prev.map(p => p.id === updatedPlaylist.id ? updatedPlaylist : p));
    };

    const renderPlaylistList = () => {
        if (isLoading) return <p className="col-span-full text-center py-10 text-gray-400">Đang tải...</p>;
        if (playlists.length === 0) {
            return (
                <div className="col-span-full text-center py-20 flex flex-col items-center">
                    <Music className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Chưa có playlist nào</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Hãy tạo một playlist để bắt đầu!</p>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="mt-6">
                        Tạo playlist mới
                    </Button>
                </div>
            );
        }

        const containerClasses = viewMode === 'grid'
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-8"
            : "flex flex-col space-y-2";

        return (
            <>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thư viện Playlist</h2>
                    <div className="flex items-center gap-4">
                        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
                        <Button onClick={() => setIsCreateModalOpen(true)}>Tạo playlist mới</Button>
                    </div>
                </div>
                <div className={containerClasses}>
                    {playlists.map(p => {
                        const itemData = {
                            id: p.id,
                            title: p.name,
                            description: `${p.songCount} bài hát`,
                            imageUrl: p.thumbnailPath ? `${API_BASE_URL}${p.thumbnailPath}` : `https://via.placeholder.com/300/1e293b/FFFFFF?text=${p.name.charAt(0)}`,
                            createdAt: p.createdAt
                        };
                        const handleSelect = () => handlePlaylistSelect(p.id);

                        if (viewMode === 'grid') {
                            return (
                                <PlaylistCard
                                    key={p.id}
                                    playlist={itemData}
                                    onSelect={handleSelect}
                                    onAddSongs={handleOpenAddSongsModal}
                                />
                            );
                        }
                        return (
                            <PlaylistListItem
                                key={p.id}
                                playlist={itemData}
                                onSelect={handleSelect}
                                onAddSongs={handleOpenAddSongsModal}
                            />
                        );
                    })}
                </div>
            </>
        );
    };

    return (
        <div className="p-4 sm:p-6">
            {isDetailLoading || isProcessing ? (
                <p className="col-span-full text-center py-10 text-gray-400">Đang tải...</p>
            ) : selectedPlaylist ? (
                <PlaylistDetailView
                    playlist={selectedPlaylist}
                    onBack={handleBackToList}
                    onPlaySongFromPlaylist={handlePlaySongFromPlaylist}
                    onEdit={handleOpenEditModal}
                    onDeletePlaylist={handleOpenDeletePlaylistModal}
                    onRemoveSong={handleOpenRemoveSongModal}
                />
            ) : (
                renderPlaylistList()
            )}
            <CreatePlaylistModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={handlePlaylistCreated} />
            <EditPlaylistModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                playlist={playlistToEdit}
                onPlaylistUpdated={handlePlaylistUpdated}
            />
            <AddSongsToPlaylistModal
                isOpen={isAddSongsModalOpen}
                onClose={() => setIsAddSongsModalOpen(false)}
                playlist={playlistToAddSongs}
                onSuccess={handleSongsAdded}
            />
            <ConfirmationModal
                isOpen={isConfirmDeletePlaylistOpen}
                onClose={() => setIsConfirmDeletePlaylistOpen(false)}
                onConfirm={handleConfirmDeletePlaylist}
                title="Xác nhận xóa playlist"
                message={`Bạn có chắc chắn muốn xóa vĩnh viễn playlist "${playlistToDelete?.name}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                isLoading={isProcessing}
            />
            <ConfirmationModal
                isOpen={isConfirmRemoveSongOpen}
                onClose={() => setIsConfirmRemoveSongOpen(false)}
                onConfirm={handleConfirmRemoveSong}
                title="Xác nhận xóa bài hát"
                message={`Bạn có chắc chắn muốn xóa bài hát "${songToRemove?.title}" khỏi playlist này?`}
                confirmText="Xóa"
                isLoading={isProcessing}
            />
        </div>
    );
};

export default PlaylistManagement;