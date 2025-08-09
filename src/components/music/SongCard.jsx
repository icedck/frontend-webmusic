import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const SongCard = ({ song }) => (
    <div className="group flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                    <Play size={16} className="ml-0.5" />
                </button>
            </div>
        </div>
        <div className="min-w-0">
            <p className="font-semibold truncate">{song.title}</p>
            <p className="text-sm text-slate-400 truncate">{song.artist}</p>
            <p className="text-xs text-slate-500 mt-1">{song.releaseDate}</p>
        </div>
    </div>
);

export default SongCard;