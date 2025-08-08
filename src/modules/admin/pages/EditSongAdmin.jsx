import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { adminService } from '../services/adminService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { toast } from 'react-toastify';

const EditSongAdmin = () => {
    const { songId } = useParams();
    const navigate = useNavigate();
    const { currentTheme } = useDarkMode();

    const [formData, setFormData] = useState({ title: '', description: '', singerIds: [], tagIds: [], isPremium: false });
    const [availableSingers, setAvailableSingers] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!songId) return;
            setPageLoading(true);
            try {
                const [singersRes, tagsRes, songRes] = await Promise.all([
                    adminService.getAllApprovedSingers(),
                    adminService.getAllTags(),
                    adminService.getSongByIdForAdmin(songId)
                ]);

                if (singersRes.success) setAvailableSingers(singersRes.data);
                if (tagsRes.success) setAvailableTags(tagsRes.data);

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
                setError('Không thể tải dữ liệu.');
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, [songId]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
    const handleMultiSelect = (e, field) => setFormData({ ...formData, [field]: Array.from(e.target.selectedOptions, option => Number(option.value)) });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // <<< SỬA LỖI: Tạo đúng payload cho AdminUpdateSongRequest >>>
        const updateData = {
            title: formData.title,
            description: formData.description,
            singerIds: formData.singerIds,
            tagIds: formData.tagIds,
            isPremium: formData.isPremium
        };

        try {
            await adminService.updateSongByAdmin(songId, updateData);
            toast.success('Cập nhật bài hát thành công!');
            navigate('/admin/songs');
        } catch (err) {
            setError(err.response?.data?.message || "Đã có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <div className="text-center py-10">Đang tải...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Chỉnh sửa bài hát (Admin)</h1>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <label className="flex items-center space-x-2">
                    <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} />
                    <span>Premium</span>
                </label>
                <Button type="submit" disabled={loading}>{loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}</Button>
            </form>
        </div>
    );
};

export default EditSongAdmin;