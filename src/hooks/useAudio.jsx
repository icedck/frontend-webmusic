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

  const { isAuthenticated, isPremium } = useAuth();
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

    audio.volume = 0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("Audio play failed:", error);
      });
    }

    const targetVolume = volume;
    const step = targetVolume / (FADE_DURATION / FADE_INTERVAL);

    fadeIntervalRef.current = setInterval(() => {
      const currentVolume = audio.volume;
      if (currentVolume < targetVolume) {
        audio.volume = Math.min(currentVolume + step, targetVolume);
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
      if (currentVolume > 0) {
        audio.volume = Math.max(currentVolume - step, 0);
      } else {
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

    fadeOut(() => {
      audio.src = UPSELL_AUDIO_URL;
      audio.load();
      audio.addEventListener('canplaythrough', fadeIn, { once: true });
    });
  }, [fadeOut, fadeIn]);

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
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    playSong(queue[nextIndex], queue, playContext);
  }, [queue, isShuffle, currentIndex, playContext]);

  const playSong = useCallback((song, playlist = [], context = {}) => {
    if (!song) return;

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

    clearFadeInterval();
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPreviewingRef.current) {
      musicService.incrementSongListenCount(song.id);
      if (context.playlistId) {
        musicService.incrementPlaylistListenCount(context.playlistId);
      }
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
      audio.load();
      audio.addEventListener('canplaythrough', fadeIn, { once: true });
    };

    if (isPlaying) {
      fadeOut(executePlay);
    } else {
      executePlay();
    }
  }, [API_BASE_URL, isPlaying, fadeIn, fadeOut, isAuthenticated, isPremium, navigate, playNext]);

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
        fadeIn();
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

  const removeFromQueue = (songId) => setQueue(prev => prev.filter(song => song.id !== songId));
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
    queue, currentIndex, loading, audioRef, playSong, togglePlay, playNext,
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