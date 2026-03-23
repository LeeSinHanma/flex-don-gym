import api from "../api/axios";

export const healthCheck = async () => {
    try {
        const response = await api.get("/health/db");
        return response.data;
    } catch (error) {
        console.error("Error checking health:", error);
        throw error;
    }
};