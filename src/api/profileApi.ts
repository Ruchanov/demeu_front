import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";
const PROFILE_API_URL = `${API_BASE_URL}/profiles/me/`;

export const fetchUserProfile = async (token: string) => {
    try {
        const response = await axios.get(PROFILE_API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User profile data:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Profile fetch error:", error);
        throw error.response?.data || "Profile request failed";
    }
};

export const updateUserProfile = async (token: string, updatedData: FormData) => {
    try {
        const response = await axios.patch(PROFILE_API_URL, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error: any) {
        console.error("❌ Profile update error:", error);

        if (error.response) {
            console.error("📌 Response Data:", error.response.data);
            console.error("📌 Status Code:", error.response.status);
            console.error("📌 Headers:", error.response.headers);
        } else if (error.request) {
            console.error("📌 No response received, Request:", error.request);
        } else {
            console.error("📌 General Error:", error.message);
        }

        throw error.response?.data || "Failed to update profile";
    }
};
