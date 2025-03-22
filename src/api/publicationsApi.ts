import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/publications/';
const COMMENTS_API_URL = 'http://127.0.0.1:8000/comments';

export const getPublications = async (queryParams = '') => {
    const response = await axios.get(`${API_URL}?${queryParams}`);
    return response.data;
};

export const getPublicationById = async (id: number) => {
    const response = await axios.get(`${API_URL}${id}/`);
    return response.data;
};

export const createPublication = async (formData: FormData, token: string) => {
    const response = await axios.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updatePublication = async (id: number, formData: FormData, token: string) => {
    console.log("📡 Отправка запроса на сервер:", id, Object.fromEntries(formData));

    const response = await axios.put(`${API_URL}${id}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });

    console.log("✅ Сервер вернул ответ:", response.data);
    return response.data;
};

export const deletePublication = async (id: number, token: string) => {
    const response = await axios.delete(`${API_URL}${id}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const fetchPostById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}${id}/`);
        const post = response.data;

        console.log("📥 Загруженный пост:", post);

        if (!post.image && post.images?.length) {
            post.image = post.images[0];
        }

        return post;
    } catch (error) {
        console.error("❌ Ошибка загрузки поста:", error);
        throw error;
    }
};

export const fetchCommentsByPostId = async (postId: number) => {
    try {
        const response = await axios.get(`${COMMENTS_API_URL}/publication/${postId}/comments/`);
        return response.data;
    } catch (error) {
        console.error(`Ошибка загрузки комментариев для публикации (ID: ${postId}):`, error);
        return [];
    }
};

export const sendComment = async (postId: number, comment: string, token: string) => {
    try {
        const response = await axios.post(
            `${COMMENTS_API_URL}/publication/${postId}/comments/`,
            { content: comment },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Теперь токен передается
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Ошибка при отправке комментария для публикации (ID: ${postId}):`, error);
        throw error;
    }
};


export const deleteComment = async (commentId: number, token: string) => {
    try {
        await axios.delete(`${COMMENTS_API_URL}/comments/${commentId}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true };
    } catch (error) {
        console.error(`Ошибка при удалении комментария (ID: ${commentId}):`, error);
        throw error;
    }
};

export const updateComment = async (commentId: number, content: string, token: string) => {
    try {
        const response = await axios.put(
            `${COMMENTS_API_URL}/comments/${commentId}/`,
            { content },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Ошибка при обновлении комментария (ID: ${commentId}):`, error);
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