import { create } from "zustand";
import { fetchUserProfile, updateUserProfile } from "../api/profileApi";
import { Publication } from "./publicationStore";

interface Donation {
    donor_name: string;
    donor_amount: number;
    publication_id: number;
    publication_title: string;
    publication_category: string;
    publication_author: string;
    publication_created_at: string;
}

interface ProfileStats {
    posts: number;
    donations: number;
    views: number;
    savedPosts: number;
}

interface User {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    country: string;
    city: string;
    phone_number: string;
    bio: string;
    birth_date: string;
    age: number;
    avatar: string;
    date_joined: string;
    days_since_registration: number;
    total_profile_views: number;
    total_publications: number;
    total_donations: number;
    total_favorite_publications: number;
    favorite_publications: Publication[];
    latest_donations: Donation[];
    publications: Publication[];
}

interface ProfileState {
    user: User | null;
    profileStats: ProfileStats;
    loading: boolean;
    error: string | null;
    fetchUserProfile: (profileId?: string) => Promise<void>;
    updateUserProfile: (formData: FormData) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
    user: null,
    currentUser: null,
    viewedProfile: null,    profileStats: {
        posts: 0,
        donations: 0,
        views: 0,
        savedPosts: 0,
    },
    loading: false,
    error: null,

    fetchCurrentUser: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("❌ No token found");

            const userData = await fetchUserProfile(token); // без id = me
            set({ currentUser: userData, loading: false });
        } catch (error: any) {
            console.error("❌ Ошибка загрузки текущего пользователя:", error);
            set({ error: "Failed to fetch current user", loading: false });
        }
    },

    fetchUserProfile: async (profileId?: string) => {
        set({ loading: true, error: null });

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("❌ No token found");

            const userData = await fetchUserProfile(token, profileId);
            console.log("✅ Загружен профиль:", userData);

            set({
                user: userData,
                profileStats: {
                    posts: userData.total_publications,
                    donations: userData.total_donations,
                    views: userData.total_profile_views,
                    savedPosts: userData.total_favorite_publications,
                },
                loading: false,
            });

        } catch (error: any) {
            console.error("❌ Ошибка загрузки профиля:", error);
            set({ error: "Failed to fetch profile", loading: false });
        }
    },

    updateUserProfile: async (formData: FormData) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("❌ No token found");

            const updatedUser = await updateUserProfile(token, formData);
            console.log("✅ Профиль обновлен:", updatedUser);

            set({ user: updatedUser });
        } catch (error) {
            console.error("❌ Ошибка обновления профиля:", error);
            throw error;
        }
    },
}));
