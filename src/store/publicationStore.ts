import { create } from 'zustand';
import { getPublications, getPublicationById, createPublication, updatePublication, deletePublication } from '../api/publicationsAPI';
import {useAuthStore} from "./authStore";

interface Publication {
    id: number;
    title: string;
    category: string;
    description: string;
    bank_details: string;
    amount: number;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    images: string[];
    videos: string[];
    created_at: string;
    updated_at: string;
    author: number;
}

interface PublicationState {
    publications: Publication[];
    loading: boolean;
    error: string | null;
    fetchPublications: () => Promise<void>;
    getPublication: (id: number) => Promise<Publication | null>;
    addPublication: (formData: FormData) => Promise<void>;
    editPublication: (id: number, formData: FormData) => Promise<void>;
    removePublication: (id: number, token: string) => Promise<void>;
}

export const usePublicationsStore = create<PublicationState>((set) => ({
    publications: [],
    loading: false,
    error: null,

    fetchPublications: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getPublications();
            set({ publications: data, loading: false });
        } catch (error) {
            set({ error: 'Failed to load publications', loading: false });
        }
    },

    getPublication: async (id) => {
        try {
            return await getPublicationById(id);
        } catch (error) {
            set({ error: 'Failed to fetch publication' });
            return null;
        }
    },

    addPublication: async (formData, ) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            if (!token) throw new Error('Unauthorized');
            return await createPublication(formData, token);
        } catch (error) {
            set({ error: 'Failed to create publication' });
        } finally {
            set({ loading: false });
        }
    },

    editPublication: async (id, formData) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            if (!token) throw new Error('Unauthorized');
            await updatePublication(id, formData, token);
            await usePublicationsStore.getState().fetchPublications();
        } catch (error) {
            set({ error: 'Failed to update publication' });
        } finally {
            set({ loading: false });
        }
    },

    removePublication: async (id) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            if (!token) throw new Error('Unauthorized');
            await deletePublication(id, token);
            await usePublicationsStore.getState().fetchPublications();
        } catch (error) {
            set({ error: 'Failed to delete publication' });
        } finally {
            set({ loading: false });
        }
    },
}));
