import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import Button from '../common/Button';
import { useDarkMode } from '../../hooks/useDarkMode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const ChartItem = ({ chartEntry, onPlay }) => {
    const { isDarkMode } = useDarkMode();
    const { rank, previousRank, song } = chartEntry;

    if (!song) {
        return null;
    }

    const getRankChange = () => {
        if (previousRank === null) {
            return { icon: <ArrowUp />, color: 'text-green-500', text: 'Mới' };
        }
        if (rank < previousRank) {
            return { icon: <ArrowUp />, color: 'text-green-500', text: previousRank - rank };
        }
        if (rank > previousRank) {
            return { icon: <ArrowDown />, color: 'text-red-500', text: rank - previousRank };
        }
        return { icon: <Minus />, color: 'text-slate-500', text: '' };
    };

    const rankChange = getRankChange();

    const rankColor = rank === 1 ? 'text-cyan-400' :
        rank === 2 ? 'text-green-400' :
            rank === 3 ? 'text-amber-400' :
                (isDarkMode ? 'text-slate-300' : 'text-slate-600');

    const fallbackColor = isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
    const strokeStyle = {
        WebkitTextStroke: `1.5px ${song.color || fallbackColor}`,
    };

    return (
        <div className="group flex items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-200">
            <div className="flex items-center w-16 flex-shrink-0">
                <span className={`text-3xl font-bold font-sans ${rankColor} w-10 text-center`} style={strokeStyle}>
                    {rank}
                </span>
                <div className={`flex items-center text-xs ${rankChange.color}`}>
                    {rankChange.icon}
                    <span className="ml-0.5">{rankChange.text}</span>
                </div>
            </div>

            <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 ml-4">
                <img src={`${API_BASE_URL}${song.thumbnailPath}`} alt={song.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onPlay(song)}
                        className="w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white"
                    >
                        <Play size={16} className="ml-0.5" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-w-0 mx-4">
                <Link to={`/song/${song.id}`} className="font-semibold text-slate-800 dark:text-slate-100 truncate hover:underline block">
                    {song.title}
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {song.singers.map(s => s.name).join(', ')}
                </p>
            </div>

            <div className="hidden md:block text-sm text-slate-500 dark:text-slate-400">
                {song.duration ? `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, '0')}` : ''}
            </div>
        </div>
    );
};

export default ChartItem;