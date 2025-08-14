import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { musicService } from '../services/musicService';
import { useAudio } from '../../../hooks/useAudio';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { Loader2, Music, Trash2, Play, Edit, PlusCircle, Eye, EyeOff, Headphones, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Button from '../../../components/common/Button';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import CommentSection from '../components/CommentSection';
import { EditPlaylistModal } from '../components/EditPlaylistModal';
import AddSongsToPlaylistModal from '../components/AddSongsToPlaylistModal';
import { LikeButton } from '../components/LikeButton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const PlaylistDetailPage = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const { playSong } = useAudio();
    const { user } = useAuth();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddSongsModalOpen, setIsAddSongsModalOpen] = useState(false);
    const [songToRemove, setSongToRemove] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);

    const fetchPlaylistDetails = useCallback(async () => {
        try {
            const response = await musicService.getPlaylistDetails(playlistId);
            if (response.success) {
                setPlaylist(response.data);
            } else {
                toast.error(response.message || 'Không thể tải chi tiết playlist.');
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi tải dữ liệu playlist.');
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [playlistId, navigate]);

    useEffect(() => {
        setLoading(true);
        fetchPlaylistDetails();
    }, [fetchPlaylistDetails]);

    const handleTogglePlaylistLike = useCallback(async () => {
        if (!playlist) return;
        try {
            await musicService.togglePlaylistLike(playlist.id);
            setPlaylist(prev => ({
                ...prev,
                isLikedByCurrentUser: !prev.isLikedByCurrentUser,
                likeCount: prev.isLikedByCurrentUser ? prev.likeCount - 1 : prev.likeCount + 1
            }));
        } catch (error) {
            console.error("Failed to toggle playlist like:", error);
            throw error;
        }
    }, [playlist]);

    const handleToggleSongLike = useCallback(async (songIdToToggle) => {
        try {
            await musicService.toggleSongLike(songIdToToggle);
            setPlaylist(prev => ({
                ...prev,
                songs: prev.songs.map(song => {
                    if (song.id === songIdToToggle) {
                        return {
                            ...song,
                            isLikedByCurrentUser: !song.isLikedByCurrentUser,
                            likeCount: song.isLikedByCurrentUser ? song.likeCount - 1 : song.likeCount + 1
                        };
                    }
                    return song;
                })
            }));
        } catch (error) {
            console.error("Failed to toggle song like:", error);
            throw error;
        }
    }, []);

    const handlePlaySongFromPlaylist = (song) => {
        if (playlist && playlist.songs) {
            playSong(song, playlist.songs, { playlistId: playlist.id });
        }
    };

    const handleSongsAdded = () => {
        fetchPlaylistDetails();
    };

    const handlePlaylistUpdated = () => {
        toast.success("Cập nhật playlist thành công!");
        fetchPlaylistDetails();
    };

    const handleToggleVisibility = async () => {
        if (!playlist || !playlist.canToggleVisibility) return;
        setIsTogglingVisibility(true);
        try {
            const response = await musicService.togglePlaylistVisibility(playlist.id);
            if (response.success) {
                toast.success(response.message);
                setPlaylist(prev => ({ ...prev, visibility: response.data.visibility }));
            } else {
                toast.error(response.message || "Thay đổi trạng thái thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra.");
        } finally {
            setIsTogglingVisibility(false);
        }
    };

    const handleConfirmRemoveSong = async () => {
        if (!songToRemove || !playlist) return;
        setIsProcessing(true);
        try {
            const response = await musicService.removeSongFromPlaylist(playlist.id, songToRemove.id);
            if (response.success) {
                toast.success(`Đã xóa "${songToRemove.title}" khỏi playlist.`);
                setSongToRemove(null);
                setPlaylist(prev => ({
                    ...prev,
                    songs: prev.songs.filter(s => s.id !== songToRemove.id),
                    songCount: prev.songCount - 1
                }));
            } else {
                toast.error(response.message || "Xóa bài hát thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi xóa bài hát.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmDeletePlaylist = async () => {
        setIsProcessing(true);
        try {
            const response = await musicService.deletePlaylist(playlistId);
            if (response.success) {
                toast.success(`Đã xóa playlist "${playlist.name}".`);
                navigate('/my-playlists');
            } else {
                toast.error(response.message || "Xóa playlist thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi xóa playlist.");
        } finally {
            setIsProcessing(false);
            setIsConfirmDeleteOpen(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-cyan-500" /></div>;
    }

    if (!playlist) return null;

    return (
        <div className="space-y-8 p-4 sm:p-6">
            <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 max-w-xs mx-auto md:mx-0">
                    <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                        {playlist.thumbnailPath ? (
                            <img src={`${API_BASE_URL}${playlist.thumbnailPath}`} alt={playlist.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"><Music className="w-1/2 h-1/2 text-slate-400" /></div>
                        )}
                    </div>
                </div>
                <div className="flex-grow space-y-4">
                    <p className="text-sm font-semibold uppercase text-cyan-500 tracking-wider">Playlist</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white break-words">{playlist.name}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                        <span>Tạo bởi <strong>{playlist.creatorName}</strong></span>
                        <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {format(new Date(playlist.createdAt), 'dd/MM/yyyy', { locale: vi })}</span>
                        <span>•</span>
                        <span>{playlist.songCount} bài hát</span>
                        {playlist.visibility !== 'PRIVATE' && (
                            <span className="flex items-center gap-1.5"><Headphones size={14} /> {playlist.listenCount?.toLocaleString('vi-VN') || 0}</span>
                        )}
                    </div>
                    <div className="flex items-center flex-wrap gap-2 pt-4">
                        <Button onClick={() => handlePlaySongFromPlaylist(playlist.songs[0])} disabled={!playlist.songs || playlist.songs.length === 0}><Play size={18} className="mr-2" />Phát</Button>
                        {/* --- BẮT ĐẦU SỬA ĐỔI --- */}
                        {playlist.visibility !== 'PRIVATE' && (
                            <LikeButton initialIsLiked={playlist.isLikedByCurrentUser} initialLikeCount={playlist.likeCount} onToggleLike={handleTogglePlaylistLike} size={18}/>
                        )}
                        {playlist.canEdit && <Button variant="outline" onClick={() => setIsAddSongsModalOpen(true)}><PlusCircle size={16} /></Button>}
                        {playlist.canEdit && <Button variant="outline" onClick={() => setIsEditModalOpen(true)}><Edit size={16} /></Button>}
                        {playlist.canToggleVisibility && (
                            <Button variant="outline" onClick={handleToggleVisibility} disabled={isTogglingVisibility}>
                                {playlist.visibility === 'PUBLIC' ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                        )}
                        {playlist.canDelete && <Button variant="danger_outline" onClick={() => setIsConfirmDeleteOpen(true)}><Trash2 size={16} /></Button>}
                        {/* --- KẾT THÚC SỬA ĐỔI --- */}
                    </div>
                </div>
            </div>

            <div>
                {playlist.songs && playlist.songs.length > 0 ? (
                    playlist.songs.map((song, index) => (
                        <div key={song.id} className="group flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-200">
                            <div className="text-sm text-slate-400 w-6 text-center">{index + 1}</div>
                            <img src={song.thumbnailPath ? `${API_BASE_URL}${song.thumbnailPath}` : 'https://via.placeholder.com/48'} alt={song.title} className="w-12 h-12 rounded-md object-cover" />
                            <div className="flex-1 min-w-0">
                                <Link to={`/song/${song.id}`} className="font-semibold text-slate-800 dark:text-slate-100 truncate hover:underline">{song.title}</Link>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{song.singers && song.singers.map(s => s.name).join(', ')}</p>
                            </div>
                            <div className="hidden md:flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                <Headphones size={16} />
                                <span>{song.listenCount.toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <LikeButton initialIsLiked={song.isLikedByCurrentUser} initialLikeCount={song.likeCount} onToggleLike={() => handleToggleSongLike(song.id)} showCount={false} />
                                <Button size="icon" variant="ghost" onClick={() => handlePlaySongFromPlaylist(song)}><Play size={20} /></Button>
                                {playlist.canEdit && <Button size="icon" variant="ghost" onClick={() => setSongToRemove(song)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></Button>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10"><Music className="w-12 h-12 text-gray-400 mx-auto mb-3" /><p className="text-slate-500">Playlist này chưa có bài hát nào.</p></div>
                )}
            </div>

            {/* --- BẮT ĐẦU SỬA ĐỔI --- */}
            {user && playlist.visibility !== 'PRIVATE' && (
                <CommentSection commentableId={playlist.id} commentableType="PLAYLIST" />
            )}
            {/* --- KẾT THÚC SỬA ĐỔI --- */}

            <ConfirmationModal isOpen={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)} onConfirm={handleConfirmDeletePlaylist} title="Xác nhận xóa playlist" message={`Bạn có chắc chắn muốn xóa vĩnh viễn playlist "${playlist?.name}"? Hành động này không thể hoàn tác.`} confirmText="Xóa" isLoading={isProcessing}/>
            <ConfirmationModal isOpen={!!songToRemove} onClose={() => setSongToRemove(null)} onConfirm={handleConfirmRemoveSong} title="Xác nhận xóa bài hát" message={`Bạn có chắc chắn muốn xóa bài hát "${songToRemove?.title}" khỏi playlist này?`} confirmText="Xóa" isLoading={isProcessing}/>
            {playlist && <EditPlaylistModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} playlist={playlist} onPlaylistUpdated={handlePlaylistUpdated}/>}
            {playlist && <AddSongsToPlaylistModal isOpen={isAddSongsModalOpen} onClose={() => setIsAddSongsModalOpen(false)} playlist={playlist} onSuccess={handleSongsAdded}/>}
        </div>
    );
};

export default PlaylistDetailPage;