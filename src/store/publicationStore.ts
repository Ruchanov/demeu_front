import { create } from 'zustand';
import { getPublications, getPublicationById, createPublication, updatePublication, deletePublication } from '../api/publicationsAPI';
import {useAuthStore} from "./authStore";
interface Image {
    id: number;
    image: string;
}
export interface Publication {

    id: number;
    title: string;
    category: string;
    description: string;
    bank_details: string;
    amount: number;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    images: Image[];
    videos: string[];
    created_at: string;
    updated_at: string;
    author: number;
    total_views: any;
    total_donated: any;
}

interface PublicationState {
    publications: Publication[];
    loading: boolean;
    error: string | null;
    fetchPublications: (p: {}) => Promise<void>;
    getPublication: (id: number) => Promise<Publication | null>;
    addPublication: (formData: FormData) => Promise<void>;
    editPublication: (id: number, formData: FormData) => Promise<void>;
    removePublication: (id: number, token: string) => Promise<void>;
}
interface Filters {
    search?: string;
    categories?: string[];
    created_at__gte?: string;
    created_at__lte?: string;
    amount__gte?: number;
    amount__lte?: number;
    ordering?: string;
}


export const usePublicationsStore = create<PublicationState>((set) => ({
    publications: [],
    loading: false,
    error: null,

    fetchPublications: async (filters?: Filters) => {
        set({ loading: true, error: null });
        try {
            const queryParams = new URLSearchParams();

            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.categories?.length) queryParams.append('category', filters.categories.join(','));

            if (filters?.created_at__gte) queryParams.append('created_at__gte', filters.created_at__gte);
            if (filters?.created_at__lte) queryParams.append('created_at__lte', filters.created_at__lte);
            if (filters?.amount__gte) queryParams.append('amount__gte', filters.amount__gte.toString());
            if (filters?.amount__lte) queryParams.append('amount__lte', filters.amount__lte.toString());

            if (filters?.ordering) queryParams.append('ordering', filters.ordering);

            const response = await getPublications(queryParams.toString());
            set({ publications: response, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch publications', loading: false });
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
            await usePublicationsStore.getState().fetchPublications({});
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
            await usePublicationsStore.getState().fetchPublications({});
        } catch (error) {
            set({ error: 'Failed to delete publication' });
        } finally {
            set({ loading: false });
        }
    },
}));
