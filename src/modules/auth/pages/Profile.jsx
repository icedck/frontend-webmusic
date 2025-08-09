import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../services/authService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { User, Mail, Phone, Calendar, Save, X, Users, Lock, Eye, EyeOff, Camera, Trash2 } from 'lucide-react';

// Component Card chung cho trang Cài đặt
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

// Component chính của trang
const Profile = () => {
  const { currentTheme } = useDarkMode();
  const { user, updateUser, logout } = useAuth();

  // States cho Profile
  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [formData, setFormData] = useState({ displayName: '', phoneNumber: '', dateOfBirth: '', gender: '' });

  // States cho Password
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmationPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.data);
      setProfileSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
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
    if (passwordData.newPassword !== passwordData.confirmationPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');
    try {
      await authService.changePassword(passwordData);
      setPasswordSuccess('Đổi mật khẩu thành công! Bạn sẽ được đăng xuất sau 3 giây.');
      setTimeout(() => logout(), 3000);
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
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

        {/* --- Card Thông tin cá nhân --- */}
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
                  <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} disabled={profileLoading}>Hủy</Button>
                  <Button type="submit" disabled={profileLoading}>{profileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
                </div>
            )}
            {!isEditing && (
                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button onClick={() => setIsEditing(true)}>Chỉnh sửa thông tin</Button>
                </div>
            )}
            {profileSuccess && <p className="text-sm text-green-500 mt-2 text-right">{profileSuccess}</p>}
            {profileError && <p className="text-sm text-red-500 mt-2 text-right">{profileError}</p>}
          </form>
        </SettingsCard>

        {/* --- Card Bảo mật --- */}
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
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={passwordLoading}>{passwordLoading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}</Button>
            </div>
            {passwordSuccess && <p className="text-sm text-green-500 mt-2 text-right">{passwordSuccess}</p>}
            {passwordError && <p className="text-sm text-red-500 mt-2 text-right">{passwordError}</p>}
          </form>
        </SettingsCard>
      </div>
  );
};

export default Profile;