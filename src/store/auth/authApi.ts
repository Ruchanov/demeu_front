import axios from 'axios';

const API_BASE_URL = 'https://your-api.com/api';

export const loginRequest = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return response.data;
};

export const registerRequest = async (name: string, surname: string, email: string, password: string, confirmPassword: string) => {
  const response = await axios.post(`${API_BASE_URL}/register`, { name, surname, email, password, confirmPassword });
  return response.data;
};
