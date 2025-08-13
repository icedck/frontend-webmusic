import { apiService } from "../../../shared/services/apiService";

const createMomoPayment = async (packageId) => {
    try {
        const response = await apiService.post('/api/v1/transactions/create-momo-payment', { packageId });
        return response.data;
    } catch (error) {
        console.error("Failed to create MoMo payment URL:", error);
        throw error;
    }
};

export const premiumService = {
    createMomoPayment,
};