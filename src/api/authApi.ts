import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/accounts';
// const PROFILE_API_URL = "http://127.0.0.1:8000/profiles/me/";

export const loginRequest = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login/`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Login request failed';
  }
};

export const registerRequest = async (first_name: string, last_name: string, email: string, password: string, confirm_password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/`, {
      first_name,
      last_name,
      email,
      password,
      confirm_password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Registration request failed';
  }
};


export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/request-password-reset/`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Password reset request failed';
  }
};

export const resetPasswordRequest = async (token: string, newPassword: string, confirmPassword: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password/${token}/`, {
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Password reset failed';
  }
};

// export const fetchUserProfile = async (token: string) => {
//   try {
//     const response = await axios.get(PROFILE_API_URL, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Profile fetch error:", error);
//     throw error.response?.data || "Profile request failed";
//   }
// };