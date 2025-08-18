// src/modules/music/pages/PlayerPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useAudio } from '../../../hooks/useAudio';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { musicService } from '../services/musicService';
import Button from '../../../components/common/Button';
import PremiumUpsellCard from '../../premium/components/PremiumUpsellCard';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, ListMusic, Mic } from 'lucide-react';

// Giả lập dữ liệu, bạn sẽ thay thế bằng API call
const getMockSongData = (songId) => ({
    id: songId,
    title: "Waiting For You",
    audioUrl: "/mock-audio/waiting-for-you.mp3", // Cần có file audio mẫu trong public/
    albumArtUrl: "https://via.placeholder.com/500x500.png?text=WebMusic",
    duration: 262,
    lyrics: `[00:19.48]Em không hề vội vã\n[00:21.84]Anh chỉ cần một cành hoa\n[00:24.23]Mặc một chiếc váy trắng tinh khôi\n[00:26.79]Rồi em sẽ theo anh về nhà...`,
    artist: { id: "mono", name: "MONO" },
    album: { id: "22", name: "22" }
});

const getMockQueue = () => [
    { id: "2", title: "Em là", artistName: "MONO", duration: 185, albumArtUrl: "https://via.placeholder.com/100" },
    { id: "3", title: "Quên anh đi", artistName: "MONO", duration: 210, albumArtUrl: "https://via.placeholder.com/100" },
];

const PlayerPage = () => {
    const { songId } = useParams();
    const { user, isPremium } = useAuth();
    const { currentTheme } = useDarkMode();
    const { play, pause, isPlaying, progress, setAudioSrc } = useAudio();

    const [song, setSong] = useState(null);
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('queue'); // 'queue' or 'lyrics'

    useEffect(() => {
        const fetchSongData = async () => {
            setLoading(true);
            try {
                // TODO: Thay thế mock data bằng API call thật
                // const songData = await musicService.getSongDetails(songId);
                const songData = getMockSongData(songId);
                setSong(songData);
                setAudioSrc(songData.audioUrl);

                // const queueData = await musicService.getQueue();
                const queueData = getMockQueue();
                setQueue(queueData);

                setError(null);
            } catch (err) {
                setError("Không thể tải thông tin bài hát.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSongData();
    }, [songId, setAudioSrc]);

    if (loading) return <div className="text-center p-10">Đang tải trình phát nhạc...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!song) return <div className="text-center p-10">Không tìm thấy bài hát.</div>;

    const formattedDuration = (secs) => `${Math.floor(secs / 60)}:${('0' + Math.floor(secs % 60)).slice(-2)}`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cột trái: Player */}
            <div className="lg:col-span-2 space-y-6">
                <div className="relative w-full aspect-square max-w-xl mx-auto">
                    <img src={song.albumArtUrl} alt={song.title} className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-black/30" />
                </div>

                {/* Info & Controls */}
                <div className={`${currentTheme.bgCard} p-6 rounded-2xl border ${currentTheme.border}`}>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold">{song.title}</h1>
                            <Link to={`/artist/${song.artist.id}`} className={`${currentTheme.textSecondary} hover:${currentTheme.textPrimary}`}>
                                {song.artist.name}
                            </Link>
                        </div>
                        {/* Actions: like, add to playlist... */}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs font-mono">
                            <span>{formattedDuration(song.duration * (progress / 100))}</span>
                            <span>{formattedDuration(song.duration)}</span>
                        </div>
                    </div>

                    {/* Main Controls */}
                    <div className="flex justify-center items-center space-x-6 mt-4">
                        <Button variant="ghost" size="icon"><Shuffle /></Button>
                        <Button variant="ghost" size="icon"><SkipBack size={28} /></Button>
                        <Button size="lg" className="w-16 h-16 rounded-full" onClick={() => isPlaying ? pause() : play()}>
                            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1"/>}
                        </Button>
                        <Button variant="ghost" size="icon"><SkipForward size={28} /></Button>
                        <Button variant="ghost" size="icon"><Repeat /></Button>
                    </div>
                </div>
            </div>

            {/* Cột phải: Queue & Lyrics */}
            <div className="space-y-6">
                {!isPremium() && <PremiumUpsellCard />}

                <div className={`${currentTheme.bgCard} p-1 rounded-2xl border ${currentTheme.border}`}>
                    <div className="flex p-1 space-x-1">
                        <button onClick={() => setActiveTab('queue')} className={`w-1/2 p-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'queue' ? `${currentTheme.primary} text-white` : `${currentTheme.textSecondary} hover:${currentTheme.bgSecondary}`}`}>Danh sách phát</button>
                        <button onClick={() => setActiveTab('lyrics')} className={`w-1/2 p-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'lyrics' ? `${currentTheme.primary} text-white` : `${currentTheme.textSecondary} hover:${currentTheme.bgSecondary}`}`}>Lời bài hát</button>
                    </div>

                    <div className="p-4 max-h-[60vh] overflow-y-auto">
                        {activeTab === 'queue' && (
                            <div className="space-y-3">
                                <h3 className="font-semibold mb-2">Đang phát</h3>
                                <div className="flex items-center p-2 rounded-lg bg-slate-700/50">
                                    <img src={song.albumArtUrl} className="w-12 h-12 rounded-md object-cover mr-4" />
                                    <div>
                                        <p className="font-semibold">{song.title}</p>
                                        <p className="text-sm text-slate-400">{song.artist.name}</p>
                                    </div>
                                </div>
                                <h3 className="font-semibold pt-4">Tiếp theo</h3>
                                {queue.map(qSong => (
                                    <div key={qSong.id} className="flex items-center p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                                        <img src={qSong.albumArtUrl} className="w-12 h-12 rounded-md object-cover mr-4" />
                                        <div>
                                            <p className="font-semibold">{qSong.title}</p>
                                            <p className="text-sm text-slate-400">{qSong.artistName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'lyrics' && (
                            <div className="whitespace-pre-line font-semibold text-lg leading-loose text-center text-slate-300">
                                {song.lyrics || "Chưa có lời cho bài hát này."}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerPage;