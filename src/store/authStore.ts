import { create } from 'zustand';
import { loginRequest, registerRequest} from '../api/authApi';
import {loginRequest, registerRequest, requestPasswordReset, resetPasswordRequest} from '../api/authApi';
import axios from "axios";

interface AuthState {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login_google: (token: string) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, surname: string, email: string, password: string, confirmPassword: string) => Promise<void>;
    logout: () => void;
    fetchUserProfile: () => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,

    login_google: (token) => {
        console.log("🔑 Google Login - Устанавливаем токен:", token);
        localStorage.setItem("token", token);
        set({token, isAuthenticated: true});
    },
    token: localStorage.getItem('token') || null,

    login: async (email, password) => {
        set({loading: true, error: null});
        console.log("📡 Отправляем запрос на логин...");

        try {
            const data = await loginRequest(email, password);
            console.log("🎯 Ответ от сервера:", data);

            if (!data.access_token) {
                console.error("❌ Ошибка: Сервер не вернул токен!");
                return;
            }

            localStorage.setItem('token', data.access_token);
            console.log(localStorage.getItem('token'), '+++++++')
            set({
                user: data.user,
                token: data.access_token,
                isAuthenticated: true,
                loading: false
            });

            console.log("✅ Токен сохранен:", data.access_token);
        } catch (error) {
            console.error("❌ Ошибка логина:", error);
            set({error: error.message || 'Login failed', loading: false});
        }
    },

    register: async (first_name: string, last_name: string, email: string, password: string, confirm_password: string) => {
        set({loading: true, error: null, successMessage: null});
        try {
            await registerRequest(first_name, last_name, email, password, confirm_password);
            set({
                successMessage: "На вашу почту отправлено письмо. Подтвердите почту и попробуйте войти.",
                loading: false
            });
        } catch (error) {
            set({error: error.message || "Registration failed", loading: false});
        }
    },

    logout: () => {
        console.log("🚪 Выход: Очищаем токен");
        localStorage.removeItem('token');
        set({user: null, token: null, isAuthenticated: false});
    },

    requestPasswordReset: async (email: string) => {
        set({loading: true, error: null, successMessage: null});
        try {
            const response = await requestPasswordReset(email);
            set({successMessage: response.message, loading: false});
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Password reset request failed";
            set({error: errorMessage, loading: false});
            return {success: false, err: errorMessage};
        }
    },

    resetPassword: async (token: string, newPassword: string, confirmPassword: string) => {
        set({loading: true, error: null, successMessage: null});
        try {
            const response = await resetPasswordRequest(token, newPassword, confirmPassword);

            if (response.message) {
                set({successMessage: "Password has been reset successfully.", loading: false});
                return {success: true};
            } else {
                return {success: false, error: "Unknown error occurred."};
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Password reset failed";
            set({error: errorMessage, loading: false});

            return {success: false, error: errorMessage};
        }
    }
}));

