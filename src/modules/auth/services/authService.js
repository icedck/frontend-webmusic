import { apiService } from "../../../shared/services/apiService.js";

const getMe = async () => {
    try {
        const response = await apiService.get('/api/v1/users/me');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        if (error.response?.status === 401) {
            logout();
        }
        throw error;
    }
};

const handleLoginSuccess = async (token) => {
    localStorage.setItem('authToken', token);
    const userProfileResponse = await getMe();
    localStorage.setItem('authUser', JSON.stringify(userProfileResponse.data));
    return { token, user: userProfileResponse.data };
};

const register = async (userData) => {
    try {
        const response = await apiService.post('/api/v1/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error("Registration API call failed:", error);
        throw error;
    }
};

const login = async (credentials) => {
    try {
        const response = await apiService.post('/api/v1/auth/authenticate', credentials);
        const token = response.data?.data?.token;

        if (!token) {
            throw new Error("Login failed: Token not found in response.");
        }
        return await handleLoginSuccess(token);
    } catch (error)
    {
        console.error("Login API call failed:", error);
        throw error;
    }
};

const loginWithGoogle = async (idToken) => {
    try {
        const response = await apiService.post('/api/v1/auth/google', { idToken });
        const token = response.data?.data?.token;

        if (!token) {
            throw new Error("Google login failed: Token not found in response.");
        }
        return await handleLoginSuccess(token);
    } catch (error) {
        console.error("Google Login API call failed:", error);
        throw error;
    }
};

const forgotPassword = async (email) => {
    try {
        const response = await apiService.post('/api/v1/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        console.error("Forgot password API call failed:", error);
        throw error;
    }
};

const resetPassword = async (resetData) => {
    try {
        const response = await apiService.post('/api/v1/auth/reset-password', resetData);
        return response.data;
    } catch (error) {
        console.error("Reset password API call failed:", error);
        throw error;
    }
};

const verifyOtp = async (verifyData) => {
    try {
        const response = await apiService.post('/api/v1/auth/verify-otp', verifyData);
        return response.data;
    } catch (error) {
        console.error("Verify OTP API call failed:", error);
        throw error;
    }
};

const updateProfile = async (profileData) => {
    try {
        const response = await apiService.put('/api/v1/users/me', profileData);
        const updatedUser = response.data?.data;
        if (updatedUser) {
            localStorage.setItem('authUser', JSON.stringify(updatedUser));
        }
        return response.data;
    } catch (error) {
        console.error("Update profile API call failed:", error);
        throw error;
    }
};

const changePassword = async (passwordData) => {
    try {
        const response = await apiService.patch('/api/v1/users/me/password', passwordData);
        return response.data;
    } catch (error) {
        console.error("Change password API call failed:", error);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    window.location.href = '/login';
};

const getStoredUser = () => {
    try {
        const user = localStorage.getItem('authUser')
        return user ? JSON.parse(user) : null
    } catch (error) {
        console.error('Error parsing stored user:', error)
        return null
    }
};

const getStoredToken = () => {
    return localStorage.getItem('authToken');
};

const hasRole = (role) => {
    const user = getStoredUser();
    if (!user || !user.roles) return false;
    return user.roles.some(userRole => userRole.toLowerCase() === role.toLowerCase() || userRole.toLowerCase() === `role_${role.toLowerCase()}`);
};

const isAdmin = () => {
    return hasRole('ADMIN');
};

const isPremium = () => {
    const user = getStoredUser();
    return user?.isPremium || user?.subscription?.status === 'ACTIVE';
};

const isCreator = () => {
    return hasRole('CREATOR');
};

export const authService = {
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    getStoredUser,
    getStoredToken,
    hasRole,
    isAdmin,
    isPremium,
    isCreator,
    loginWithGoogle,
    forgotPassword,
    verifyOtp,
    resetPassword
};