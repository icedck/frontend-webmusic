import React from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ChartItem from './ChartItem'; // Import component mới
import { FaPlayCircle } from 'react-icons/fa'; // Import icon

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-lg">
                <p className="label text-slate-300">{`${label}`}</p>
                {payload.map((pld, index) => (
                    <div key={index} style={{ color: pld.color }}>
                        {`${pld.name}: ${pld.value}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const ChartList = ({ chartData, graphData }) => {
    // Chỉ lấy top 3 bài hát để hiển thị trong danh sách
    const topSongs = chartData.slice(0, 3);

    return (
        // === DÒNG ĐƯỢC THAY ĐỔI ===
        <div className="relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 overflow-hidden">
            <div className="flex items-center gap-3 mb-5">
                <a href="#" className="text-3xl font-bold text-white hover:text-sky-200 transition-colors">#WebMusicChart</a>
                <FaPlayCircle className="text-white text-3xl cursor-pointer hover:scale-110 transition-transform" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cột bên trái: Danh sách bài hát */}
                <div className="space-y-2">
                    {topSongs.map((song, index) => (
                        <ChartItem key={song.id} song={song} rank={index + 1} />
                    ))}
                    <div className="pt-4 text-center">
                        <button className="border border-white/50 rounded-full px-6 py-2 text-sm text-white font-semibold hover:bg-white/20 transition-colors">
                            Xem thêm
                        </button>
                    </div>
                </div>

                {/* Cột bên phải: Biểu đồ */}
                <div className="relative h-64 lg:h-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={graphData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <XAxis
                                dataKey="name"
                                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            {/* Tạo các đường <Line> động từ chartData */}
                            {chartData.slice(0, 3).map(song => (
                                <Line
                                    key={song.id}
                                    type="monotone"
                                    dataKey={song.id}
                                    name={song.title}
                                    stroke={song.color}
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 6, strokeWidth: 2, fill: song.color }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ChartList;