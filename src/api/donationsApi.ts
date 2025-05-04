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

export const createDonation = async (
    publicationId: number,
    data: {
        donor_amount: number;
        support_percentage?: number;
    },
    token: string
) => {
    const response = await axios.post(
        `${BASE_URL}/${publicationId}/donate/`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export interface PaymentIntentData {
    publication_id: number;
    donor_amount: number;
    support_percentage: number;
}

export async function createPaymentIntent(
    data: PaymentIntentData,
    token: string
): Promise<{ client_secret: string }> {
    const resp = await axios.post(
        'http://127.0.0.1:8000/donations/create-payment-intent/',
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return resp.data;
}
