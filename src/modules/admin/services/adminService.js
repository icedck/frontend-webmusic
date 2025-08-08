import { apiService } from '../../../shared/services/apiService';

const getSingers = async (page = 0, size = 20, search = '') => {
    try {
        const timestamp = new Date().getTime();
        const response = await apiService.get(`/api/v1/singers/admin/all?page=${page}&size=${size}&search=${search}&_=${timestamp}`);
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

const getSongByIdForAdmin = async (songId) => {
    try {
        const response = await apiService.get(`/api/v1/songs/${songId}/creator`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch song ${songId} for admin:`, error);
        throw error;
    }
};

const updateSongByAdmin = async (songId, songData, audioFile, thumbnailFile) => {
    try {
        const formData = new FormData();
        formData.append('songRequest', new Blob([JSON.stringify(songData)], { type: 'application/json' }));
        if (audioFile) {
            formData.append('audioFile', audioFile);
        }
        if (thumbnailFile) {
            formData.append('thumbnailFile', thumbnailFile);
        }

        const response = await apiService.put(`/api/v1/songs/admin/${songId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update song ${songId}:`, error);
        throw error;
    }
};

const getPendingSubmissions = async (page = 0, size = 10) => {
    try {
        const response = await apiService.get(`/api/v1/submissions/pending?page=${page}&size=${size}`);
        const data = response.data;
        return data.content ? data.content : data;
    } catch (error) {
        console.error("Failed to fetch pending submissions:", error);
        throw error;
    }
};


const approveSubmission = async (submissionId) => {
    try {
        const response = await apiService.post(`/api/v1/submissions/${submissionId}/approve`);
        return response.data;
    } catch (error) {
        console.error(`Failed to approve submission ${submissionId}:`, error);
        throw error;
    }
};

const rejectSubmission = async (submissionId, reason) => {
    try {
        const response = await apiService.post(`/api/v1/submissions/${submissionId}/reject?reason=${encodeURIComponent(reason)}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to reject submission ${submissionId}:`, error);
        throw error;
    }
};

export const adminService = {
    getSingers,
    createSingerByAdmin,
    getAllApprovedSingers,
    getAllTags,
    createSongByAdmin,
    getSongs,
    getSongByIdForAdmin,
    updateSongByAdmin,
    getPendingSubmissions,
    approveSubmission,
    rejectSubmission,
};