import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/donations";

export const fetchTopDonors = async (publicationId: number) => {
    const response = await axios.get(`${BASE_URL}/${publicationId}/top-donors/`);
    return response.data;
};

export const fetchDonationStats = async () => {
    const response = await axios.get(`${BASE_URL}/donation-stats/`);
    return response.data;
};
