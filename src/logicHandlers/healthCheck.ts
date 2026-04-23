import api from "../api/axios";

export const healthCheck = async () => {
    try {
        const response = await api.get("/health", {
            timeout: 10000 // 10 seconds timeout
        });
        return response.data;
    } catch (error) {
        console.error("Error checking health:", error);
        throw error;
    }
};