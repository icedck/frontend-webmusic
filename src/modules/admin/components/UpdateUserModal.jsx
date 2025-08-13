import React, { useState } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import { adminService } from '../services/adminService';
import { toast } from 'react-toastify';

const UpdateUserModal = ({ user, onClose, onUserUpdated }) => {
    const { currentTheme } = useDarkMode();
    const [roles, setRoles] = useState(new Set(user.roles));
    const [isLoading, setIsLoading] = useState(false);

    const allRoles = ['ROLE_USER', 'ROLE_CREATOR'];

    const handleRoleChange = (role) => {
        const newRoles = new Set(roles);
        if (newRoles.has(role)) {
            if (newRoles.size > 1) { // Prevent removing the last role
                newRoles.delete(role);
            }
        } else {
            newRoles.add(role);
        }
        setRoles(newRoles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const dataToUpdate = {
                roles: Array.from(roles),
            };
            const response = await adminService.updateUser(user.id, dataToUpdate);
            if (response.success) {
                toast.success("Cập nhật người dùng thành công!");
                onUserUpdated(response.data);
                onClose();
            } else {
                toast.error(response.message || "Cập nhật thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Chỉnh sửa vai trò: ${user.displayName}`}>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                        Vai trò
                    </label>
                    <div className="space-y-2">
                        {allRoles.map(role => (
                            <label key={role} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={roles.has(role)}
                                    onChange={() => handleRoleChange(role)}
                                    className="h-4 w-4 text-music-600 border-gray-300 rounded focus:ring-music-500"
                                />
                                <span className={currentTheme.text}>{role.replace('ROLE_', '')}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={`flex justify-end space-x-3 pt-4 border-t ${currentTheme.border} -mx-6 px-6 pb-0`}>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default UpdateUserModal;