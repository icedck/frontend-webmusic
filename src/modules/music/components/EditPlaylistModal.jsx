import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import FileUpload from '../../../components/common/FileUpload';
import { musicService } from '../services/musicService';
import { toast } from 'react-toastify';

export const EditPlaylistModal = ({ isOpen, onClose, playlist, onPlaylistUpdated }) => {
    const [name, setName] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    useEffect(() => {
        if (playlist) {
            setName(playlist.name);
            setThumbnailPreview(playlist.thumbnailPath ? `${API_BASE_URL}${playlist.thumbnailPath}` : '');
            setThumbnailFile(null);
        }
    }, [playlist, isOpen]);

    const handleFileChange = (file) => {
        if (file) {
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Tên playlist không được để trống.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        const requestData = { name };

        formData.append('request', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));

        if (thumbnailFile) {
            formData.append('thumbnailFile', thumbnailFile);
        }

        try {
            const response = await musicService.updatePlaylist(playlist.id, formData);
            if (response.success) {
                toast.success("Cập nhật playlist thành công!");
                onPlaylistUpdated(response.data);
                onClose();
            } else {
                toast.error(response.message || "Cập nhật playlist thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!playlist) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Chỉnh sửa playlist">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <FileUpload
                        onFileSelect={handleFileChange}
                        previewUrl={thumbnailPreview}
                        placeholderText="Chọn ảnh"
                        className="w-32 h-32 flex-shrink-0"
                    />
                    <div className="w-full">
                        <Input
                            label="Tên playlist"
                            id="playlistName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên playlist..."
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </Modal>
    );
};