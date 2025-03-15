import axios from "axios";

const API_URL = "http://127.0.0.1:8000/publications/";

// Получаем топ доноров
export const fetchTopDonors = async (postId: number) => {
    try {
        const response = await axios.get(`${API_URL}${postId}/top-donors/`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении топ доноров:", error);
        throw error;
    }
};

export const fetchRelatedPosts = async (category: string, postId: number) => {
    try {
        const response = await axios.get(`${API_URL}?category=${category}`);
        const relatedPosts = response.data.filter((post) => post.id !== postId);
        return relatedPosts;
    } catch (error) {
        console.error("Ошибка при получении похожих постов:", error);
        return [];
    }
};

