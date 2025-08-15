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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Chỉ chạy một lần khi component được mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);

        // Revalidate user in background without causing re-renders
        try {
          apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await apiService.get('/api/v1/users/me');
          if (response.data?.success) {
            const freshUser = response.data.data;
            setUser(freshUser);
            localStorage.setItem('authUser', JSON.stringify(freshUser));
          }
        } catch (error) {
          if (error.response?.status === 401 || error.response?.status === 403) {
            logout();
          }
        }
      }
      setLoading(false);
    }
    initializeAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserContext = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('authUser', JSON.stringify(updatedUserData));
  }

  const revalidateUser = useCallback(async () => {
    try {
      const token = authService.getStoredToken();
      if (!token) return;

      apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await apiService.get('/api/v1/users/me');
      if (response.data?.success) {
        const freshUser = response.data.data;
        setUser(freshUser);
        localStorage.setItem('authUser', JSON.stringify(freshUser));
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUserContext,
    isAdmin: authService.isAdmin,
    isCreator: authService.isCreator,
    isPremium: authService.isPremium,
    revalidateUser,
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