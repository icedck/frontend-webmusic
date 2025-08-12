// frontend/src/components/music/PlaylistListItem.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';

const PlaylistListItem = ({ playlist }) => {
    return (
        <Link
            to={`/playlist/${playlist.id}`}
            className="block group p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-200"
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
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock size={16} />
                    <span>{new Date(playlist.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </Link>
    );
};

export default PlaylistListItem;