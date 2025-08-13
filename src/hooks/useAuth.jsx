import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from "../modules/auth/services/authService.js";
import { apiService } from '../shared/services/apiService.js'; // Import apiService

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const revalidateUser = useCallback(async () => {
    try {
      const token = authService.getStoredToken();
      if (!token) return;

      const response = await apiService.get('/api/v1/users/me');
      if (response.data?.success) {
        const freshUser = response.data.data;
        setUser(freshUser);
        authService.updateProfile(freshUser); // Cập nhật lại localStorage
      }
    } catch (error) {
      console.error("Failed to revalidate user:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
    }
  }, []);

  useEffect(() => {
    const token = authService.getStoredToken();
    const storedUser = authService.getStoredUser();

    if (token && storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      revalidateUser(); // Kiểm tra lại thông tin user mỗi khi tải lại trang
    }
    setLoading(false);
  }, [revalidateUser]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    revalidateUser, // <<< THÊM MỚI
    isAdmin: authService.isAdmin,
    isCreator: authService.isCreator,
    isPremium: authService.isPremium,
  };

  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading...</div>
        </div>
    );
  }

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};