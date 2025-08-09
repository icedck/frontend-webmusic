import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
// import { useAudio } from '../../hooks/useAudio'; // Sẽ dùng sau
import { useDarkMode } from '../../hooks/useDarkMode';
import Button from '../common/Button';
import {
    Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Star, ChevronsRight,
    ChevronsLeft, Music, Heart, ListMusic, Volume2, MoreHorizontal, GripVertical
} from 'lucide-react';

const mockCurrentlyPlaying = {
    id: "1",
    title: "Waiting For You",
    albumArtUrl: "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/e/3/d/4/e3d4365751b9231365829a2491a13b99.jpg",
    duration: 262,
    artist: { id: "mono", name: "MONO" },
};

const mockQueue = [
    { id: "2", title: "Em là", artistName: "MONO", duration: 185, albumArtUrl: "https://via.placeholder.com/100/A78BFA/FFFFFF?text=EL" },
    { id: "3", title: "Từng Quen", artistName: "Wren Evans", duration: 210, albumArtUrl: "https://via.placeholder.com/100/F472B6/FFFFFF?text=TQ" },
    { id: "4", title: "À Lôi", artistName: "Double2T", duration: 187, albumArtUrl: "https://via.placeholder.com/100/60A5FA/FFFFFF?text=AL" },
    { id: "5", title: "See Tình", artistName: "Hoàng Thùy Linh", duration: 195, albumArtUrl: "https://via.placeholder.com/100/FBBF24/FFFFFF?text=ST" },
    { id: "6", title: "Chúng ta của tương lai", artistName: "Sơn Tùng M-TP", duration: 303, albumArtUrl: "https://via.placeholder.com/100/818CF8/FFFFFF?text=CT" },
];

const PremiumUpsellCard = () => {
    const { isDarkMode } = useDarkMode();

    return (
        <div className={`relative p-[1px] rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600`}>
            <div className={`w-full h-full rounded-[11px] p-3 flex items-center space-x-3 backdrop-blur-sm ${isDarkMode ? 'bg-slate-800/80 text-white' : 'bg-white/80 text-slate-800'}`}>
                <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-600">
                    <Star size={20} className="text-white" />
                </div>
                <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-sm truncate">Trải nghiệm Premium</h4>
                    <p className={`text-xs truncate ${isDarkMode ? 'opacity-80' : 'opacity-70'}`}>Không quảng cáo, chất lượng cao nhất.</p>
                </div>
                <Link to="/premium" className="flex-shrink-0 ml-auto">
                    <Button
                        size="sm"
                        className={`!rounded-full backdrop-blur-sm whitespace-nowrap ${isDarkMode ? '!bg-white/10 hover:!bg-white/20 !text-white' : '!bg-black/5 hover:!bg-black/10 !text-slate-800'}`}
                    >
                        Nâng cấp
                    </Button>
                </Link>
            </div>
        </div>
    );
};

