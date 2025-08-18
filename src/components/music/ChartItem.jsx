// src/components/music/ChartItem.jsx

import React from 'react';

const ChartItem = ({ song, rank }) => {
    const rankColors = {
        1: 'text-stroke-blue-500 text-blue-500', // Màu cho hạng 1
        2: 'text-stroke-green-400 text-green-400', // Màu cho hạng 2
        3: 'text-stroke-red-400 text-red-400',   // Màu cho hạng 3
    };

    const getRankClass = (rank) => {
        return `text-4xl font-black text-transparent ${rankColors[rank] || 'text-stroke-gray-500 text-gray-500'}`;
    };

    return (
        <div className="flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors">
      <span className={getRankClass(rank)} style={{ WebkitTextStroke: `1.5px ${song.color}` }}>
        {rank}
      </span>
            <img src={song.imageUrl} alt={song.title} className="w-12 h-12 rounded-md object-cover mx-4" />
            <div className="flex-grow">
                <p className="font-semibold text-white truncate">{song.title}</p>
                <p className="text-sm text-slate-400 truncate">{song.artist}</p>
            </div>
            {/* Nếu muốn thêm phần trăm, bạn có thể thêm vào đây */}
            {/* <span className="font-bold text-white">{song.percentage}%</span> */}
        </div>
    );
};

export default ChartItem;