import { apiService } from '../../../shared/services/apiService';

const fetchFormData = async () => {
    try {
        const [singersRes, tagsRes] = await Promise.all([
            apiService.get('/api/v1/singers/selectable'),
            apiService.get('/api/v1/tags')
        ]);

        const singers = Array.isArray(singersRes.data?.data) ? singersRes.data.data : [];
        const tags = Array.isArray(tagsRes.data?.data) ? tagsRes.data.data : [];

        return { singers, tags };
    } catch (error) {
        console.error("Failed to fetch form data:", error);
        return { singers: [], tags: [] };
    }
};

const getMySubmissions = async (page = 0, size = 10, keyword = '') => {
    try {
        const params = { page, size, keyword };
        const baseResponse = await apiService.get('/api/v1/submissions/my', { params });
        return baseResponse.data;
    } catch (error) {
        console.error("Failed to fetch submissions:", error);
        throw error;
    }
};

const createSubmission = async (formData) => {
    try {
        const response = await apiService.post('/api/v1/submissions', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response;
    } catch (error) {
        console.error("Failed to create submission:", error);
        throw error;
    }
};

const getSubmissionById = async (id) => {
    try {
        const response = await apiService.get(`/api/v1/submissions/${id}`);
        return response.data || null;
    } catch (error) {
        console.error(`Failed to fetch submission ${id}:`, error);
        throw error;
    }
};

const updateSubmission = async (id, formData) => {
    try {
        const response = await apiService.put(`/api/v1/submissions/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response;
    } catch (error) {
        console.error(`Failed to update submission ${id}:`, error);
        throw error;
    }
};

const withdrawSubmission = async (id) => {
    try {
        await apiService.delete(`/api/v1/submissions/${id}/withdraw`);
    } catch (error) {
        console.error(`Failed to withdraw submission ${id}:`, error);
        throw error;
    }
};


export const submissionService = {
    fetchFormData,
    createSubmission,
    getMySubmissions,
    getSubmissionById,
    updateSubmission,
    withdrawSubmission
};