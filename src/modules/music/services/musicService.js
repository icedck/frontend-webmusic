import { apiService } from '../../../shared/services/apiService';

const getSongById = async (songId) => {
    try {
        const response = await apiService.get(`/api/v1/songs/${songId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch song with id ${songId}:`, error);
        throw error;
    }
};

// <<< HÀM MỚI: Lấy dữ liệu đầy đủ cho trang PlayerPage >>>
const getSongDetails = async (songId) => {
    try {
        // API này nên trả về đầy đủ thông tin: audioUrl, lyrics, artist, album...
        const response = await apiService.get(`/api/v1/songs/details/${songId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch song details for id ${songId}:`, error);
        throw error;
    }
};

// <<< HÀM MỚI: Lấy danh sách phát tiếp theo >>>
const getQueue = async () => {
    try {
        const response = await apiService.get(`/api/v1/queue`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch queue:`, error);
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
        const response = await apiService.upload('/api/v1/submissions', submissionData);
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
    getSongDetails, // <<< Thêm hàm mới vào export
    getQueue,       // <<< Thêm hàm mới vào export
};