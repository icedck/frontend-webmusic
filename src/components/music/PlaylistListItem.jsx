import React from 'react';
import { Play, Clock, PlusCircle } from 'lucide-react';
import Button from '../common/Button';

const PlaylistListItem = ({ playlist, onSelect, onAddSongs }) => {
    const handleAddClick = (e) => {
        e.stopPropagation();
        onAddSongs(playlist);
    };

    return (
        <div
            onClick={() => onSelect(playlist.id)}
            className="block group p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-200 cursor-pointer"
        >
            <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <img src={playlist.imageUrl} alt={playlist.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play size={20} className="text-white ml-0.5" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{playlist.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{playlist.description}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Clock size={16} />
                        <span>{new Date(playlist.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleAddClick}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 dark:text-slate-400 hover:text-blue-500"
                        aria-label="Thêm bài hát"
                    >
                        <PlusCircle size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PlaylistListItem;