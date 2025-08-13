import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { musicService } from '../services/musicService';
import { useAudio } from '../../../hooks/useAudio';
import Button from '../../../components/common/Button';
import { Play, Pause } from 'lucide-react';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const ArtistDetailPage = () => {
    const { id } = useParams();
    const { playSong, togglePlay, currentSong, isPlaying } = useAudio();
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtistDetails = async () => {
            setLoading(true);
            try {
                const response = await musicService.getSingerDetail(id);
                if (response.success) {
                    setArtist(response.data);
                } else {
                    toast.error(response.message || 'Không tìm thấy ca sĩ.');
                }
            } catch (error) {
                toast.error('Lỗi khi tải thông tin ca sĩ.');
            } finally {
                setLoading(false);
            }
        };

        fetchArtistDetails();
    }, [id]);

    const handlePlayPause = (song) => {
        if (currentSong?.id === song.id) {
            togglePlay();
        } else {
            playSong(song, artist.songs);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Đang tải...</div>;
    }

    if (!artist) {
        return <div className="text-center p-10">Không tìm thấy thông tin ca sĩ.</div>;
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <img
                    src={artist.avatarPath ? `${API_BASE_URL}${artist.avatarPath}` : 'https://via.placeholder.com/150'}
                    alt={artist.name}
                    className="w-40 h-40 rounded-full object-cover shadow-lg"
                />
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{artist.name}</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{artist.songCount} bài hát</p>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Các bài hát</h2>
                <div className="flex flex-col space-y-2">
                    {artist.songs.map((song, index) => {
                        const isCurrentlyPlaying = isPlaying && currentSong?.id === song.id;
                        return (
                            <div key={song.id} className="group flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-200">
                                <div className="text-sm text-slate-400 w-6 text-center">{index + 1}</div>
                                <img src={song.thumbnailPath ? `${API_BASE_URL}${song.thumbnailPath}` : 'https://via.placeholder.com/48'} alt={song.title} className="w-12 h-12 rounded-md object-cover" />
                                <div className="flex-1 min-w-0">
                                    <Link to={`/song/${song.id}`} className="font-semibold text-slate-800 dark:text-slate-100 truncate hover:underline">
                                        {song.title}
                                    </Link>
                                </div>
                                <div className="flex items-center">
                                    <Button size="icon" variant="ghost" onClick={() => handlePlayPause(song)}>
                                        {isCurrentlyPlaying ? <Pause size={20} /> : <Play size={20} />}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ArtistDetailPage;