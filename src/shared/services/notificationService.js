import { apiService } from './apiService';

const getNotifications = async (page = 0, size = 10) => {
    try {
        const response = await apiService.get('/api/v1/notifications', { params: { page, size } });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        throw error;
    }
};


const getUnreadCount = async () => {
    try {
        const response = await apiService.get('/api/v1/notifications/unread-count');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch unread notification count:", error);
        throw error;
    }
};

const markAsRead = async (notificationId) => {
    try {
        const response = await apiService.post(`/api/v1/notifications/${notificationId}/read`);
        return response.data;
    } catch (error) {
        console.error(`Failed to mark notification ${notificationId} as read:`, error);
        throw error;
    }
};

const markAllAsRead = async () => {
    try {
        const response = await apiService.post('/api/v1/notifications/read-all');
        return response.data;
    } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
        throw error;
    }
};

export const notificationService = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
};