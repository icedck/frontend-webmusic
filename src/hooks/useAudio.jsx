import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { musicService } from '../modules/music/services/musicService';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [playContext, setPlayContext] = useState({});

  const isPreviewingRef = useRef(false);
  const isPlayingUpsellRef = useRef(false);

  const { isAuthenticated, isPremium, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const UPSELL_AUDIO_URL = '/audio/premium_upsell.mp3';

  const FADE_DURATION = 300;
  const FADE_INTERVAL = 30;

  const clearFadeInterval = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const fadeIn = useCallback(() => {
    clearFadeInterval();
    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {});
    }

    if (audio.volume >= volume) return;

    const targetVolume = volume;
    let currentVolume = audio.volume;
    const step = targetVolume / (FADE_DURATION / FADE_INTERVAL);

    fadeIntervalRef.current = setInterval(() => {
      currentVolume += step;
      if (currentVolume < targetVolume) {
        audio.volume = currentVolume;
      } else {
        audio.volume = targetVolume;
        clearFadeInterval();
      }
    }, FADE_INTERVAL);
  }, [volume]);


  const fadeOut = useCallback((onComplete) => {
    clearFadeInterval();
    const audio = audioRef.current;
    if (!audio || audio.volume === 0) {
      if(onComplete) onComplete();
      return;
    }
    const startVolume = audio.volume;
    const step = startVolume / (FADE_DURATION / FADE_INTERVAL);
    fadeIntervalRef.current = setInterval(() => {
      const currentVolume = audio.volume;
      if (currentVolume > step) {
        audio.volume -= step;
      } else {
        audio.volume = 0;
        clearFadeInterval();
        if (onComplete) onComplete();
      }
    }, FADE_INTERVAL);
  }, []);

  const stopAndClearPlayer = useCallback(() => {
    fadeOut(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setCurrentSong(null);
      setQueue([]);
      setCurrentIndex(-1);
      setCurrentTime(0);
      setDuration(0);
      isPreviewingRef.current = false;
      isPlayingUpsellRef.current = false;
    });
  }, [fadeOut]);

  const playUpsellAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    isPlayingUpsellRef.current = true;
    audio.volume = 0;

    fadeOut(() => {
      audio.src = UPSELL_AUDIO_URL;
      audio.load();
      const playAfterLoad = () => {
        fadeIn();
        audio.removeEventListener('canplaythrough', playAfterLoad);
      };
      audio.addEventListener('canplaythrough', playAfterLoad);
    });
  }, [fadeOut, fadeIn]);


  const playSong = useCallback((song, playlist = [], context = {}) => {
    if (!song) return;

    if (authLoading) {
      toast.info("Đang xác thực, vui lòng chờ...");
      return;
    }

    isPreviewingRef.current = false;
    isPlayingUpsellRef.current = false;

    if (song.isPremium && !isAuthenticated) {
      toast.info('Đây là nội dung Premium. Vui lòng đăng nhập để nghe.');
      navigate('/login');
      return;
    }

    if (song.isPremium && isAuthenticated && !isPremium()) {
      isPreviewingRef.current = true;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (!isPreviewingRef.current) {
      musicService.incrementSongListenCount(song.id);
    }

    const executePlay = () => {
      setLoading(true);
      setCurrentSong(song);
      setPlayContext(context);

      if (playlist.length > 0) {
        setQueue(playlist);
        const index = playlist.findIndex(s => s.id === song.id);
        setCurrentIndex(index >= 0 ? index : 0);
      } else {
        const queueExists = queue.length > 0;
        const songInQueueIndex = queue.findIndex(s => s.id === song.id);
        if (queueExists && songInQueueIndex > -1) {
          setCurrentIndex(songInQueueIndex);
        } else {
          const newQueue = queueExists ? [...queue, song] : [song];
          setQueue(newQueue);
          setCurrentIndex(newQueue.length - 1);
        }
      }

      audio.src = `${API_BASE_URL}${song.filePath}`;
      audio.volume = 0;
      audio.load();

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          fadeIn();
        }).catch(error => {
          console.error("Autoplay was prevented:", error);
          setIsPlaying(false);
        });
      }
    };

    if (isPlaying) {
      fadeOut(executePlay);
    } else {
      executePlay();
    }
  }, [API_BASE_URL, isPlaying, fadeIn, fadeOut, isAuthenticated, isPremium, navigate, authLoading]);

  const playPlaylist = useCallback((playlistData) => {
    if (!playlistData || !playlistData.songs || playlistData.songs.length === 0) {
      toast.warn('Playlist này không có bài hát nào để phát.');
      return;
    }

    const firstSong = playlistData.songs[0];

    musicService.incrementPlaylistListenCount(playlistData.id);

    playSong(firstSong, playlistData.songs, { playlistId: playlistData.id });

  }, [playSong]);

  const playNext = useCallback(() => {
    if (isPlayingUpsellRef.current) return;
    if (queue.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
      if (queue.length > 1 && nextIndex === currentIndex) {
        nextIndex = (currentIndex + 1) % queue.length;
      }
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    playSong(queue[nextIndex], queue, playContext);
  }, [queue, isShuffle, currentIndex, playContext, playSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (isPreviewingRef.current && !isNaN(audio.duration) && audio.currentTime >= audio.duration * 0.15) {
        isPreviewingRef.current = false;
        playUpsellAudio();
      }
    };

    const handleEnded = () => {
      if (isPlayingUpsellRef.current) {
        isPlayingUpsellRef.current = false;
        playNext();
        return;
      }
      if (isRepeat) {
        audio.currentTime = 0;
        const playPromise = audio.play();
        if(playPromise) playPromise.catch(e => console.error(e));
      } else {
        playNext();
      }
    };

    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setLoading(true);
    const handleCanPlayThrough = () => setLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      clearFadeInterval();
    };
  }, [isRepeat, fadeIn, playNext, playUpsellAudio, navigate]);

  const togglePlay = () => {
    if (!audioRef.current || !currentSong || isPlayingUpsellRef.current) return;
    if (isPlaying) {
      fadeOut(() => {
        audioRef.current.pause();
      });
    } else {
      fadeIn();
    }
  };

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;
    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    }
    playSong(queue[prevIndex], queue, playContext);
  }, [queue, isShuffle, currentIndex, playSong, playContext]);

  const seekTo = (time) => {
    if (audioRef.current && !isPlayingUpsellRef.current) {
      const previewTimeLimit = duration * 0.15;
      if (isPreviewingRef.current && time > previewTimeLimit) {
        audioRef.current.currentTime = previewTimeLimit;
        setCurrentTime(previewTimeLimit);
        return;
      }
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      clearFadeInterval();
      audioRef.current.volume = newVolume;
    }
  };

  const toggleRepeat = () => setIsRepeat(prev => !prev);
  const toggleShuffle = () => setIsShuffle(prev => !prev);

  const addToQueue = (song) => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để sử dụng tính năng này.');
      navigate('/login');
      return;
    }

    const toastId = `add-queue-${song.id}`;

    if (queue.some(s => s.id === song.id)) {
      toast.info(`"${song.title}" đã có trong danh sách phát.`, { toastId });
      return;
    }

    setQueue(prev => [...prev, song]);
    toast.success(`Đã thêm "${song.title}" vào danh sách phát.`, { toastId });
  };

  const removeFromQueue = useCallback((songId) => {
    const removedIndex = queue.findIndex(song => song.id === songId);
    
    if (removedIndex === -1) {
      // Bài hát không tồn tại trong queue
      return;
    }

    const newQueue = queue.filter(song => song.id !== songId);
    const isRemovingCurrentSong = removedIndex === currentIndex;
    
    if (newQueue.length === 0) {
      // Nếu queue trống sau khi xóa
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setQueue([]);
      setCurrentSong(null);
      setCurrentIndex(-1);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      toast.success('Đã xóa bài hát khỏi danh sách phát.');
      return;
    }

    // Cập nhật queue trước
    setQueue(newQueue);
    
    if (isRemovingCurrentSong) {
      // Nếu xóa bài hát đang phát
      let nextIndex = removedIndex;
      
      // Nếu xóa bài cuối cùng, quay về bài đầu tiên
      if (removedIndex >= newQueue.length) {
        nextIndex = 0;
      }
      
      // Phát bài tiếp theo
      const nextSong = newQueue[nextIndex];
      setCurrentIndex(nextIndex);
      setCurrentSong(nextSong);
      
      // Phát bài mới
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = `${API_BASE_URL}/api/songs/${nextSong.id}/play`;
          if (isPlaying) {
            audioRef.current.play().catch(console.error);
          }
        }
      }, 100);
    } else if (removedIndex < currentIndex) {
      // Nếu xóa bài hát trước bài đang phát, giảm currentIndex
      setCurrentIndex(prev => prev - 1);
    }
    // Nếu xóa bài hát sau bài đang phát, không cần thay đổi currentIndex
    
    toast.success('Đã xóa bài hát khỏi danh sách phát.');
  }, [queue, currentIndex, isPlaying, audioRef, API_BASE_URL]);
  
  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(-1);
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const value = {
    currentSong, isPlaying, currentTime, duration, volume, isRepeat, isShuffle,
    queue, currentIndex, loading, audioRef, playSong, playPlaylist, togglePlay, playNext,
    playPrevious, seekTo, changeVolume, toggleRepeat, toggleShuffle,
    addToQueue, removeFromQueue, clearQueue, formatTime, stopAndClearPlayer
  };

  return (
      <AudioContext.Provider value={value}>
        {children}
        <audio ref={audioRef} crossOrigin="anonymous" preload="metadata" />
      </AudioContext.Provider>
  );
};