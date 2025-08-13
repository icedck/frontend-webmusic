import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { adminService } from '../services/adminService';
import { toast } from 'react-toastify';

const UpdateTagModal = ({ isOpen, onClose, tag, onSuccess }) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (tag) {
            setName(tag.name);
        }
    }, [tag, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Tên tag không được để trống.");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await adminService.updateTag(tag.id, { name });
            if (response.success) {
                // Đã xóa toast.success ở đây
                onSuccess(response.data);
            } else {
                toast.error(response.message || "Cập nhật tag thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!tag) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Chỉnh sửa Tag: ${tag.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Tên Tag Mới"
                    id="tagNameUpdate"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên tag mới..."
                    required
                />
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

export default UpdateTagModal;