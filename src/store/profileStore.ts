import { create } from 'zustand';
import { fetchUserProfile, updateUserProfile, fetchUserPosts } from '../api/profileApi';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    birth_date?: string;
    avatar?: string;
    country?: string;
    region?: string;
    bio?: string;
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    telegram?: string;
}


interface ProfileState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    posts: any[];

    fetchUserProfile: () => Promise<void>;
    updateUserProfile: (updatedData: FormData) => Promise<void>;
    fetchUserPosts: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    posts: [],

    fetchUserProfile: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found in localStorage");
                throw new Error("No token found");
            }

            console.log("Fetching user profile...");
            const userProfile = await fetchUserProfile(token);
            console.log("User profile loaded:", userProfile);

            set({ user: userProfile, isAuthenticated: true, loading: false });
        } catch (error: any) {
            console.error("Profile fetch error:", error);
            set({ error: error.message || "Failed to fetch profile", loading: false, user: null });
        }
    },

    updateUserProfile: async (updatedData) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const updatedUser = await updateUserProfile(token, updatedData);

            console.log("✅ Обновленный профиль с бэка:", updatedUser);

            set({ user: updatedUser, loading: false });

            await useProfileStore.getState().fetchUserProfile();

        } catch (error: any) {
            console.error("❌ Ошибка обновления профиля:", error);
            set({ error: error.message || "Не удалось обновить профиль", loading: false });
        }
    },

    fetchUserPosts: async () => {
        set({ loading: true, error: null });
        try {
            const token = useProfileStore.getState().token;
            if (!token) throw new Error("No token found");

            const userPosts = await fetchUserPosts(token);
            set({ posts: userPosts, loading: false });
        } catch (error: any) {
            set({ error: error.message || "Failed to fetch posts", loading: false });
        }
    },
}));
