import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from "../modules/auth/services/authService.js";
import { apiService } from '../shared/services/apiService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Loại bỏ isAuthenticated vì có thể suy ra từ `!!user`
  const [loading, setLoading] = useState(true); // Bắt đầu với loading = true

  // Gộp hàm xử lý user lại một chỗ
  const processUserData = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('authUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('authUser');
    }
  }

  // --- SỬA ĐỔI LỚN 1: Logic khởi tạo ---
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getStoredToken();

      if (token) {
        try {
          apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await apiService.get('/api/v1/users/me');
          if (response.data?.success) {
            const freshUser = response.data.data;
            processUserData(freshUser);
          } else {
            // Trường hợp API trả về success: false
            logout(); // Gọi hàm logout để dọn dẹp
          }
        } catch (error) {
          // Nếu token hết hạn hoặc không hợp lệ, dọn dẹp
          logout(); // Gọi hàm logout để dọn dẹp
        }
      }
      // Chỉ set loading thành false SAU KHI đã hoàn tất mọi việc
      setLoading(false);
    }
    initializeAuth();
  }, []); // Chỉ chạy một lần khi provider được mount

  // --- SỬA ĐỔI LỚN 2: Logic đăng nhập ---
  const login = (userData) => {
    // Không cần setLoading(true) ở đây vì trang login sẽ điều hướng
    // và toàn bộ app sẽ re-mount, useEffect ở trên sẽ xử lý.
    // Việc này giúp tránh nhấp nháy màn hình.
    processUserData(userData);
  };

  // Hàm logout được gọi ở nhiều nơi để dọn dẹp
  const logout = () => {
    authService.logout(); // Dọn dẹp token
    processUserData(null); // Dọn dẹp user state và localStorage
    delete apiService.defaults.headers.common['Authorization']; // Xóa header
  };

  const updateUserContext = (updatedUserData) => {
    setUser(prevUser => {
      const newUser = { ...prevUser, ...updatedUserData };
      localStorage.setItem('authUser', JSON.stringify(newUser));
      return newUser;
    });
  }

  const revalidateUser = useCallback(async () => {
    const token = authService.getStoredToken();
    if (!token) {
      logout();
      return;
    };

    setLoading(true); // Bắt đầu loading
    try {
      apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await apiService.get('/api/v1/users/me');
      if (response.data?.success) {
        processUserData(response.data.data);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false); // Kết thúc loading
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user, // Suy ra trực tiếp từ user
    loading,
    login,
    logout,
    updateUserContext,
    isAdmin: () => authService.isAdmin(user),
    isCreator: () => authService.isCreator(user),
    isPremium: () => user?.hasActiveSubscription || authService.isAdmin(user), // Sửa nhỏ: Admin luôn có quyền premium
    revalidateUser,
  };

  // --- SỬA ĐỔI LỚN 3: Bỏ màn hình loading toàn trang ---
  // Giờ đây, các component con sẽ tự xử lý trạng thái loading
  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};