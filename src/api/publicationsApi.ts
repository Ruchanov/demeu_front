import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/publications/';

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
    const response = await axios.put(`${API_URL}${id}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });
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

