import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { adminService } from '../services/adminService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

const CreateSongAdmin = () => {
    const navigate = useNavigate();
    const { currentTheme } = useDarkMode();
    const [formData, setFormData] = useState({ title: '', description: '', singerIds: [], tagIds: [], isPremium: false });
    const [audioFile, setAudioFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [availableSingers, setAvailableSingers] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
                setError('Không thể tải dữ liệu ca sĩ hoặc thể loại.');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
    const handleMultiSelect = (e, field) => setFormData({ ...formData, [field]: Array.from(e.target.selectedOptions, option => Number(option.value)) });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!audioFile) {
            setError("Vui lòng chọn file audio.");
            return;
        }
        setLoading(true);
        setError('');

        const songRequest = { ...formData };
        const data = new FormData();
        data.append('songRequest', new Blob([JSON.stringify(songRequest)], { type: 'application/json' }));
        data.append('audioFile', audioFile);
        if (thumbnailFile) {
            data.append('thumbnailFile', thumbnailFile);
        }

        try {
            await adminService.createSongByAdmin(data);
            alert('Tạo bài hát thành công!');
            navigate('/admin/songs');
        } catch (err) {
            setError(err.response?.data?.message || "Đã có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Thêm bài hát mới (Admin)</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500">{error}</p>}
                <Input name="title" label="Tên bài hát *" value={formData.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} className={`w-full p-2 border rounded ${currentTheme.bg}`} />
                <div>
                    <label>Ca sĩ * (Chỉ hiển thị ca sĩ đã duyệt)</label>
                    <select multiple value={formData.singerIds} onChange={(e) => handleMultiSelect(e, 'singerIds')} className={`w-full h-32 p-2 border rounded ${currentTheme.bg}`} required>
                        {availableSingers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label>Thể loại</label>
                    <select multiple value={formData.tagIds} onChange={(e) => handleMultiSelect(e, 'tagIds')} className={`w-full h-32 p-2 border rounded ${currentTheme.bg}`}>
                        {availableTags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <Input type="file" label="File audio *" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
                <Input type="file" label="Ảnh bìa" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} />
                <label><input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} /> Premium</label>
                <Button type="submit" disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo bài hát'}</Button>
            </form>
        </div>
    );
};

export default CreateSongAdmin;