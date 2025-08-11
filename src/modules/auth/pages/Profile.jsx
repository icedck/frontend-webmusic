import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../services/authService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const SettingsCard = ({ title, description, children }) => {
  const { isDarkMode } = useDarkMode();
  return (
      <div className={`rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/80'} backdrop-blur-lg`}>
        <div className="p-6">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{description}</p>
        </div>
        <div className="p-6 pt-0">
          {children}
        </div>
      </div>
  );
};

const Profile = () => {
  const { currentTheme } = useDarkMode();
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [formData, setFormData] = useState({ displayName: '', phoneNumber: '', dateOfBirth: '', gender: '' });

  const resetFormData = () => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
      });
    }
  };

  useEffect(() => {
    resetFormData();
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    resetFormData();
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);

    const dataToSubmit = {
      ...formData,
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender || null
    };

    try {
      const response = await authService.updateProfile(dataToSubmit);
      updateUser(response.data);
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Thông tin cá nhân</h1>
          <p className={`mt-2 ${currentTheme.textSecondary}`}>Quản lý thông tin công khai và chi tiết liên hệ của bạn.</p>
        </div>

        <SettingsCard title="Thông tin hiển thị" description="Cập nhật thông tin sẽ được hiển thị cho người khác.">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Tên hiển thị *" icon={User} name="displayName" value={formData.displayName} onChange={handleProfileChange} disabled={!isEditing} />
              <Input label="Email" icon={Mail} name="email" value={user?.email || ''} disabled />
              <Input label="Số điện thoại" icon={Phone} name="phoneNumber" value={formData.phoneNumber} onChange={handleProfileChange} disabled={!isEditing} placeholder="Chưa cập nhật" />
              <Input label="Ngày sinh" icon={Calendar} name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleProfileChange} disabled={!isEditing} />
            </div>
            {isEditing && (
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button type="button" variant="ghost" onClick={handleCancelEdit} disabled={profileLoading}>Hủy</Button>
                  <Button type="submit" disabled={profileLoading}>{profileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
                </div>
            )}
            {!isEditing && (
                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button onClick={() => setIsEditing(true)}>Chỉnh sửa thông tin</Button>
                </div>
            )}
          </form>
        </SettingsCard>
      </div>
  );
};

export default Profile;