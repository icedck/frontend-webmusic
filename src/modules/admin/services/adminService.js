// src/modules/admin/services/adminService.js
import { apiService } from '../../../shared/services/apiService';

const getSingers = async (page = 0, size = 20, search = '') => {
    try {
        const response = await apiService.get(`/api/v1/singers/admin/all?page=${page}&size=${size}&search=${search}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch singers:", error);
        throw error;
    }
};

const createSingerByAdmin = async (formData) => {
    try {
        const response = await apiService.post('/api/v1/singers/admin', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create singer:", error);
        throw error;
    }
};

const getAllApprovedSingers = async () => {
    try {
        const response = await apiService.get('/api/v1/singers/list');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch approved singers:", error);
        throw error;
    }
};

const getAllTags = async () => {
    try {
        const response = await apiService.get('/api/v1/tags');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch tags:", error);
        throw error;
    }
};

const createSongByAdmin = async (formData) => {
    try {
        const response = await apiService.post('/api/v1/songs/admin', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create song by admin:", error);
        throw error;
    }
};

const getSongs = async (page = 0, size = 20, search = '') => {
    try {
        const response = await apiService.get(`/api/v1/songs/admin/all?page=${page}&size=${size}&search=${search}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch songs:", error);
        throw error;
    }
};

export const adminService = {
    getSingers,
    createSingerByAdmin,
    getAllApprovedSingers,
    getAllTags,
    createSongByAdmin,
    getSongs, // <<< Thêm vào export
};
