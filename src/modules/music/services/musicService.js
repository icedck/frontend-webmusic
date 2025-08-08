import { apiService } from '../../../shared/services/apiService';

const getSongById = async (songId) => {
    try {
        const response = await apiService.get(`/api/v1/songs/${songId}`);
        return response.data; // Trả về BaseResponse
    } catch (error) {
        console.error(`Failed to fetch song with id ${songId}:`, error);
        throw error;
    }
};

const fetchSongSubmissionData = async () => {
    try {
        const [singersResponse, tagsResponse] = await Promise.all([
            apiService.get('/api/v1/singers/selectable'),
            apiService.get('/api/v1/tags')
        ]);
        return {
            singers: singersResponse.data || [],
            tags: tagsResponse.data || [],
        };
    } catch (error) {
        console.error("Failed to fetch song submission data:", error);
        throw error;
    }
};

const submitNewSong = async (submissionData) => {
    try {
        const response = await apiService.upload('/api/v1/submissions', submissionData); // Giả sử apiService có hàm upload
        return response.data;
    } catch (error) {
        console.error("Failed to submit new song:", error);
        throw error;
    }
};

export const musicService = {
    getSongById,
    fetchSongSubmissionData,
    submitNewSong,
};