const QueueItem = ({ song, isPlayingNow = false }) => {
    const { isDarkMode } = useDarkMode();
    const formattedDuration = (secs) => `${Math.floor(secs / 60)}:${('0' + Math.floor(secs % 60)).slice(-2)}`;

    return (
        <div className={`group flex items-center p-2 rounded-lg transition-colors ${isPlayingNow ? (isDarkMode ? 'bg-white/10' : 'bg-black/5') : 'hover:bg-white/5 dark:hover:bg-black/10'}`}>
            <GripVertical className="w-5 h-5 text-slate-500 cursor-grab mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={song.albumArtUrl} alt={song.title} className="w-10 h-10 rounded-md" />
            <div className="flex-1 min-w-0 mx-3">
                <p className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{song.title}</p>
                <p className={`text-sm truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{song.artistName || song.artist.name}</p>
            </div>
            <span className={`text-xs font-mono ml-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{formattedDuration(song.duration)}</span>
        </div>
    );
};

const PlayerSidebar = ({ isCollapsed, onToggle }) => {
    const { user, isPremium } = useAuth();
    const { currentTheme, isDarkMode } = useDarkMode();
    const { isPlaying, progress } = { isPlaying: true, progress: 45 };
    const [volume, setVolume] = useState(75);
    const [isVolumeOpen, setIsVolumeOpen] = useState(false);
    const song = mockCurrentlyPlaying;
    const queue = mockQueue;

    const [isShuffled, setIsShuffled] = useState(false);
    const [repeatMode, setRepeatMode] = useState('all'); // 'none', 'all', 'one'

    const handleCycleRepeat = () => {
        if (repeatMode === 'none') setRepeatMode('all');
        else if (repeatMode === 'all') setRepeatMode('one');
        else setRepeatMode('none');
    };

    const formattedDuration = (secs) => `${Math.floor(secs / 60)}:${('0' + Math.floor(secs % 60)).slice(-2)}`;

    return (
        <aside className={`relative flex-shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0' : 'w-80'}`}>
            <div className={`relative w-80 h-full overflow-hidden transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                <div className="absolute inset-0">
                    <img src={song.albumArtUrl} alt="Ambient background" className={`w-full h-full object-cover scale-110 filter blur-2xl ${isDarkMode ? 'brightness-[.4]' : 'brightness-100'}`} />
                    <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/40' : 'bg-white/20'}`}></div>
                </div>

                <div className="relative h-full flex flex-col p-4">
                    {!song ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
                            <Music className="w-10 h-10 mb-2" />
                            <p>Chưa có nhạc đang phát.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 flex flex-col min-h-0">
                                <h3 className={`text-lg font-bold mb-3 px-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Danh sách phát</h3>
                                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                                    <QueueItem song={song} isPlayingNow={true} />
                                    {queue.map(qSong => (
                                        <QueueItem key={qSong.id} song={qSong} />
                                    ))}
                                </div>
                            </div>

                            <div className={`relative mt-4 p-4 backdrop-blur-2xl border rounded-2xl transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/60 border-white/10' : 'bg-slate-50/60 border-black/10'}`}>
                                <button onClick={onToggle} className={`absolute -top-3 right-3 w-8 h-8 rounded-full transition-colors flex items-center justify-center ${isDarkMode ? 'bg-gray-800/80 hover:bg-gray-700/90 text-slate-300 hover:text-white' : 'bg-white/80 text-slate-700 hover:bg-slate-200 hover:text-black'}`}>
                                    <ChevronsRight size={20} />
                                </button>

                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <img src={song.albumArtUrl} className="w-14 h-14 rounded-md" />
                                        <div className="min-w-0">
                                            <p className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{song.title}</p>
                                            <Link to={`/artist/${song.artist.id}`} className={`text-sm hover:underline truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{song.artist.name}</Link>
                                        </div>
                                        <Button variant="ghost" size="icon" className="!w-9 !h-9 text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400">
                                            <Heart size={18} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="my-2">
                                    <div className="flex justify-center items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`!rounded-full ${isShuffled ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black')}`}
                                            onClick={() => setIsShuffled(prev => !prev)}
                                        >
                                            <Shuffle size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className={`!rounded-full ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'}`}><SkipBack size={22} /></Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className={`!w-14 !h-14 !rounded-full transition-colors ${isDarkMode ? 'bg-white hover:bg-slate-200 text-slate-900' : 'bg-slate-900 hover:bg-slate-700 text-white'}`}
                                        >
                                            {isPlaying
                                                ? <Pause size={24} className="fill-current" />
                                                : <Play size={24} className="fill-current ml-1" />
                                            }
                                        </Button>
                                        <Button variant="ghost" size="icon" className={`!rounded-full ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'}`}><SkipForward size={22} /></Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`!rounded-full relative ${repeatMode !== 'none' ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black')}`}
                                            onClick={handleCycleRepeat}
                                        >
                                            {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
                                            {repeatMode !== 'none' && <div className="absolute bottom-1 h-1 w-1 bg-current rounded-full"></div>}
                                        </Button>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{formattedDuration(song.duration * (progress / 100))}</span>
                                        <div className={`w-full group relative rounded-full h-1.5 cursor-pointer ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}>
                                            <div className={`h-1.5 rounded-full ${isDarkMode ? 'bg-white group-hover:bg-cyan-400' : 'bg-slate-800 group-hover:bg-blue-600'}`} style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{formattedDuration(song.duration)}</span>
                                    </div>
                                </div>
                                <div className={`flex justify-end items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <Button variant="ghost" size="icon" className="!w-9 !h-9 hover:!text-current dark:hover:!text-white"><ListMusic size={18} /></Button>
                                    <div className="relative">
                                        <Button variant="ghost" size="icon" className="!w-9 !h-9 hover:!text-current dark:hover:!text-white" onClick={() => setIsVolumeOpen(v => !v)}><Volume2 size={18} /></Button>
                                        {isVolumeOpen && (
                                            <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-2 rounded-lg backdrop-blur-2xl border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/60 border-white/10' : 'bg-slate-50/60 border-black/10'}`}>
                                                <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-20 h-1 accent-cyan-400" />
                                            </div>
                                        )}
                                    </div>
                                    <Button variant="ghost" size="icon" className="!w-9 !h-9 hover:!text-current dark:hover:!text-white"><MoreHorizontal size={18} /></Button>
                                </div>
                            </div>

                            {(!user || !isPremium()) && <div className="mt-4"><PremiumUpsellCard /></div>}
                        </>
                    )}
                </div>
            </div>

            {isCollapsed && (
                <button onClick={onToggle} className={`absolute top-1/2 -translate-y-1/2 -left-4 z-20 w-8 h-16 flex items-center justify-center backdrop-blur-md rounded-lg transition-all duration-200 ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-700/70 border border-white/10 text-slate-300 hover:text-white' : 'bg-slate-200/50 hover:bg-slate-300/70 border border-black/10 text-slate-600 hover:text-black'}`} aria-label="Mở trình phát nhạc">
                    <ChevronsLeft size={20} />
                </button>
            )}
        </aside>
    );
};

export default PlayerSidebar;