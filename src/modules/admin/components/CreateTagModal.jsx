import React, { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { adminService } from '../services/adminService';
import { toast } from 'react-toastify';

const CreateTagModal = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Tên tag không được để trống.");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await adminService.createTag({ name });
            if (response.success) {
                // Đã xóa toast.success ở đây
                onSuccess(response.data);
                setName('');
            } else {
                toast.error(response.message || "Tạo tag thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tạo Tag Mới">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Tên Tag"
                    id="tagName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên tag..."
                    required
                />
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        Tạo
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateTagModal;