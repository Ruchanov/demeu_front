import axios from "axios";
const API_BASE_URL = "http://127.0.0.1:8000";
const PROFILE_API_URL = `${API_BASE_URL}/profiles/me/`;
const POSTS_API_URL = `${API_BASE_URL}/publications/`;

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
    } catch (error) {
        console.error("Profile update error:", error);
        throw error.response?.data || "Failed to update profile";
    }
};


export const fetchUserPosts = async (token: string) => {
    try {
        const response = await axios.get(POSTS_API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📌 API Response:", response.data);

        return response.data.map((post) => ({
            id: post.id,
            title: post.title,
            goal: `$${post.amount} мақсат`,
            collected: post.donation_percentage ? `${post.donation_percentage}%` : "0%",
            participants: Array.isArray(post.donations) ? post.donations.length : 0,
            image: post.images.length > 0 ? `${API_BASE_URL}${post.images[0].image}` : "/default-post.jpg",
        }));
    } catch (error) {
        console.error("❌ Ошибка загрузки постов:", error);
        throw error;
    }
};



