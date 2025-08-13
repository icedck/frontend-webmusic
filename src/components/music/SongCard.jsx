import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus } from 'lucide-react';
import { AddToPlaylistModal } from '../../modules/music/components/AddToPlaylistModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const SongCard = ({ song }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsModalOpen(true);
    };

    return (
        <>
            <Link to={`/song/${song.id}`} className="group relative block p-3 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-300">
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-4">
                    <img src={song.thumbnailPath ? `${API_BASE_URL}${song.thumbnailPath}` : 'https://via.placeholder.com/150'} alt={song.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <button className="w-12 h-12 bg-music-500 hover:bg-music-600 rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                            <Play size={24} className="ml-1" />
                        </button>
                    </div>
                </div>
                <div className="min-w-0">
                    <p className="font-semibold truncate text-slate-800 dark:text-slate-100">{song.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {song.singers?.map(s => s.name).join(', ')}
                    </p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Add to playlist"
                >
                    <Plus size={18} />
                </button>
            </Link>
            {isModalOpen && (
                <AddToPlaylistModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    songToAdd={song}
                />
            )}
        </>
    );
};

export default SongCard;