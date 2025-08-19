// File: src/modules/admin/pages/CreateSongAdmin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { adminService } from '../services/adminService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import FileUpload from '../../../components/common/FileUpload';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import { Loader2, X } from 'lucide-react';

// Component để quản lý việc tạo ca sĩ mới
const NewSingerInput = ({ singer, onUpdate, onRemove }) => {
    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onUpdate(singer.label, 'avatarFile', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleEmailChange = (e) => {
        onUpdate(singer.label, 'email', e.target.value);
    };

    return (
        <div className="flex items-center gap-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <div className="flex-shrink-0">
                <label className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-600 cursor-pointer overflow-hidden text-slate-400 hover:opacity-80 transition-opacity">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    {avatarPreview ? <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" /> : <span>Ảnh</span>}
                </label>
            </div>
            <div className="flex-grow grid grid-cols-2 gap-4">
                <Input
                    placeholder="Tên ca sĩ *"
                    value={singer.label}
                    disabled
                    className="!mb-0"
                />
                <Input
                    placeholder="Email (không bắt buộc)"
                    type="email"
                    value={singer.email || ''}
                    onChange={handleEmailChange}
                    className="!mb-0"
                />
            </div>
            <Button size="icon" variant="ghost" onClick={() => onRemove(singer.value)} className="text-red-500 flex-shrink-0">
                <X size={18} />
            </Button>
        </div>
    );
};

