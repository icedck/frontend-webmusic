import React from 'react';
import { Play, PlusCircle } from 'lucide-react';
import Button from '../common/Button';

const PlaylistCard = ({ playlist, onSelect, onAddSongs }) => {
    const handleAddClick = (e) => {
        e.stopPropagation();
        onAddSongs(playlist);
    };

    return (
        <div className="block group cursor-pointer" onClick={() => onSelect(playlist.id)}>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg">
                <img src={playlist.imageUrl} alt={playlist.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                        <Play size={28} className="ml-1" />
                    </div>
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleAddClick}
                    className="absolute bottom-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10 scale-0 group-hover:scale-100 transition-transform duration-300"
                    aria-label="Thêm bài hát"
                >
                    <PlusCircle size={22} />
                </Button>
            </div>
            <div className="mt-3">
                <h3 className="font-semibold truncate">{playlist.title}</h3>
                <p className="text-sm text-slate-400 truncate">{playlist.description}</p>
            </div>
        </div>
    );
};

export default PlaylistCard;