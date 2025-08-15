import { apiService } from "../../../shared/services/apiService";

const createMomoPayment = async (packageId) => {
  try {
    const response = await apiService.post(
      "/api/v1/transactions/create-payment",
      { packageId }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create MoMo payment URL:", error);
    throw error;
  }
};

const createVnpayPayment = async (packageId) => {
  try {
    const response = await apiService.post(
      "/api/v1/transactions/create-vnpay-payment",
      { packageId }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create VNPay payment URL:", error);
    throw error;
  }
};

const getAvailablePackages = async () => {
  try {
    const response = await apiService.get("/api/v1/subscriptions/packages");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch premium packages:", error);
    throw error;
  }
};

export const premiumService = {
  createMomoPayment,
  getAvailablePackages,
  createVnpayPayment,
};
