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

const getSongDetails = async (songId) => {
    try {
        const response = await apiService.get(`/api/v1/songs/details/${songId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch song details for id ${songId}:`, error);
        throw error;
    }
};

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
        const response = await apiService.post('/api/v1/submissions', submissionData);
        return response.data;
    } catch (error) {
        console.error("Failed to submit new song:", error);
        throw error;
    }
};

const createPlaylist = async (formData) => {
    try {
        const response = await apiService.post('/api/v1/playlists', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getMyPlaylists = async () => {
    try {
        const response = await apiService.get('/api/v1/playlists/my-playlists');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getPlaylistById = async (id) => {
    try {
        const response = await apiService.get(`/api/v1/playlists/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch playlist with id ${id}:`, error);
        throw error;
    }
};

const searchSongsForPlaylist = async (keyword) => {
    try {
        const response = await apiService.get(`/api/v1/songs/search-for-playlist`, { params: { keyword } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const addSongsToPlaylist = async (playlistId, songIds) => {
    try {
        const response = await apiService.post(`/api/v1/playlists/${playlistId}/songs`, { songIds });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updatePlaylist = async (playlistId, formData) => {
    try {
        const response = await apiService.put(`/api/v1/playlists/${playlistId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deletePlaylist = async (playlistId) => {
    try {
        const response = await apiService.delete(`/api/v1/playlists/${playlistId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const removeSongFromPlaylist = async (playlistId, songId) => {
    try {
        const response = await apiService.delete(`/api/v1/playlists/${playlistId}/songs/${songId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const musicService = {
    getSongById,
    fetchSongSubmissionData,
    submitNewSong,
    getSongDetails,
    getQueue,
    createPlaylist,
    getMyPlaylists,
    getPlaylistById,
    searchSongsForPlaylist,
    addSongsToPlaylist,
    updatePlaylist,
    deletePlaylist,
    removeSongFromPlaylist
};