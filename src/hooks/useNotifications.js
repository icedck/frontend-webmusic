import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService } from '../shared/services/notificationService';
import { useAuth } from './useAuth';

export const useNotifications = () => {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 1 });
    const [loading, setLoading] = useState(false);
    const fetchTimeoutRef = useRef(null);

    // Get read notifications from localStorage
    const getReadNotifications = useCallback(() => {
        try {
            const stored = localStorage.getItem('readNotifications');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }, []);

    // Save read notification to localStorage
    const saveReadNotification = useCallback((notificationId) => {
        try {
            const readNotifications = getReadNotifications();
            if (!readNotifications.includes(notificationId)) {
                readNotifications.push(notificationId);
                localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
            }
        } catch (error) {
            console.error('Failed to save read notification:', error);
        }
    }, [getReadNotifications]);

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

    const debouncedFetchUnreadCount = useCallback(() => {
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }
        fetchTimeoutRef.current = setTimeout(() => {
            fetchUnreadCount();
        }, 1000);
    }, [fetchUnreadCount]);

    const fetchNotifications = useCallback(async (page = 0) => {
        if (!isAuthenticated || loading) return;
        setLoading(true);
        try {
            const response = await notificationService.getNotifications(page);
            if (response.success && response.data) {
                const newNotifications = response.data.content || [];
                const readNotifications = getReadNotifications();
                
                // Apply localStorage read status to notifications
                const notificationsWithLocalState = newNotifications.map(notif => ({
                    ...notif,
                    isRead: notif.isRead || readNotifications.includes(notif.id)
                }));
                
                setNotifications(prev => page === 0 ? notificationsWithLocalState : [...prev, ...notificationsWithLocalState]);
                setPageInfo(response.data.pageInfo || { page: 0, totalPages: 1 });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, loading, getReadNotifications]);

    const markNotificationAsRead = async (notificationId) => {
        const originalNotifications = [...notifications];
        const originalUnreadCount = unreadCount;

        const notificationToUpdate = notifications.find(n => n.id === notificationId);
        if (!notificationToUpdate || notificationToUpdate.isRead) {
            return;
        }

        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        // Save to localStorage immediately
        saveReadNotification(notificationId);

        try {
            await notificationService.markAsRead(notificationId);
            // Refresh unread count after successful API call
            debouncedFetchUnreadCount();
        } catch (error) {
            console.error(error);
            // Rollback on error
            setNotifications(originalNotifications);
            setUnreadCount(originalUnreadCount);
        }
    };

    const markAllNotificationsAsRead = async () => {
        if (unreadCount === 0) return;

        const originalNotifications = [...notifications];
        const originalUnreadCount = unreadCount;

        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        
        // Save all unread notifications to localStorage
        const unreadNotifications = notifications.filter(n => !n.isRead);
        unreadNotifications.forEach(notif => saveReadNotification(notif.id));

        try {
            await notificationService.markAllAsRead();
            // Refresh notifications to get latest state from server
            setTimeout(() => {
                fetchNotifications(0);
                debouncedFetchUnreadCount();
            }, 500);
        } catch (error) {
            console.error(error);
            // Rollback on error
            setNotifications(originalNotifications);
            setUnreadCount(originalUnreadCount);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 60000);
            return () => {
                clearInterval(interval);
                if (fetchTimeoutRef.current) {
                    clearTimeout(fetchTimeoutRef.current);
                }
            };
        } else {
            setUnreadCount(0);
            setNotifications([]);
            // Clear localStorage when user logs out
            localStorage.removeItem('readNotifications');
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