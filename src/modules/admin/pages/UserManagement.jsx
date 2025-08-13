import React, { useState, useEffect, useCallback } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { Search, Edit, Shield, Crown, User as UserIcon, Lock, Unlock, Star } from 'lucide-react';
import { adminService } from '../services/adminService';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import UpdateUserModal from '../components/UpdateUserModal';

const UserManagement = () => {
  const { currentTheme } = useDarkMode();
  const [users, setUsers] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, size: 5, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchUsers = useCallback(async (page, search) => {
    setLoading(true);
    try {
      const response = await adminService.getUsers(page, pageInfo.size, search);
      if (response.success) {
        setUsers(response.data.content);
        setPageInfo(response.data.pageInfo);
      } else {
        toast.error(response.message || "Không thể tải danh sách người dùng.");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [pageInfo.size]);

  useEffect(() => {
    fetchUsers(0, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchUsers]);

  const handlePageChange = (newPage) => {
    fetchUsers(newPage, debouncedSearchTerm);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const getRoleBadge = (roles) => {
    if (roles.includes('ROLE_ADMIN')) {
      return <span className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                <Shield className="w-3 h-3" /> Admin
            </span>;
    }
    if (roles.includes('ROLE_CREATOR')) {
      return <span className="bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                <Crown className="w-3 h-3" /> Creator
            </span>;
    }
    return <span className="bg-gray-100 dark:bg-gray-700/20 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
            <UserIcon className="w-3 h-3" /> User
        </span>;
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Quản lý người dùng</h1>
            <p className={`mt-2 ${currentTheme.textSecondary}`}>Quản lý thông tin và quyền hạn của người dùng</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
          />
        </div>

        <div className={`${currentTheme.bgCard} rounded-xl overflow-hidden border ${currentTheme.border}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${currentTheme.bg}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}>Người dùng</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}>SĐT</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}>Vai trò</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}>Trạng thái</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}>Thao tác</th>
              </tr>
              </thead>
              <tbody className={`${currentTheme.bgCard} divide-y divide-gray-200 dark:divide-gray-700`}>
              {loading ? (
                  <tr><td colSpan="5" className="text-center py-10">Đang tải...</td></tr>
              ) : (
                  users.map((user) => (
                      <tr key={user.id} className={`hover:${currentTheme.bg}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className={`flex items-center gap-2 text-sm font-medium ${currentTheme.text}`}>
                                {user.displayName}
                                {user.status === 'LOCKED' && <Lock className="w-3 h-3 text-red-500" title="Tài khoản bị khóa" />}
                              </div>
                              <div className={`text-sm ${currentTheme.textSecondary}`}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{user.phoneNumber || 'Chưa cập nhật'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.roles)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.premiumStatus === 'PREMIUM' ? (
                              <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                                    <Star className="w-3 h-3" /> Premium
                                                </span>
                          ) : (
                              <span className="bg-gray-100 dark:bg-gray-700/20 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                                    Free
                                                </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button size="sm" variant="ghost" onClick={() => handleEditUser(user)} className="text-music-600 hover:text-music-800">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
          {pageInfo.totalElements > 0 && (
              <div className={`p-4 flex items-center justify-between border-t ${currentTheme.border}`}>
                        <span className="text-sm">
                            Hiển thị {(pageInfo.page * pageInfo.size) + 1} - {Math.min((pageInfo.page + 1) * pageInfo.size, pageInfo.totalElements)} trên {pageInfo.totalElements} người dùng
                        </span>
                <div className="flex gap-2">
                  <Button onClick={() => handlePageChange(pageInfo.page - 1)} disabled={pageInfo.page === 0}>Trước</Button>
                  <Button onClick={() => handlePageChange(pageInfo.page + 1)} disabled={pageInfo.page >= pageInfo.totalPages - 1}>Sau</Button>
                </div>
              </div>
          )}
        </div>

        {isUpdateModalOpen && selectedUser && (
            <UpdateUserModal
                user={selectedUser}
                onClose={() => setIsUpdateModalOpen(false)}
                onUserUpdated={handleUserUpdated}
            />
        )}
      </div>
  );
};

export default UserManagement;