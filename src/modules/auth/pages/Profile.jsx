// src/modules/auth/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../services/authService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { User, Mail, Phone, Calendar, Save, X, Users } from 'lucide-react';

const Profile = () => {
  const { currentTheme } = useDarkMode();
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updateData = {
      displayName: formData.displayName,
      phoneNumber: formData.phoneNumber || null,
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender || null,
    };
    try {
      const response = await authService.updateProfile(updateData);
      updateUser(response.data);
      setSuccessMessage('Cập nhật thông tin thành công!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Update profile error:', error);
      const errorData = error.response?.data;
      setServerError(errorData?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
      });
    }
    setErrors({});
    setServerError('');
    setIsEditing(false);
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${currentTheme.text}`}>Thông tin cá nhân</h1>
            <p className={`mt-1 ${currentTheme.textSecondary}`}>Xem và chỉnh sửa thông tin cá nhân của bạn.</p>
          </div>
          {!isEditing && <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>}
        </div>

        {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-600 dark:text-green-400 text-sm">✅ {successMessage}</p>
            </div>
        )}
        {serverError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{serverError}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Tên hiển thị */}
            <div>
              <label className={`flex items-center text-sm font-medium ${currentTheme.text} mb-2`}>
                <User className="w-4 h-4 mr-2" /> Tên hiển thị *
              </label>
              <Input name="displayName" type="text" value={formData.displayName} onChange={handleChange} disabled={!isEditing} placeholder="Tên hiển thị của bạn" />
            </div>
            {/* Email */}
            <div>
              <label className={`flex items-center text-sm font-medium ${currentTheme.textSecondary} mb-2`}>
                <Mail className="w-4 h-4 mr-2" /> Email
              </label>
              <Input name="email" type="email" value={user?.email || ''} disabled placeholder="Email không thể thay đổi" />
            </div>
            {/* Số điện thoại */}
            <div>
              <label className={`flex items-center text-sm font-medium ${currentTheme.text} mb-2`}>
                <Phone className="w-4 h-4 mr-2" /> Số điện thoại
              </label>
              <Input name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} disabled={!isEditing} placeholder="Chưa cập nhật" />
            </div>
            {/* Ngày sinh */}
            <div>
              <label className={`flex items-center text-sm font-medium ${currentTheme.text} mb-2`}>
                <Calendar className="w-4 h-4 mr-2" /> Ngày sinh
              </label>
              <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} disabled={!isEditing} />
            </div>
            {/* Giới tính */}
            <div>
              <label className={`flex items-center text-sm font-medium ${currentTheme.text} mb-2`}>
                <Users className="w-4 h-4 mr-2" /> Giới tính
              </label>
              {isEditing ? (
                  <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full p-3 rounded-lg ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} border focus:ring-music-500 focus:border-music-500`}>
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
              ) : (
                  <Input value={formData.gender === 'Male' ? 'Nam' : formData.gender === 'Female' ? 'Nữ' : formData.gender === 'Other' ? 'Khác' : 'Chưa cập nhật'} disabled />
              )}
            </div>
          </div>

          {isEditing && (
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button type="button" variant="outline" onClick={handleCancel} disabled={loading} className="flex items-center space-x-2">
                  <X className="w-4 h-4" /> <span>Hủy</span>
                </Button>
                <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                  <Save className="w-4 h-4" /> <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </Button>
              </div>
          )}
        </form>
      </div>
  );
};

export default Profile;