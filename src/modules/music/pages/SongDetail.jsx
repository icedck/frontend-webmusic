import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useAudio } from '../../../hooks/useAudio';
import { musicService } from '../services/musicService';
import Button from '../../../components/common/Button';
import { Play, Pause, Heart, Plus, Download, BarChart3, User, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AddToPlaylistModal } from '../components/AddToPlaylistModal';
import CommentSection from '../components/CommentSection';

const SongDetail = () => {
    const { songId } = useParams();
    const { currentTheme } = useDarkMode();
    const { playSong, togglePlay, currentSong, isPlaying } = useAudio();

    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);

    useEffect(() => {
        const fetchSong = async () => {
            if (!songId) return;
            setLoading(true);
            setError(null);
            try {
                const response = await musicService.getSongById(songId);
                if (response.success) {
                    setSong(response.data);
                } else {
                    setError(response.message || "Không tìm thấy bài hát.");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Đã có lỗi xảy ra khi tải thông tin bài hát.");
            } finally {
                setLoading(false);
            }
        };
        fetchSong();
    }, [songId]);

    const handlePlayPause = () => {
        if (song) {
            if (currentSong?.id === song.id) {
                togglePlay();
            } else {
                playSong(song);
            }
        }
    };

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div></div>;
    }

    if (error || !song) {
        return <div className={`text-center py-10 ${currentTheme.bgCard} rounded-lg`}><p className="text-red-500">{error || "Không tìm thấy bài hát."}</p></div>;
    }

    const isCurrentlyPlaying = isPlaying && currentSong?.id === song.id;

    return (
        <>
            <div className="max-w-7xl mx-auto space-y-8 p-4">
                <div className={`relative flex flex-col md:flex-row items-center md:items-end gap-8 p-8 rounded-xl border ${currentTheme.border} overflow-hidden`}>
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20 blur-xl scale-110"
                        style={{ backgroundImage: `url(${song.thumbnailPath ? `${API_BASE_URL}${song.thumbnailPath}` : ''})` }}
                    />
                    <div className="relative flex-shrink-0">
                        <img
                            src={song.thumbnailPath ? `${API_BASE_URL}${song.thumbnailPath}` : 'https://via.placeholder.com/200'}
                            alt={song.title}
                            className="w-48 h-48 lg:w-56 lg:h-56 rounded-lg object-cover shadow-2xl"
                        />
                    </div>
                    <div className="relative flex-1 flex flex-col justify-end items-center md:items-start text-center md:text-left">
                        <span className={`text-sm font-semibold text-music-500 dark:text-music-400 uppercase`}>Bài hát</span>
                        <h1 className={`text-4xl lg:text-5xl font-bold mt-2 ${currentTheme.text} leading-tight`}>{song.title}</h1>
                        <div className="mt-4 flex items-center space-x-2 text-lg">
                            <p className={`${currentTheme.textSecondary}`}>
                                bởi {song.singers.map((singer, index) => (
                                <Link key={singer.id} to={`/singer/${singer.id}`} className={`font-semibold ${currentTheme.text} hover:underline`}>
                                    {singer.name}{index < song.singers.length - 1 ? ', ' : ''}
                                </Link>
                            ))}
                            </p>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <Button size="lg" onClick={handlePlayPause} className="flex items-center gap-2">
                                {isCurrentlyPlaying ? <Pause className="w-6 h-6"/> : <Play className="w-6 h-6"/>}
                                <span>{isCurrentlyPlaying ? 'Tạm dừng' : 'Phát'}</span>
                            </Button>
                            <Button variant="outline" size="icon"><Heart className="w-5 h-5"/></Button>
                            <Button variant="outline" size="icon" onClick={() => setIsAddToPlaylistModalOpen(true)}>
                                <Plus className="w-5 h-5"/>
                            </Button>
                            <Button variant="outline" size="icon"><Download className="w-5 h-5"/></Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {song.description && (
                            <div className={`${currentTheme.bgCard} p-6 rounded-xl border ${currentTheme.border}`}>
                                <h2 className={`text-xl font-bold mb-4 ${currentTheme.text}`}>Mô tả</h2>
                                <p className={`${currentTheme.textSecondary} whitespace-pre-wrap`}>
                                    {song.description}
                                </p>
                            </div>
                        )}
                        <CommentSection commentableId={song.id} commentableType="SONG" />
                    </div>

                    <div className="lg:col-span-1">
                        <div className={`${currentTheme.bgCard} p-6 rounded-xl border ${currentTheme.border} space-y-4`}>
                            <h2 className={`text-xl font-bold mb-2 ${currentTheme.text}`}>Thông tin thêm</h2>
                            <div className="flex items-center gap-3">
                                <BarChart3 className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                                <div>
                                    <div className={`text-sm ${currentTheme.textSecondary}`}>Lượt nghe</div>
                                    <div className="font-semibold">{song.listenCount.toLocaleString('vi-VN')}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Heart className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                                <div>
                                    <div className={`text-sm ${currentTheme.textSecondary}`}>Lượt thích</div>
                                    <div className="font-semibold">{song.likeCount.toLocaleString('vi-VN')}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <User className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                                <div>
                                    <div className={`text-sm ${currentTheme.textSecondary}`}>Đăng bởi</div>
                                    <Link to={`/user/${song.creatorId}`} className="font-semibold hover:underline">{song.creatorName}</Link>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <CalendarDays className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                                <div>
                                    <div className={`text-sm ${currentTheme.textSecondary}`}>Ngày đăng</div>
                                    <div className="font-semibold">{format(new Date(song.createdAt), 'dd MMMM, yyyy', { locale: vi })}</div>
                                </div>
                            </div>
                            {song.tags && song.tags.length > 0 && (
                                <div className="pt-2">
                                    <h3 className={`text-sm mb-2 ${currentTheme.textSecondary}`}>Thể loại</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {song.tags.map(tag => (
                                            <Link key={tag.id} to={`/tag/${tag.id}`} className={`px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 ${currentTheme.text} hover:bg-gray-300 dark:hover:bg-gray-600`}>
                                                {tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isAddToPlaylistModalOpen && (
                <AddToPlaylistModal
                    isOpen={isAddToPlaylistModalOpen}
                    onClose={() => setIsAddToPlaylistModalOpen(false)}
                    songToAdd={song}
                />
            )}
        </>
    );
};

export default SongDetail;