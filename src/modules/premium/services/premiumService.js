import { apiService } from "../../../shared/services/apiService";

const getSubscriptionPlans = async () => {
  try {
    const response = await apiService.get("/api/v1/subscriptions/plans");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch premium plans:", error);
    throw error;
  }
};

const createPayment = async (packageId, paymentMethod) => {
  try {
    const response = await apiService.post("/api/v1/subscriptions/create-payment", { packageId, paymentMethod });
    return response.data;
  } catch (error) {
    console.error(`Failed to create ${paymentMethod} payment URL:`, error);
    throw error;
  }
};

const getTransactionHistory = async (page = 0, size = 10) => {
  try {
    const response = await apiService.get('/api/v1/transactions/my', { params: { page, size } });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch transaction history:", error);
    throw error;
  }
};

export const premiumService = {
  getSubscriptionPlans,
  createPayment,
  getTransactionHistory,
};