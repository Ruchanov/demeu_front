import axios from "axios";


const API_URL = 'http://127.0.0.1:8000/';
export const getFavoritePublications = async (token: string) => {
    const response = await axios.get(`${API_URL}favorites/publications/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const addFavoritePublication = async (publicationId: number, token: string) => {
    const response = await axios.post(
        `${API_URL}favorites/publications/`,
        { publication: publicationId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const removeFavoritePublication = async (publicationId: number, token: string) => {
    await axios.delete(`${API_URL}favorites/publications/${publicationId}/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
