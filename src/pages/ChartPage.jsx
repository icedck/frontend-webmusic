import React, { useState, useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';
import { musicService } from '../modules/music/services/musicService';
import ChartList from '../components/music/ChartList';
import Button from '../components/common/Button';
import { Play, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ChartPage = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playSong } = useAudio();

    useEffect(() => {
        const fetchChart = async () => {
            setLoading(true);
            try {
                const response = await musicService.getChart();
                if (response.success) {
                    setChartData(response.data);
                } else {
                    toast.error("Không thể tải bảng xếp hạng.");
                }
            } catch (error) {
                toast.error("Đã có lỗi xảy ra khi tải bảng xếp hạng.");
            } finally {
                setLoading(false);
            }
        };

        fetchChart();
    }, []);

    const handlePlayAll = () => {
        if (!chartData || chartData.length === 0) {
            toast.info("Bảng xếp hạng trống.");
            return;
        }
        const songList = chartData.map(entry => entry.song);
        playSong(songList[0], songList);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        #WebMusicChart
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Bảng xếp hạng được cập nhật hàng giờ.
                    </p>
                </div>
                <Button onClick={handlePlayAll} disabled={loading || chartData.length === 0}>
                    <Play className="mr-2 h-5 w-5" />
                    Phát tất cả
                </Button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                    </div>
                ) : (
                    <ChartList chartData={chartData} />
                )}
            </div>
        </div>
    );
};

export default ChartPage;