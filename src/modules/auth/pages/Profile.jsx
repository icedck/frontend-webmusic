import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../services/authService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { User, Mail, Phone, Calendar, Lock, Eye, EyeOff } from 'lucide-react';
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
  const { user, updateUser, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [formData, setFormData] = useState({ displayName: '', phoneNumber: '', dateOfBirth: '', gender: '' });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmationPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 8) {
      toast.error('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmationPassword) {
      toast.error('Mật khẩu xác nhận không khớp.');
      return;
    }
    setPasswordLoading(true);
    try {
      await authService.changePassword(passwordData);
      toast.success('Đổi mật khẩu thành công! Bạn sẽ được đăng xuất sau 3 giây.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmationPassword: '' });
      setTimeout(() => logout(), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Cài đặt tài khoản</h1>
          <p className={`mt-2 ${currentTheme.textSecondary}`}>Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.</p>
        </div>

        <SettingsCard title="Thông tin cá nhân" description="Cập nhật thông tin công khai và chi tiết liên hệ của bạn.">
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

        <SettingsCard title="Bảo mật" description="Thay đổi mật khẩu để giữ an toàn cho tài khoản của bạn.">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <Input label="Mật khẩu hiện tại" icon={Lock} name="currentPassword" type={showPasswords.current ? 'text' : 'password'} value={passwordData.currentPassword} onChange={handlePasswordChange} disabled={passwordLoading} />
              <button type="button" className={`absolute bottom-3 right-3 ${currentTheme.textSecondary}`} onClick={() => togglePasswordVisibility('current')}>{showPasswords.current ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
            </div>
            <div className="relative">
              <Input label="Mật khẩu mới" icon={Lock} name="newPassword" type={showPasswords.new ? 'text' : 'password'} value={passwordData.newPassword} onChange={handlePasswordChange} disabled={passwordLoading} />
              <button type="button" className={`absolute bottom-3 right-3 ${currentTheme.textSecondary}`} onClick={() => togglePasswordVisibility('new')}>{showPasswords.new ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
            </div>
            <div className="relative">
              <Input label="Xác nhận mật khẩu mới" icon={Lock} name="confirmationPassword" type={showPasswords.confirm ? 'text' : 'password'} value={passwordData.confirmationPassword} onChange={handlePasswordChange} disabled={passwordLoading} />
              <button type="button" className={`absolute bottom-3 right-3 ${currentTheme.textSecondary}`} onClick={() => togglePasswordVisibility('confirm')}>{showPasswords.confirm ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
            </div>
            <div className="flex justify-between items-center pt-4">
              <Link to="/forgot-password" className="text-sm font-medium text-music-500 hover:text-music-600 hover:underline">
                Quên mật khẩu?
              </Link>
              <Button type="submit" disabled={passwordLoading}>{passwordLoading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}</Button>
            </div>
          </form>
        </SettingsCard>
      </div>
  );
};

export default Profile;