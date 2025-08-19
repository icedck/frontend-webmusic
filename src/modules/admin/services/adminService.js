import { apiService } from '../../../shared/services/apiService';

const getUsers = async (page = 0, size = 5, search = '') => {
    try {
        const params = { page, size, search };
        const response = await apiService.get('/api/v1/users/admin', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateUser = async (userId, data) => {
    try {
        const response = await apiService.put(`/api/v1/users/admin/${userId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getCreators = async (page = 0, size = 10, search = '') => {
    try {
        const params = { page, size, search };
        const response = await apiService.get('/api/v1/admin/creators', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getCreatorDetails = async (creatorId) => {
    try {
        const response = await apiService.get(`/api/v1/admin/creators/${creatorId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getSingers = async (page = 0, size = 5, search = '') => {
    try {
        const params = new URLSearchParams({
            page: page,
            size: size,
            sort: 'id,desc'
        });
        if (search) {
            params.append('search', search);
        }
        const response = await apiService.get(`/api/v1/singers/admin/all?${params.toString()}`);
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

const createMultipleSingersByAdmin = async (formData) => {
    try {
        const response = await apiService.post('/api/v1/singers/admin/batch', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create multiple singers:", error);
        throw error;
    }
};

const updateSingerByAdmin = async (singerId, singerRequest, avatarFile) => {
    const formData = new FormData();
    formData.append('singerRequest', new Blob([JSON.stringify(singerRequest)], { type: 'application/json' }));
    if (avatarFile) {
        formData.append('avatarFile', avatarFile);
    }
    try {
        const response = await apiService.put(`/api/v1/singers/admin/${singerId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteSingerByAdmin = async (singerId) => {
    try {
        const response = await apiService.delete(`/api/v1/singers/admin/${singerId}`);
        return response.data;
    } catch (error) {
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

const getTagsForAdmin = async (page = 0, size = 5, search = '') => {
    try {
        const params = { page, size };
        if (search) {
            params.search = search;
        }
        const response = await apiService.get('/api/v1/tags/admin', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getAllTags = async () => {
    try {
        const response = await apiService.get('/api/v1/tags');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all tags:", error);
        throw error;
    }
};

const createTag = async (data) => {
    try {
        const response = await apiService.post('/api/v1/tags/admin', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateTag = async (tagId, data) => {
    try {
        const response = await apiService.put(`/api/v1/tags/admin/${tagId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteTag = async (tagId) => {
    try {
        const response = await apiService.delete(`/api/v1/tags/admin/${tagId}`);
        return response.data;
    } catch (error) {
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

const getSongs = async (page = 0, size = 5, search = '') => {
    try {
        const params = new URLSearchParams({
            page: page,
            size: size,
            sort: 'id,desc'
        });
        if (search) {
            params.append('search', search);
        }
        const response = await apiService.get(`/api/v1/songs/admin/all?${params.toString()}`);
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

const toggleSongVisibility = async (songId) => {
    try {
        const response = await apiService.post(`/api/v1/songs/${songId}/toggle-visibility`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getSubmissions = async (params = {}) => {
    try {
        const response = await apiService.get('/api/v1/submissions/admin/all', { params });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch submissions:", error);
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

const getSubmissionDetails = async (submissionId) => {
    try {
        const response = await apiService.get(`/api/v1/submissions/${submissionId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch submission details for id ${submissionId}:`, error);
        throw error;
    }
};

const createMultipleTags = async (data) => {
    try {
        const response = await apiService.post('/api/v1/tags/admin/batch', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const adminService = {
    getUsers,
    updateUser,
    getCreators,
    getCreatorDetails,
    getSingers,
    createSingerByAdmin,
    createMultipleSingersByAdmin,
    updateSingerByAdmin,
    deleteSingerByAdmin,
    getAllApprovedSingers,
    getTagsForAdmin,
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
    createSongByAdmin,
    getSongs,
    getSongByIdForAdmin,
    updateSongByAdmin,
    toggleSongVisibility,
    getSubmissions,
    approveSubmission,
    rejectSubmission,
    createMultipleTags,
    getSubmissionDetails,
};