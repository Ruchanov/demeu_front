import axios from 'axios';

const API_BASE_URL = 'https://your-api.com/api';

export const loginRequest = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return response.data;
};

export const registerRequest = async (email: string, password: string, phone: string) => {
  const response = await axios.post(`${API_BASE_URL}/register`, { email, password, phone });
  return response.data;
};
