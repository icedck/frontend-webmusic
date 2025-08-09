import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Modal from '../../../components/common/Modal';
import { Search, Edit, Trash2, Shield, Crown } from 'lucide-react';

const UserManagement = () => {
  const { currentTheme } = useDarkMode();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock user data
  useEffect(() => {
    const fetchUsers = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const mockUsers = [
        {
          id: 1,
          fullName: 'Admin WebMusic',
          email: 'admin@webmusic.com',
          roles: ['ADMIN'],
          isPremium: true,
          avatar: null,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          fullName: 'Test User',
          email: 'user@webmusic.com',
          roles: ['USER'],
          isPremium: false,
          avatar: null,
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 3,
          fullName: 'Creator Example',
          email: 'creator@webmusic.com',
          roles: ['CREATOR'],
          isPremium: true,
          avatar: null,
          createdAt: '2024-02-01T00:00:00Z'
        }
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    };
    
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = (updatedUser) => {
    // Update the user in the list
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const getRoleBadge = (roles) => {
    if (roles.includes('ADMIN')) {
      return <span className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
        <Shield className="w-3 h-3" /> Admin
      </span>;
    }
    if (roles.includes('CREATOR')) {
      return <span className="bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
        <Crown className="w-3 h-3" /> Creator
      </span>;
    }
    return <span className="bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-medium">
      User
    </span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-music-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${currentTheme.text}`}>
            Quản lý người dùng
          </h1>
          <p className={`mt-2 ${currentTheme.textSecondary}`}>
            Quản lý thông tin và quyền hạn của người dùng
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <div className={`${currentTheme.bgCard} rounded-xl overflow-hidden border ${currentTheme.border}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${currentTheme.bg}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}>
                  Người dùng
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}>
                  Vai trò
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}>
                  Trạng thái
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className={`${currentTheme.bgCard} divide-y divide-gray-200 dark:divide-gray-700`}>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`hover:${currentTheme.bg}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-music-400 to-music-600 text-white">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          user.fullName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${currentTheme.text}`}>
                          {user.fullName}
                        </div>
                        <div className={`text-sm ${currentTheme.textSecondary}`}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.roles)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isPremium ? (
                      <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                        Premium
                      </span>
                    ) : (
                      <span className="bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-medium">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditUser(user)}
                      className="text-music-600 hover:text-music-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          title="Chỉnh sửa thông tin người dùng"
        >
          <UserEditForm
            user={selectedUser}
            onSave={handleSaveUser}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

const UserEditForm = ({ user, onSave, onCancel }) => {
  const { currentTheme } = useDarkMode();
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    roles: [...user.roles],
    isPremium: user.isPremium
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleRole = (role) => {
    setFormData(prev => {
      const roleExists = prev.roles.includes(role);
      const newRoles = roleExists
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      return {
        ...prev,
        roles: newRoles
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...user,
      ...formData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
          Họ tên
        </label>
        <Input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Nhập họ tên"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
          Email
        </label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Nhập email"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
          Vai trò
        </label>
        <div className="space-y-2">
          {['USER', 'CREATOR', 'ADMIN'].map(role => (
            <label key={role} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.roles.includes(role)}
                onChange={() => toggleRole(role)}
                className="text-music-500 focus:ring-music-500"
              />
              <span className={currentTheme.text}>{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isPremium"
            checked={formData.isPremium}
            onChange={handleChange}
            className="text-music-500 focus:ring-music-500"
          />
          <span className={currentTheme.text}>Premium</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
};

export default UserManagement;