import React, { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { adminService } from '../services/adminService';
import { User, Mail, Upload } from 'lucide-react';

const CreateSingerModal = ({ isOpen, onClose, onSuccess }) => { // <<< SỬA LỖI: Nhận `isOpen`
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        const singerRequest = { name, email };

        formData.append('singerRequest', new Blob([JSON.stringify(singerRequest)], { type: 'application/json' }));
        if (avatarFile) {
            formData.append('avatarFile', avatarFile);
        }

        try {
            await adminService.createSingerByAdmin(formData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Đã có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // <<< SỬA LỖI: Truyền `isOpen` xuống >>>
        <Modal title="Tạo ca sĩ mới" isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                    <label className="flex items-center text-sm font-medium mb-1"><User className="w-4 h-4 mr-2"/>Tên ca sĩ *</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label className="flex items-center text-sm font-medium mb-1"><Mail className="w-4 h-4 mr-2"/>Email *</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label className="flex items-center text-sm font-medium mb-1"><Upload className="w-4 h-4 mr-2"/>Ảnh đại diện</label>
                    <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} className="w-full text-sm"/>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateSingerModal;