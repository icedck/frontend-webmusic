import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { adminService } from '../services/adminService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { toast } from 'react-toastify';
import { Upload, Music, User as UserIcon, Tag, Type, Info } from 'lucide-react';

const EditSongAdmin = () => {
    const { songId } = useParams();
    const navigate = useNavigate();
    const { currentTheme } = useDarkMode();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        singerIds: [],
        tagIds: [],
        isPremium: false
    });
    const [audioFile, setAudioFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);

    const [availableSingers, setAvailableSingers] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!songId) {
                setError("ID bài hát không hợp lệ.");
                setPageLoading(false);
                return;
            }
            try {
                const [singersRes, tagsRes, songRes] = await Promise.all([
                    adminService.getAllApprovedSingers(),
                    adminService.getAllTags(),
                    adminService.getSongByIdForAdmin(songId)
                ]);

                if (singersRes.success && Array.isArray(singersRes.data)) {
                    setAvailableSingers(singersRes.data);
                }
                if (tagsRes.success && Array.isArray(tagsRes.data)) {
                    setAvailableTags(tagsRes.data);
                }

                if (songRes.success && songRes.data) {
                    const songData = songRes.data;
                    setFormData({
                        title: songData.title || '',
                        description: songData.description || '',
                        singerIds: songData.singers.map(s => s.id),
                        tagIds: songData.tags.map(t => t.id),
                        isPremium: songData.isPremium || false
                    });
                } else {
                    setError(songRes.message || "Không tìm thấy bài hát.");
                }

            } catch (err) {
                setError('Không thể tải dữ liệu bài hát.');
                console.error(err);
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, [songId]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
    const handleMultiSelect = (e, field) => setFormData({ ...formData, [field]: Array.from(e.target.selectedOptions, option => Number(option.value)) });
    const handleFileChange = (e, setFile) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const updateData = {
            title: formData.title,
            description: formData.description,
            singerIds: formData.singerIds,
            tagIds: formData.tagIds,
            isPremium: formData.isPremium
        };

        try {
            await adminService.updateSongByAdmin(songId, updateData, audioFile, thumbnailFile);
            toast.success('Cập nhật bài hát thành công!');
            navigate('/admin/songs');
        } catch (err) {
            setError(err.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật.");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <div className="text-center py-10">Đang tải dữ liệu chỉnh sửa...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Chỉnh sửa bài hát (Admin)</h1>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`${currentTheme.bgCard} p-6 rounded-xl border ${currentTheme.border}`}>
                    <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
                    <div>
                        <label className="flex items-center text-sm font-medium mb-1"><Type className="w-4 h-4 mr-2" />Tên bài hát *</label>
                        <Input name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="mt-4">
                        <label className="flex items-center text-sm font-medium mb-1"><Info className="w-4 h-4 mr-2" />Mô tả</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className={`w-full p-2 border rounded ${currentTheme.bg}`} rows="4" />
                    </div>
                </div>

                <div className={`${currentTheme.bgCard} p-6 rounded-xl border ${currentTheme.border}`}>
                    <h2 className="text-xl font-semibold mb-4">Ca sĩ & Thể loại</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label>Ca sĩ * (Chỉ hiển thị ca sĩ đã duyệt)</label>
                            <select multiple value={formData.singerIds} onChange={(e) => handleMultiSelect(e, 'singerIds')} className={`w-full h-40 p-2 border rounded ${currentTheme.bg}`} required>
                                {availableSingers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Thể loại</label>
                            <select multiple value={formData.tagIds} onChange={(e) => handleMultiSelect(e, 'tagIds')} className={`w-full h-40 p-2 border rounded ${currentTheme.bg}`}>
                                {availableTags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className={`${currentTheme.bgCard} p-6 rounded-xl border ${currentTheme.border}`}>
                    <h2 className="text-xl font-semibold mb-4">Tệp tin (Để trống nếu không thay đổi)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center text-sm font-medium mb-1"><Upload className="w-4 h-4 mr-2" />File audio</label>
                            <input type="file" accept="audio/*" onChange={(e) => handleFileChange(e, setAudioFile)} className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-music-100 file:text-music-700 hover:file:bg-music-200`}/>
                        </div>
                        <div>
                            <label className="flex items-center text-sm font-medium mb-1"><Music className="w-4 h-4 mr-2" />Ảnh bìa</label>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setThumbnailFile)} className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200`}/>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} className="h-4 w-4 text-music-500 rounded focus:ring-music-500" />
                        <span>Premium</span>
                    </label>
                    <Button type="submit" disabled={loading}>{loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}</Button>
                </div>
            </form>
        </div>
    );
};

export default EditSongAdmin;