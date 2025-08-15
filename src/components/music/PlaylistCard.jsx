import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Play } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import { musicService } from '../../modules/music/services/musicService';
import Button from '../common/Button';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const PlaylistCard = ({ playlist }) => {
    const { playSong } = useAudio();
    const handlePlayPlaylist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await musicService.getPlaylistDetails(playlist.id);
            if (response.success && response.data.songs && response.data.songs.length > 0) {
                playSong(response.data.songs[0], response.data.songs, { playlistId: playlist.id });
            }
        } catch (error) {
            console.error("Failed to play playlist:", error);
        }
    };

    return (
        <div className="group relative block">
            <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg shadow-md overflow-hidden mb-2 relative">
                <Link to={`/playlist/${playlist.id}`}>
                    {playlist.thumbnailPath ? (
                        <img src={`${API_BASE_URL}${playlist.thumbnailPath}`} alt={playlist.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-1/2 h-1/2 text-slate-400" />
                        </div>
                    )}
                </Link>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Button
                        size="icon"
                        onClick={handlePlayPlaylist}
                        className="w-12 h-12 bg-music-500 hover:bg-music-600 rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg"
                    >
                        <Play size={24} className="ml-1" />
                    </Button>
                </div>
            </div>
            <Link to={`/playlist/${playlist.id}`}>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-cyan-500">{playlist.name}</h3>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tạo bởi {playlist.creatorName}</p>
        </div>
    );
};
export default PlaylistCard;