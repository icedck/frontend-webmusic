import React, { useState, useCallback } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import FileUpload from '../../../components/common/FileUpload';
import Button from '../../../components/common/Button';
import { musicService } from '../services/musicService';
import { toast } from 'react-toastify';
import { Search, Plus, X, Music } from 'lucide-react';
import { useDebounce } from 'use-debounce';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const SearchResultItem = ({ song, onAdd }) => (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50">
        <div className="flex items-center gap-3 min-w-0">
            <img
                src={song.thumbnailPath ? `${API_BASE_URL}${song.thumbnailPath}` : `https://via.placeholder.com/40`}
                alt={song.title}
                className="w-10 h-10 rounded-md object-cover"
            />
            <div className="min-w-0">
                <p className="font-semibold truncate text-slate-800 dark:text-slate-100">{song.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{song.singers.map(s => s.name).join(', ')}</p>
            </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onAdd(song)} className="!px-2 !py-1">
            <Plus size={16} />
        </Button>
    </div>
);

const SelectedSongItem = ({ song, onRemove }) => (
    <div className="flex items-center justify-between p-2 rounded-md bg-slate-100 dark:bg-slate-700/50">
        <div className="flex items-center gap-3 min-w-0">
            <img
                src={song.thumbnailPath ? `${API_BASE_URL}${song.thumbnailPath}` : `https://via.placeholder.com/40`}
                alt={song.title}
                className="w-10 h-10 rounded-md object-cover"
            />
            <div className="min-w-0">
                <p className="font-semibold truncate text-slate-800 dark:text-slate-100">{song.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{song.singers.map(s => s.name).join(', ')}</p>
            </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onRemove(song.id)} className="!px-2 !py-1 !text-red-500">
            <X size={16} />
        </Button>
    </div>
);

export const CreatePlaylistModal = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    React.useEffect(() => {
        if (debouncedSearchTerm) {
            setIsSearching(true);
            musicService.searchSongsForPlaylist(debouncedSearchTerm)
                .then(response => {
                    if (response.success) {
                        const availableSongs = response.data.filter(song =>
                            !selectedSongs.some(selected => selected.id === song.id)
                        );
                        setSearchResults(availableSongs);
                    }
                })
                .catch(() => toast.error("Tìm kiếm bài hát thất bại."))
                .finally(() => setIsSearching(false));
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm, selectedSongs]);


    const addSong = (song) => {
        setSelectedSongs(prev => [...prev, song]);
        setSearchResults(prev => prev.filter(s => s.id !== song.id));
    };

    const removeSong = (songId) => {
        setSelectedSongs(prev => prev.filter(s => s.id !== songId));
    };

    const handleFileChange = (file) => {
        setImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Tên playlist không được để trống.');
            return;
        }
        setIsLoading(true);

        try {
            const formData = new FormData();
            const songIds = selectedSongs.map(s => s.id);
            const requestData = { name, songIds };
            formData.append('request', JSON.stringify(requestData));

            if (imageFile) {
                formData.append('thumbnailFile', imageFile);
            }

            const response = await musicService.createPlaylist(formData);

            if (response && response.success) {
                onSuccess(response.data);
                onClose();
            } else {
                toast.error(response?.message || 'Có lỗi xảy ra.');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Tạo playlist thất bại.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tạo playlist mới" size="lg">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    {/* Cột trái: Thông tin playlist & Bài hát đã chọn */}
                    <div className="space-y-6">
                        <Input
                            label="Tên playlist"
                            id="playlist-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên playlist của bạn"
                            required
                        />
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Ảnh đại diện (không bắt buộc)
                            </label>
                            <FileUpload onFileChange={handleFileChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                Các bài hát đã chọn ({selectedSongs.length})
                            </label>
                            <div className="max-h-40 overflow-y-auto space-y-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                                {selectedSongs.length > 0 ? (
                                    selectedSongs.map(song => <SelectedSongItem key={song.id} song={song} onRemove={removeSong} />)
                                ) : (
                                    <p className="text-sm text-center py-4 text-slate-400">Chưa có bài hát nào được chọn.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Cột phải: Tìm kiếm và thêm bài hát */}
                    <div className="space-y-4">
                        <Input
                            label="Thêm bài hát vào playlist"
                            id="song-search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm theo tên bài hát..."
                            icon={<Search size={18} />}
                        />
                        <div className="h-80 overflow-y-auto space-y-2 p-2 border dark:border-slate-700 rounded-lg">
                            {isSearching && <p className="text-center text-slate-400">Đang tìm...</p>}
                            {!isSearching && searchResults.length > 0 && (
                                searchResults.map(song => <SearchResultItem key={song.id} song={song} onAdd={addSong} />)
                            )}
                            {!isSearching && debouncedSearchTerm && searchResults.length === 0 && (
                                <p className="text-center text-slate-400">Không tìm thấy kết quả.</p>
                            )}
                            {!isSearching && !debouncedSearchTerm && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                                    <Music size={32} />
                                    <p className="mt-2">Nhập để tìm kiếm bài hát</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                        Lưu playlist
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                </div>
            </form>
        </Modal>
    );
};