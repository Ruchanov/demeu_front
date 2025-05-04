// src/api/notificationApi.ts
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";

export const getAllNotifications = async (token: string) => {
    const response = await axios.get(`${API_URL}notifications/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;

};

export const markAsRead = async (id: number, token: string) => {
    const response = await axios.post(`${API_URL}notifications/${id}/mark-as-read/`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
