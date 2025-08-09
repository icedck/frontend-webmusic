import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAudio } from '../../hooks/useAudio';
import { useDarkMode } from '../../hooks/useDarkMode';
import Button from '../common/Button';
import {
    Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Star, ChevronsRight,
    ChevronsLeft, Music, Heart, ListMusic, Volume2, Volume1, VolumeX, MoreHorizontal, GripVertical
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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

const QueueItem = ({ song, isPlayingNow }) => {
    const { isDarkMode } = useDarkMode();
    const { formatTime } = useAudio();

    return (
        <div className={`group flex items-center p-2 rounded-lg transition-colors ${isPlayingNow ? (isDarkMode ? 'bg-white/10' : 'bg-black/5') : 'hover:bg-white/5 dark:hover:bg-black/10'}`}>
            <GripVertical className="w-5 h-5 text-slate-500 cursor-grab mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={`${API_BASE_URL}${song.thumbnailPath}`} alt={song.title} className="w-10 h-10 rounded-md" />
            <div className="flex-1 min-w-0 mx-3">
                <p className={`font-semibold truncate ${isPlayingNow ? 'text-cyan-400' : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>{song.title}</p>
                <p className={`text-sm truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {song.singers.map(s => s.name).join(', ')}
                </p>
            </div>
            {song.duration && (
                <span className={`text-xs font-mono ml-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{formatTime(song.duration)}</span>
            )}
        </div>
    );
};

const PlayerSidebar = ({ isCollapsed, onToggle }) => {
    const { user, isPremium } = useAuth();
    const { isDarkMode } = useDarkMode();
    const {
        currentSong, isPlaying, currentTime, duration, volume, isRepeat, isShuffle, queue,
        togglePlay, playNext, playPrevious, seekTo, changeVolume, toggleRepeat, toggleShuffle, formatTime
    } = useAudio();

    const [isVolumeOpen, setIsVolumeOpen] = useState(false);
    const progressBarRef = useRef(null);

    const handleSeek = (e) => {
        if (!progressBarRef.current || !duration) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const newTime = (clickX / width) * duration;
        seekTo(newTime);
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const VolumeIcon = () => {
        if (volume === 0) return <VolumeX size={18} />;
        if (volume < 0.5) return <Volume1 size={18} />;
        return <Volume2 size={18} />;
    };

    return (
        <aside className={`relative flex-shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0' : 'w-80'}`}>
            <div className={`relative w-80 h-full overflow-hidden transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                <div className="absolute inset-0">
                    {currentSong && <img src={`${API_BASE_URL}${currentSong.thumbnailPath}`} alt="Ambient background" className={`w-full h-full object-cover scale-110 filter blur-2xl transition-all duration-500 ${isDarkMode ? 'brightness-[.4]' : 'brightness-100'}`} />}
                    <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/40' : 'bg-white/20'}`}></div>
                </div>

                <div className="relative h-full flex flex-col p-4">
                    <button onClick={onToggle} className={`absolute top-4 right-4 w-8 h-8 rounded-full transition-colors flex items-center justify-center z-20 ${isDarkMode ? 'bg-gray-800/80 hover:bg-gray-700/90 text-slate-300 hover:text-white' : 'bg-white/80 text-slate-700 hover:bg-slate-200 hover:text-black'}`}>
                        <ChevronsRight size={20} />
                    </button>

                    {/* Empty State Wrapper */}
                    <div className={`absolute inset-4 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 transition-opacity duration-500 ease-in-out ${!currentSong ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <Music className="w-10 h-10 mb-2" />
                        <p className="font-semibold">Chưa có nhạc</p>
                        <p className="text-sm">Hãy chọn một bài hát để bắt đầu.</p>
                    </div>

                    {/* Player UI Wrapper */}
                    <div className={`h-full flex flex-col transition-opacity duration-500 ease-in-out ${currentSong ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="flex-1 flex flex-col min-h-0">
                            <h3 className={`text-lg font-bold mb-3 px-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Danh sách phát</h3>
                            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                                {queue.map(qSong => (
                                    <QueueItem key={qSong.id} song={qSong} isPlayingNow={currentSong?.id === qSong.id}/>
                                ))}
                            </div>
                        </div>

                        <div className={`relative mt-4 p-4 backdrop-blur-2xl border rounded-2xl transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/60 border-white/10' : 'bg-slate-50/60 border-black/10'}`}>
                            <div className="flex items-center gap-3">
                                {currentSong && <img src={`${API_BASE_URL}${currentSong.thumbnailPath}`} className="w-14 h-14 rounded-md flex-shrink-0" />}
                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentSong?.title}</p>
                                    <p className={`text-sm truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {currentSong?.singers.map(s => s.name).join(', ')}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" className="!w-9 !h-9 flex-shrink-0 text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400">
                                    <Heart size={18} />
                                </Button>
                            </div>

                            <div className="my-2">
                                <div className="flex justify-center items-center gap-4">
                                    <Button variant="ghost" size="icon" className={`!rounded-full ${isShuffle ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black')}`} onClick={toggleShuffle}><Shuffle size={18} /></Button>
                                    <Button onClick={playPrevious} variant="ghost" size="icon" className={`!rounded-full ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'}`}><SkipBack size={22} /></Button>
                                    <Button onClick={togglePlay} variant="secondary" size="icon" className={`!w-14 !h-14 !rounded-full transition-colors ${isDarkMode ? 'bg-white hover:bg-slate-200 text-slate-900' : 'bg-slate-900 hover:bg-slate-700 text-white'}`} >{isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}</Button>
                                    <Button onClick={playNext} variant="ghost" size="icon" className={`!rounded-full ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'}`}><SkipForward size={22} /></Button>
                                    <Button variant="ghost" size="icon" className={`!rounded-full relative ${isRepeat ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black')}`} onClick={toggleRepeat}>
                                        {isRepeat ? <Repeat1 size={20} /> : <Repeat size={20} />}
                                        {isRepeat && <div className="absolute bottom-1 h-1 w-1 bg-current rounded-full"></div>}
                                    </Button>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{formatTime(currentTime)}</span>
                                    <div ref={progressBarRef} onClick={handleSeek} className={`w-full group relative rounded-full h-1.5 cursor-pointer ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}>
                                        <div className={`h-1.5 rounded-full ${isDarkMode ? 'bg-white group-hover:bg-cyan-400' : 'bg-slate-800 group-hover:bg-blue-600'}`} style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{formatTime(duration)}</span>
                                </div>
                            </div>
                            <div className={`flex justify-end items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <Button variant="ghost" size="icon" className="!w-9 !h-9 hover:!text-current dark:hover:!text-white"><ListMusic size={18} /></Button>
                                <div className="relative"><Button variant="ghost" size="icon" className="!w-9 !h-9 hover:!text-current dark:hover:!text-white" onClick={() => setIsVolumeOpen(v => !v)}><VolumeIcon/></Button>{isVolumeOpen && (<div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-2 rounded-lg backdrop-blur-2xl border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/60 border-white/10' : 'bg-slate-50/60 border-black/10'}`}><input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => changeVolume(parseFloat(e.target.value))} className="w-20 h-1 accent-cyan-400" /></div>)}</div>
                                <Button variant="ghost" size="icon" className="!w-9 !h-9 hover:!text-current dark:hover:!text-white"><MoreHorizontal size={18} /></Button>
                            </div>
                        </div>

                        {(!user || !isPremium()) && <div className="mt-4"><PremiumUpsellCard /></div>}
                    </div>
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