import { create } from 'zustand';
import {loginRequest, registerRequest, requestPasswordReset, resetPasswordRequest} from '../api/authApi';

interface AuthState {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    register: (name: string, surname: string, email: string, password: string, confirmPassword: string) => Promise<void>;
    logout: () => void;
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<void>;



}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const data = await loginRequest(email, password);
            console.log('Login response:', data);
            localStorage.setItem('token', data.access_token);
            set({ user: data.user, token: data.access_token, isAuthenticated: true, loading: false });
        } catch (error) {
            set({ error: error.message || 'Login failed', loading: false });
        }
    },

    register: async (first_name, last_name, email, password, confirm_password) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            await registerRequest(first_name, last_name, email, password, confirm_password);
            set({
                successMessage: "На вашу почту отправлено письмо. Подтвердите почту и попробуйте войти.",
                loading: false
            });
        } catch (error) {
            set({ error: error.message || 'Registration failed', loading: false });
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },
    requestPasswordReset: async (email) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const response = await requestPasswordReset(email);
            set({ successMessage: response.message, loading: false });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Password reset request failed';
            set({ error: errorMessage, loading: false });
            return { success: false, err: errorMessage };
        }
    },

    resetPassword: async (token, newPassword, confirmPassword) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const response = await resetPasswordRequest(token, newPassword, confirmPassword);

            if (response.message) {
                set({ successMessage: "Password has been reset successfully.", loading: false });
                return { success: true };
            } else {
                return { success: false, error: "Unknown error occurred." };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Password reset failed';
            set({ error: errorMessage, loading: false });

            return { success: false, error: errorMessage };
        }
    },

}));
