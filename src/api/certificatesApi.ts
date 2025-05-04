import axios from "axios";

const BASE_URL = "http://localhost:8000/certificates/";

export const fetchCertificateByUserId = async (userId: number, token: string) => {
    const res = await axios.get(`${BASE_URL}${userId}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};
