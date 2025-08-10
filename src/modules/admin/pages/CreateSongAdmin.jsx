import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { adminService } from '../services/adminService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import FileUpload from '../../../components/common/FileUpload';
import MultiSelect from '../../../components/common/MultiSelect';
import { toast } from 'react-toastify';

const CreateSongAdmin = () => {
    const navigate = useNavigate();
    const { currentTheme } = useDarkMode();
    const [formData, setFormData] = useState({ title: '', description: '', singerIds: [], tagIds: [], isPremium: false });
    const [audioFile, setAudioFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [availableSingers, setAvailableSingers] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [singersRes, tagsRes] = await Promise.all([
                    adminService.getAllApprovedSingers(),
                    adminService.getAllTags()
                ]);
                if (singersRes.success) setAvailableSingers(singersRes.data);
                if (tagsRes.success) setAvailableTags(tagsRes.data);
            } catch (err) {
                toast.error('Không thể tải dữ liệu ca sĩ hoặc thể loại.');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) {
            toast.error("Vui lòng nhập tên bài hát.");
            return;
        }
        if (formData.singerIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất một ca sĩ.");
            return;
        }
        if (!audioFile) {
            toast.error("Vui lòng chọn file audio.");
            return;
        }
        setLoading(true);

        const songRequest = { ...formData };
        const data = new FormData();
        data.append('songRequest', new Blob([JSON.stringify(songRequest)], { type: 'application/json' }));
        data.append('audioFile', audioFile);
        if (thumbnailFile) {
            data.append('thumbnailFile', thumbnailFile);
        }

        try {
            await adminService.createSongByAdmin(data);
            toast.success('Tạo bài hát thành công!');
            navigate('/admin/songs');
        } catch (err) {
            toast.error(err.response?.data?.message || "Đã có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Thêm bài hát mới</h1>
                <p className={`mt-2 ${currentTheme.textSecondary}`}>Điền thông tin chi tiết cho bài hát mới.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`p-8 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard} space-y-6`}>
                    <Input name="title" label="Tên bài hát *" value={formData.title} onChange={handleChange} required />
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mô tả</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            placeholder="Giới thiệu ngắn về bài hát..."
                            value={formData.description}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-lg ${currentTheme.bg} ${currentTheme.border} focus:border-music-500 focus:ring-music-500`}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MultiSelect label="Ca sĩ *" options={availableSingers} selected={formData.singerIds} onChange={(ids) => setFormData({...formData, singerIds: ids})} placeholder="Chọn ca sĩ..."/>
                        <MultiSelect label="Thể loại" options={availableTags} selected={formData.tagIds} onChange={(ids) => setFormData({...formData, tagIds: ids})} placeholder="Chọn thể loại..."/>
                    </div>
                </div>

                <div className={`p-8 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard} space-y-6`}>
                    <FileUpload label="File audio *" accept="audio/*" onFileChange={setAudioFile} />
                    <FileUpload label="Ảnh bìa" accept="image/*" onFileChange={setThumbnailFile} previewType="image" />
                </div>

                <div className={`p-8 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard} space-y-6`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="isPremium" className="font-medium text-slate-900 dark:text-slate-100">Bài hát Premium</label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Chỉ người dùng Premium mới có thể nghe.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="isPremium" name="isPremium" checked={formData.isPremium} onChange={handleChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-music-300 dark:peer-focus:ring-music-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-music-600"></div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => navigate('/admin/songs')}>Hủy</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo bài hát'}</Button>
                </div>
            </form>
        </div>
    );
};

export default CreateSongAdmin;