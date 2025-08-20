import React from 'react';
import ChartItem from './ChartItem';
import { useAudio } from '../../hooks/useAudio';
import { useDarkMode } from '../../hooks/useDarkMode';
import { TrendingUp, Music, Clock, Headphones, Heart } from 'lucide-react';

const ChartList = ({ chartData = [] }) => {
    const { playSong } = useAudio();
    const { isDarkMode } = useDarkMode();

    const validChartData = chartData ? chartData.filter(entry => entry && entry.song) : [];

    if (validChartData.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center">
                    <Music className="w-12 h-12 text-slate-400" />
                </div>
                <p className="text-slate-400 text-lg">Bảng xếp hạng đang được cập nhật...</p>
                <p className="text-slate-500 text-sm mt-2">Vui lòng quay lại sau</p>
            </div>
        );
    }

    const songList = validChartData.map(entry => entry.song);

    const handlePlaySong = (songToPlay) => {
        playSong(songToPlay, songList);
    };

    return (
        <div className="space-y-1">
            {/* Header */}
            <div className="z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
                <div className="grid grid-cols-[4rem_1rem_1fr_12rem_5rem_5rem_5rem_3rem] gap-4 items-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <div></div> {/* Rank change column */}
                    <div>BÀI HÁT</div>
                    <div className="hidden md:block">NGHỆ SĨ</div>
                    <div className="hidden md:block text-center"></div>
                    <div className="hidden md:flex items-center justify-center">
                        <Headphones className="w-4 h-4" />
                    </div>
                    <div className="hidden md:flex items-center justify-center">
                        <Heart className="w-4 h-4" />
                    </div>
                    <div></div> {/* Action button column */}
                </div>
            </div>

            {/* Chart Items */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {validChartData.map((entry, index) => (
                    <div key={entry.song.id} className="group">
                        <ChartItem
                            chartEntry={entry}
                            onPlay={() => handlePlaySong(entry.song)}
                            index={index}
                        />
                    </div>
                ))}
            </div>

            {/* Footer Stats */}
            <div className="px-6 py-8 bg-slate-50/50 dark:bg-slate-800/20 rounded-b-2xl border-t border-slate-200/50 dark:border-slate-700/50">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2">
                        <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                            {validChartData.length}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Bài hát trong chart</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                            {validChartData.reduce((total, entry) => total + (entry.song.listenCount || 0), 0).toLocaleString('vi-VN')}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Tổng lượt nghe</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                            {validChartData.reduce((total, entry) => total + (entry.song.likeCount || 0), 0).toLocaleString('vi-VN')}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Tổng lượt thích</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartList;