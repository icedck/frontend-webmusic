// File: src/modules/admin/components/CreateTagModal.jsx
import React, { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { adminService } from '../services/adminService';
import { toast } from 'react-toastify';
import { Plus, Trash2 } from 'lucide-react';

const TagRow = ({ tag, onUpdate, onRemove }) => (
    // START-CHANGE: Sử dụng Flexbox để căn chỉnh
    <div className="flex items-center gap-2">
        <div className="flex-grow">
            <Input
                value={tag.name}
                onChange={(e) => onUpdate(tag.id, e.target.value)}
                placeholder="Nhập tên tag..."
                className="!mb-0 w-full"
                required
            />
        </div>
        <div className="flex-shrink-0">
            <Button type="button" size="icon" variant="ghost" onClick={() => onRemove(tag.id)} className="text-red-500">
                <Trash2 size={16} />
            </Button>
        </div>
    </div>
    // END-CHANGE
);

const CreateTagModal = ({ isOpen, onClose, onSuccess }) => {
    const [tags, setTags] = useState([{ id: 1, name: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddRow = () => {
        setTags([...tags, { id: Date.now(), name: '' }]);
    };

    const handleUpdateRow = (id, newName) => {
        setTags(tags.map(tag => tag.id === id ? { ...tag, name: newName } : tag));
    };

    const handleRemoveRow = (id) => {
        if (tags.length > 1) {
            setTags(tags.filter(tag => tag.id !== id));
        } else {
            toast.info("Phải có ít nhất một tag.");
        }
    };

    const resetForm = () => {
        setTags([{ id: 1, name: '' }]);
        setIsSubmitting(false);
    };

    const handleClose = () => { resetForm(); onClose(); };
    const handleSuccess = () => { resetForm(); onSuccess(); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tagNames = tags.map(t => t.name.trim()).filter(name => name);
        if (tagNames.length === 0) {
            toast.error("Vui lòng nhập tên cho ít nhất một tag.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await adminService.createMultipleTags({ names: tagNames });
            if (response.success) {
                toast.success(response.message || "Tạo tags thành công!");
                handleSuccess();
            } else {
                toast.error(response.message || "Tạo tags thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Tạo Tag Mới">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {tags.map(tag => (
                        <TagRow key={tag.id} tag={tag} onUpdate={handleUpdateRow} onRemove={handleRemoveRow} />
                    ))}
                </div>
                <Button type="button" variant="outline" onClick={handleAddRow} className="w-full">
                    <Plus size={16} className="mr-2" /> Thêm Tag
                </Button>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {`Tạo (${tags.length}) Tags`}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateTagModal;