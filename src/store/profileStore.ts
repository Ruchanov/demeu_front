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
    fetchUserProfile: () => Promise<void>;
    updateUserProfile: (formData: FormData) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    user: null,
    profileStats: {
        posts: 0,
        donations: 0,
        views: 0,
        savedPosts: 0,
    },
    loading: false,
    error: null,

    fetchUserProfile: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const userData = await fetchUserProfile(token);

            // Форматируем донаты
            const formattedDonations = (userData.latest_donations || []).map((donation: any) => ({
                donor_name: donation.donor_name || "Анонимный донор",
                donor_amount: donation.donor_amount || 0,
                publication_id: donation.publication_id,
                publication_title: donation.publication_title,
                publication_category: donation.publication_category,
                publication_author: donation.publication_author,
                publication_created_at: donation.publication_created_at,
            }));

            set({
                user: {
                    ...userData,
                    latest_donations: formattedDonations,
                    favorite_publications: userData.favorite_publications || [],
                    publications: userData.publications || [],
                },
                profileStats: {
                    posts: userData.total_publications,
                    donations: userData.total_donations,
                    views: userData.total_profile_views,
                    savedPosts: userData.total_favorite_publications,
                },
                loading: false,
            });
        } catch (error: any) {
            set({ error: "Failed to fetch profile", loading: false });
            console.error("Profile fetch error:", error);
        }
    },

    updateUserProfile: async (formData: FormData) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const updatedUser = await updateUserProfile(token, formData);

            set({ user: updatedUser });
        } catch (error) {
            console.error("Profile update error:", error);
            throw error;
        }
    },
}));
