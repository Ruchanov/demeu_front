import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const fetchUserProfile = async (token: string, profileId?: string) => {
    try {
        const url = profileId ? `${API_BASE_URL}/profiles/${profileId}/` : `${API_BASE_URL}/profiles/me/`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ User profile data:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Profile fetch error:", error);
        throw error.response?.data || "Profile request failed";
    }
};

export const updateUserProfile = async (token: string, formData: FormData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/profiles/me/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("✅ Profile updated:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Profile update error:", error);
        throw error.response?.data || "Profile update failed";
    }
};
