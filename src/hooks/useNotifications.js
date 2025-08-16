import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../shared/services/notificationService';
import { useAuth } from './useAuth';

export const useNotifications = () => {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 1 });
    const [loading, setLoading] = useState(false);

    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const response = await notificationService.getUnreadCount();
            if (response.success) {
                setUnreadCount(response.data.count);
            }
        } catch (error) {
            console.error(error);
        }
    }, [isAuthenticated]);

    const fetchNotifications = useCallback(async (page = 0) => {
        if (!isAuthenticated || loading) return;
        setLoading(true);
        try {
            const response = await notificationService.getNotifications(page);
            if (response.success) {
                setNotifications(prev => page === 0 ? response.data.content : [...prev, ...response.data.content]);
                setPageInfo(response.data.pageInfo);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, loading]);

    const markNotificationAsRead = async (notificationId) => {
        try {
            setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            await notificationService.markAsRead(notificationId);
        } catch (error) {
            console.error(error);
            fetchUnreadCount(); // Lấy lại số lượng đúng nếu có lỗi
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            await notificationService.markAllAsRead();
        } catch (error) {
            console.error(error);
            fetchUnreadCount();
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 60000);
            return () => clearInterval(interval);
        } else {
            setUnreadCount(0);
            setNotifications([]);
        }
    }, [isAuthenticated, fetchUnreadCount]);

    return {
        notifications,
        unreadCount,
        loading,
        pageInfo,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        refreshCount: fetchUnreadCount
    };
};