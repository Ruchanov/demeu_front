import { create } from 'zustand';
import { getPublications, getPublicationById, createPublication, updatePublication, deletePublication } from '../api/publicationsAPI';
import {useAuthStore} from "./authStore";
import {addFavoritePublication, getFavoritePublications, removeFavoritePublication} from "../api/favoritesApi";
// import {get} from "https";
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
    author_name: string;
    author_email: string;
    total_views: any;
    total_donated: any;
    is_favorite?: boolean;
}

interface PublicationState {
    publications: Publication[];
    favoritePublications: Publication[];
    loading: boolean;
    error: string | null;
    fetchPublications: (p: {}) => Promise<void>;
    fetchFavorites: () => Promise<void>;
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


export const usePublicationsStore = create<PublicationState>((set, get) => ({
    publications: [],
    loading: false,
    error: null,
    favoritePublications: [],

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
            const favoriteIds = new Set(get().favoritePublications.map(fav => fav.id));
            set({
                publications: response.map((pub: Publication) => ({
                    ...pub,
                    is_favorite: favoriteIds.has(pub.id),
                })),
                loading: false
            });
        } catch (error) {
            set({ error: 'Failed to fetch publications', loading: false });
        }
    },
    fetchFavorites: async () => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        try {
            const favorites = await getFavoritePublications(token);
            const favoriteIds = new Set(favorites.map((fav: any) => fav.publication.id));

            set((state) => ({
                favoritePublications: favorites.map((fav: any) => fav.publication),
                publications: state.publications.map((pub) => ({
                    ...pub,
                    is_favorite: favoriteIds.has(pub.id),
                })),
            }));
        } catch (error) {
            console.error("Ошибка загрузки избранных:", error);
        }
    },

    toggleFavorite: async (id: number) => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        const isCurrentlyFavorite = get().favoritePublications.some(pub => pub.id === id);
        console.log('toggleFavorite ID:', id, 'isCurrentlyFavorite:', isCurrentlyFavorite);

        try {
            if (isCurrentlyFavorite) {
                await removeFavoritePublication(id, token);
            } else {
                await addFavoritePublication(id, token);
            }
            await get().fetchFavorites();

        } catch (error) {
            console.error('Ошибка переключения избранного:', error);
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
