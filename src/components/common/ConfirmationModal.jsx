import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({
                               isOpen,
                               onClose,
                               onConfirm,
                               title = "Xác nhận hành động",
                               message = "Bạn có chắc chắn muốn thực hiện hành động này?",
                               confirmText = "Xác nhận",
                               cancelText = "Hủy",
                               isLoading = false
                           }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {message}
                </p>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                    {cancelText}
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : confirmText}
                </Button>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;