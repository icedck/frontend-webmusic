import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useAudio } from '../../../hooks/useAudio';
import { musicService } from '../services/musicService';
import Button from '../../../components/common/Button';
import { Play, Pause, Heart, Plus, Download, Music } from 'lucide-react';

const SongDetail = () => {
    const { songId } = useParams();
    const { currentTheme } = useDarkMode();
    const { playSong, togglePlay, currentSong, isPlaying } = useAudio();

    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div className="space-y-8">
            <div className={`flex flex-col md:flex-row items-center md:items-start gap-8 p-8 rounded-xl ${currentTheme.bgCard} border ${currentTheme.border}`}>
                <div className="flex-shrink-0">
                    <img
                        src={song.thumbnailPath ? `${API_BASE_URL}${song.thumbnailPath}` : 'https://via.placeholder.com/200'}
                        alt={song.title}
                        className="w-48 h-48 lg:w-56 lg:h-56 rounded-lg object-cover shadow-lg"
                    />
                </div>
                <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                    <span className={`text-sm font-semibold text-music-500 uppercase`}>Bài hát</span>
                    <h1 className={`text-4xl lg:text-5xl font-bold mt-2 ${currentTheme.text}`}>{song.title}</h1>
                    <div className="mt-4 flex items-center space-x-2 text-lg">
                        <p className={`${currentTheme.textSecondary}`}>
                            bởi {song.singers.map((singer, index) => (
                            <Link key={singer.id} to={`/singer/${singer.id}`} className={`font-semibold ${currentTheme.text} hover:underline`}>
                                {singer.name}{index < song.singers.length - 1 ? ', ' : ''}
                            </Link>
                        ))}
                        </p>
                    </div>
                    <div className="mt-6 flex items-center space-x-4">
                        <Button size="lg" onClick={handlePlayPause} className="flex items-center space-x-2">
                            {isCurrentlyPlaying ? <Pause className="w-6 h-6"/> : <Play className="w-6 h-6"/>}
                            <span>{isCurrentlyPlaying ? 'Tạm dừng' : 'Phát'}</span>
                        </Button>
                        <Button variant="outline" size="icon"><Heart className="w-5 h-5"/></Button>
                        <Button variant="outline" size="icon"><Plus className="w-5 h-5"/></Button>
                        <Button variant="outline" size="icon"><Download className="w-5 h-5"/></Button>

                    </div>
                </div>
            </div>

            <div className={`${currentTheme.bgCard} p-6 rounded-xl border ${currentTheme.border}`}>
                <h2 className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>Thông tin thêm</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className={`${currentTheme.textSecondary} block`}>Lượt nghe</span>
                        <span className={`font-semibold ${currentTheme.text}`}>{song.listenCount.toLocaleString('vi-VN')}</span>
                    </div>
                    <div>
                        <span className={`${currentTheme.textSecondary} block`}>Đăng bởi</span>
                        <Link to={`/user/${song.creatorId}`} className={`font-semibold ${currentTheme.text} hover:underline`}>{song.creatorName}</Link>
                    </div>
                    <div>
                        <span className={`${currentTheme.textSecondary} block`}>Ngày đăng</span>
                        <span className={`font-semibold ${currentTheme.text}`}>{new Date(song.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
                {song.tags && song.tags.length > 0 && (
                    <div className="mt-6">
                        <h3 className={`${currentTheme.textSecondary} text-sm`}>Thể loại</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {song.tags.map(tag => (
                                <Link key={tag.id} to={`/tag/${tag.id}`} className={`px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 ${currentTheme.text}`}>
                                    {tag.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SongDetail;