const CreateSongAdmin = () => {
    const navigate = useNavigate();
    const { currentTheme, isDarkMode } = useDarkMode();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedSingers, setSelectedSingers] = useState([]);
    const [newSingersData, setNewSingersData] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isPremium, setIsPremium] = useState(false);

    const [audioFile, setAudioFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);

    const [singerOptions, setSingerOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFetchingOptions, setIsFetchingOptions] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [singersRes, tagsRes] = await Promise.all([adminService.getAllApprovedSingers(), adminService.getAllTags()]);
                if (singersRes.success) setSingerOptions(Array.isArray(singersRes.data) ? singersRes.data.map(s => ({ value: s.id, label: s.name })) : []);
                if (tagsRes.success) setTagOptions(Array.isArray(tagsRes.data) ? tagsRes.data.map(t => ({ value: t.id, label: t.name })) : []);
            } catch (err) { toast.error('Không thể tải dữ liệu ca sĩ hoặc thể loại.'); } finally { setIsFetchingOptions(false); }
        };
        fetchData();
    }, []);

    const handleSingersChange = (selectedOptions) => {
        setSelectedSingers(selectedOptions);
        const newOnes = selectedOptions.filter(opt => opt.__isNew__);
        const existingNewData = newSingersData.filter(ns => newOnes.some(n => n.value === ns.value));
        const addedNew = newOnes
            .filter(n => !existingNewData.some(ed => ed.value === n.value))
            .map(n => ({ ...n, email: '', avatarFile: null }));
        setNewSingersData([...existingNewData, ...addedNew]);
    };

    // --- START: ADDED FUNCTION ---
    // Hàm xử lý khi chọn hoặc tạo mới một thể loại
    const handleTagsChange = (selectedOptions) => {
        setSelectedTags(selectedOptions);
        // Logic để tạo tag mới sẽ được xử lý trong handleSubmit
    };
    // --- END: ADDED FUNCTION ---

    const updateNewSingerData = (singerLabel, key, value) => {
        setNewSingersData(prev => prev.map(s => s.label === singerLabel ? { ...s, [key]: value } : s));
    };

    const removeNewSinger = (singerValue) => {
        setSelectedSingers(prev => prev.filter(s => s.value !== singerValue));
        setNewSingersData(prev => prev.filter(s => s.value !== singerValue));
    };

    const handleAudioFileChange = (file) => { setAudioFile(file); setAudioPreviewUrl(file ? URL.createObjectURL(file) : null); };
    const handleThumbnailFileChange = (file) => { setThumbnailFile(file); setThumbnailPreviewUrl(file ? URL.createObjectURL(file) : null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) return toast.error("Vui lòng nhập tên bài hát.");
        if (selectedSingers.length === 0) return toast.error("Vui lòng chọn hoặc tạo ít nhất một ca sĩ.");
        if (!audioFile) return toast.error("Vui lòng chọn file audio.");
        setLoading(true);

        const singerIds = selectedSingers.filter(s => !s.__isNew__).map(s => s.value);
        const newSingers = newSingersData.map(ns => ({
            name: ns.label,
            email: ns.email,
            avatarFileName: ns.avatarFile ? ns.avatarFile.name : null
        }));

        // --- START: MODIFIED LOGIC ---
        // Tách biệt các tag đã có và các tag mới cần tạo
        const tagIds = selectedTags.filter(t => !t.__isNew__).map(t => t.value);
        const newTags = selectedTags.filter(t => t.__isNew__).map(t => t.label);

        const songRequest = { title, description, singerIds, newSingers, tagIds, newTags, isPremium };
        // --- END: MODIFIED LOGIC ---

        const data = new FormData();
        data.append('songRequest', new Blob([JSON.stringify(songRequest)], { type: 'application/json' }));
        data.append('audioFile', audioFile);
        if (thumbnailFile) data.append('thumbnailFile', thumbnailFile);
        newSingersData.forEach(ns => {
            if (ns.avatarFile) {
                data.append('newSingerAvatars', ns.avatarFile, ns.avatarFile.name);
            }
        });

        try {
            await adminService.createSongByAdmin(data);
            toast.success('Tạo bài hát thành công!');
            navigate('/admin/songs');
        } catch (err) { toast.error(err.response?.data?.message || "Đã có lỗi xảy ra."); }
        finally { setLoading(false); }
    };

    const selectStyles = {
        control: (base, state) => ({ ...base, backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb', borderColor: state.isFocused ? '#22d3ee' : (isDarkMode ? '#374151' : '#d1d5db'), boxShadow: state.isFocused ? '0 0 0 1px #22d3ee' : 'none', '&:hover': { borderColor: '#22d3ee' } }),
        menu: (base) => ({ ...base, backgroundColor: isDarkMode ? '#1f2937' : 'white' }),
        option: (base, { isFocused, isSelected }) => ({ ...base, backgroundColor: isSelected ? '#06b6d4' : isFocused ? (isDarkMode ? '#374151' : '#e5e7eb') : 'transparent', color: isSelected ? 'white' : (isDarkMode ? '#d1d5db' : '#111827') }),
        multiValue: (base) => ({ ...base, backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }),
        multiValueLabel: (base) => ({ ...base, color: isDarkMode ? 'white' : '#111827' }),
        input: (base) => ({ ...base, color: isDarkMode ? 'white' : '#111827' }),
        placeholder: (base) => ({ ...base, color: isDarkMode ? '#6b7280' : '#9ca3af' }),
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Thêm bài hát mới</h1>
                <p className={`mt-2 ${currentTheme.textSecondary}`}>Điền thông tin chi tiết cho bài hát mới.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`p-8 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard} space-y-6`}>
                    <Input name="title" label="Tên bài hát " value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <textarea id="description" name="description" rows={4} placeholder="Giới thiệu ngắn về bài hát..." value={description} onChange={(e) => setDescription(e.target.value)} className={`w-full p-2 border rounded-lg ${currentTheme.bg} ${currentTheme.border} focus:border-cyan-500 focus:ring-cyan-500`} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ca sĩ *</label>
                            <CreatableSelect isMulti isClearable options={singerOptions} value={selectedSingers} onChange={handleSingersChange} placeholder="Chọn hoặc nhập tên ca sĩ mới..." formatCreateLabel={(inputValue) => `Thêm mới ca sĩ "${inputValue}"`} isLoading={isFetchingOptions} isDisabled={isFetchingOptions} styles={selectStyles} noOptionsMessage={() => 'Không tìm thấy ca sĩ'} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Thể loại</label>
                            {/* --- START: MODIFIED JSX --- */}
                            <CreatableSelect
                                isMulti
                                isClearable
                                options={tagOptions}
                                value={selectedTags}
                                onChange={handleTagsChange}
                                placeholder="Chọn hoặc tạo thể loại mới..."
                                formatCreateLabel={(inputValue) => `Thêm mới thể loại "${inputValue}"`}
                                isLoading={isFetchingOptions}
                                isDisabled={isFetchingOptions}
                                styles={selectStyles}
                                noOptionsMessage={() => 'Không tìm thấy thể loại'}
                            />
                            {/* --- END: MODIFIED JSX --- */}
                        </div>
                    </div>
                    {newSingersData.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200">Thông tin ca sĩ mới</h3>
                            {newSingersData.map(singer => (
                                <NewSingerInput key={singer.value} singer={singer} onUpdate={updateNewSingerData} onRemove={removeNewSinger} />
                            ))}
                        </div>
                    )}
                </div>

                <div className={`p-8 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard} space-y-6`}>
                    <FileUpload label="File audio *" accept="audio/*" onFileChange={handleAudioFileChange} fileName={audioFile?.name} previewType="audio" existingFileUrl={audioPreviewUrl} />
                    <FileUpload label="Ảnh bìa" accept="image/*" onFileChange={handleThumbnailFileChange} previewType="image" existingFileUrl={thumbnailPreviewUrl} fileName={thumbnailFile?.name} />
                </div>

                <div className={`p-8 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard} space-y-6`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="isPremium" className="font-medium text-slate-900 dark:text-slate-100">Bài hát Premium</label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Chỉ người dùng Premium mới có thể nghe.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="isPremium" name="isPremium" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => navigate('/admin/songs')}>Hủy</Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Đang tạo...' : 'Tạo bài hát'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateSongAdmin;