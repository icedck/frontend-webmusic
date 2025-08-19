import React from 'react';
import ChartItem from './ChartItem';
import { useAudio } from '../../hooks/useAudio';

const ChartList = ({ chartData = [] }) => {
    const { playSong } = useAudio();

    // Lọc ra các entry không hợp lệ (null, undefined, hoặc không có thuộc tính 'song')
    const validChartData = chartData ? chartData.filter(entry => entry && entry.song) : [];

    if (validChartData.length === 0) {
        return <p className="text-slate-400">Bảng xếp hạng đang được cập nhật...</p>;
    }

    const songList = validChartData.map(entry => entry.song);

    const handlePlaySong = (songToPlay) => {
        playSong(songToPlay, songList);
    };

    return (
        <div className="space-y-2">
            {/* Lặp qua mảng đã được lọc an toàn */}
            {validChartData.map((entry) => (
                <ChartItem
                    key={entry.song.id}
                    chartEntry={entry}
                    onPlay={() => handlePlaySong(entry.song)}
                />
            ))}
        </div>
    );
};

export default ChartList;