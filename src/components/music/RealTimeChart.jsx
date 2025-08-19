import React, { useState, useEffect, useRef } from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

const RealTimeChart = ({ chartData = [], selectedSongIndex = null, onSelectSong }) => {
    const { isDarkMode } = useDarkMode();
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

    useEffect(() => {
        const handleResize = () => {
            if (svgRef.current) {
                const rect = svgRef.current.getBoundingClientRect();
                setDimensions({
                    width: rect.width || 800,
                    height: 300
                });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!chartData || chartData.length === 0) {
        return (
            <div className="w-full h-80 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg text-slate-500 dark:text-slate-400">
                        Không có dữ liệu biểu đồ
                    </div>
                </div>
            </div>
        );
    }

    // Mock data for chart animation - in real app, this would come from historical data
    const generateMockChartPoints = (songIndex, totalSongs) => {
        const points = [];
        const hours = 24; // 24 hour periods
        const baseRank = songIndex + 1;
        
        for (let i = 0; i < hours; i++) {
            // Create some variation around the base rank
            const variation = Math.sin(i * 0.5) * (totalSongs * 0.1) + Math.random() * 2 - 1;
            const rank = Math.max(1, Math.min(totalSongs, baseRank + variation));
            points.push({
                x: (i / (hours - 1)) * dimensions.width,
                y: ((rank - 1) / (totalSongs - 1)) * (dimensions.height - 80) + 40,
                rank: Math.round(rank),
                time: `${String(i).padStart(2, '0')}:00`
            });
        }
        return points;
    };

    const createPath = (points) => {
        if (points.length < 2) return '';
        
        let path = `M ${points[0].x} ${points[0].y}`;
        
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            
            // Create smooth curves
            const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
            const cpy1 = prev.y;
            const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
            const cpy2 = curr.y;
            
            path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
        }
        
        return path;
    };

    const timeLabels = Array.from({ length: 13 }, (_, i) => {
        const hour = i * 2;
        return `${String(hour).padStart(2, '0')}:00`;
    });

    return (
        <div className="w-full h-80 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 relative overflow-hidden">
            {/* Background Grid */}
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                className="absolute inset-0"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="gridGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={isDarkMode ? "#475569" : "#cbd5e1"} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={isDarkMode ? "#475569" : "#cbd5e1"} stopOpacity="0.1" />
                    </linearGradient>
                    
                    {chartData.slice(0, 3).map((_, index) => (
                        <linearGradient key={index} id={`lineGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={
                                index === 0 ? "#06b6d4" : 
                                index === 1 ? "#8b5cf6" : 
                                "#f59e0b"
                            } stopOpacity="0.8" />
                            <stop offset="100%" stopColor={
                                index === 0 ? "#0891b2" : 
                                index === 1 ? "#7c3aed" : 
                                "#d97706"
                            } stopOpacity="0.6" />
                        </linearGradient>
                    ))}
                </defs>

                {/* Grid Lines */}
                {Array.from({ length: 6 }, (_, i) => (
                    <line
                        key={i}
                        x1="0"
                        y1={40 + (i * (dimensions.height - 80) / 5)}
                        x2={dimensions.width}
                        y2={40 + (i * (dimensions.height - 80) / 5)}
                        stroke="url(#gridGradient)"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                    />
                ))}

                {/* Chart Lines */}
                {chartData.slice(0, 3).map((entry, index) => {
                    const points = generateMockChartPoints(index, chartData.length);
                    const path = createPath(points);
                    const isSelected = selectedSongIndex === index;
                    
                    return (
                        <g key={entry.song.id}>
                            {/* Line */}
                            <path
                                d={path}
                                fill="none"
                                stroke={`url(#lineGradient${index})`}
                                strokeWidth={isSelected ? "4" : "3"}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transition-all duration-300"
                                style={{
                                    filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                                    opacity: selectedSongIndex !== null && !isSelected ? 0.3 : 1
                                }}
                            />
                            
                            {/* Data Points */}
                            {points.map((point, pointIndex) => (
                                <circle
                                    key={pointIndex}
                                    cx={point.x}
                                    cy={point.y}
                                    r={isSelected ? "6" : "4"}
                                    fill={
                                        index === 0 ? "#06b6d4" : 
                                        index === 1 ? "#8b5cf6" : 
                                        "#f59e0b"
                                    }
                                    stroke="white"
                                    strokeWidth="2"
                                    className="transition-all duration-300 cursor-pointer hover:r-8"
                                    style={{
                                        opacity: selectedSongIndex !== null && !isSelected ? 0.3 : 1
                                    }}
                                    onClick={() => onSelectSong && onSelectSong(index)}
                                />
                            ))}
                        </g>
                    );
                })}
            </svg>

            {/* Time Labels */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-6 text-xs text-slate-500 dark:text-slate-400">
                {timeLabels.map((time, index) => (
                    <span key={index}>{time}</span>
                ))}
            </div>

            {/* Legend/Current Playing */}
            {selectedSongIndex !== null && chartData[selectedSongIndex] && (
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <img 
                            src={chartData[selectedSongIndex].song.thumbnailPath ? 
                                `${import.meta.env.VITE_API_BASE_URL}${chartData[selectedSongIndex].song.thumbnailPath}` : 
                                'https://via.placeholder.com/40'
                            }
                            alt={chartData[selectedSongIndex].song.title}
                            className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate max-w-48">
                                {chartData[selectedSongIndex].song.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-48">
                                {chartData[selectedSongIndex].song.singers?.map(s => s.name).join(', ')}
                            </div>
                            <div className={`text-xs font-medium ${
                                selectedSongIndex === 0 ? 'text-cyan-600' :
                                selectedSongIndex === 1 ? 'text-purple-600' :
                                'text-amber-600'
                            }`}>
                                #{chartData[selectedSongIndex].rank} • 23%
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealTimeChart;
