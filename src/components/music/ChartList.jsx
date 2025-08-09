import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const ChartItem = ({ song, rank }) => {
    // Logic để xác định màu sắc của thứ hạng
    const getRankColor = (rank) => {
        switch (rank) {
            case 1: return 'text-yellow-400';
            case 2: return 'text-slate-300';
            case 3: return 'text-amber-500';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className="group flex items-center p-3 rounded-lg hover:bg-slate-800/50 transition-colors duration-200">
            <div className={`w-12 text-3xl font-bold text-center ${getRankColor(rank)}`}>
                {rank}
            </div>
            <div className="relative w-14 h-14 rounded-md overflow-hidden mx-4 flex-shrink-0">
                <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                        <Play size={16} className="ml-0.5" />
                    </div>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-white">{song.title}</p>
                <p className="text-sm text-slate-400 truncate">{song.artist}</p>
            </div>
            <div className="ml-4 text-sm text-slate-400 font-mono">
                {song.duration}
            </div>
        </div>
    );
};

const ChartList = ({ chartData }) => {
    return (
        <div className="space-y-2">
            {chartData.map((song, index) => (
                <ChartItem key={song.id} song={song} rank={index + 1} />
            ))}
        </div>
    );
};

export default ChartList;