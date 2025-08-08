import React, { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

const RejectReasonModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (reason.trim()) {
            onConfirm(reason);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Lý do từ chối">
            <div className="space-y-4">
                <p>Vui lòng nhập lý do từ chối yêu cầu này.</p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows="4"
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800"
                    placeholder="Nhập lý do..."
                />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={onClose}>Hủy</Button>
                <Button variant="danger" onClick={handleConfirm} disabled={!reason.trim() || isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
                </Button>
            </div>
        </Modal>
    );
};

export default RejectReasonModal;