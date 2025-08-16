import { apiService } from '../../../shared/services/apiService';

const getMyPublishedSongs = async (page = 0, size = 10, search = '') => {
    try {
        const params = new URLSearchParams({ page, size });
        if (search) {
            params.append('name', search);
        }
        const response = await apiService.get(`/api/v1/songs/my-library?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch published songs:", error);
        throw error;
    }
};

export const creatorService = {
    getMyPublishedSongs,
};