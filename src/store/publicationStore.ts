import { create } from 'zustand';
import {
    getPublications,
    getPublicationById,
    createPublication,
    updatePublication,
    deletePublication,
    fetchCommentsByPostId,
    sendComment,
    deleteComment,
    fetchRelatedPosts
} from '../api/publicationsAPI';
import { useAuthStore } from "./authStore";
import {fetchTopDonors, fetchDonationStats} from "../api/donationsApi";
import {addFavoritePublication, getFavoritePublications, removeFavoritePublication} from "../api/favoritesApi";

interface Image {
    id: number;
    image: string;
}

interface Comment {
    id: number;
    author: string;
    content: string;
    created_at: string;
    updated_at: string;
}

interface Donor {
    donor_name: string;
    donor_amount: number;
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
    author_id: number;
    author_avatar: string;
    total_views: any;
    total_donated: any;
    is_favorite?: boolean;
}

type Post = Pick<Publication, "id" | "title" | "category" | "images">;
interface PublicationState {
    publications: Publication[];
    userPublications: Publication[]; // Добавляем массив для публикаций пользователя
    comments: Record<number, Comment[]>;
    favoritePublications: Publication[];
    loading: boolean;
    error: string | null;
    fetchPublications: (p: {}) => Promise<void>;
    fetchUserPublications: (id: number) => Promise<void>; // Добавляем сюда
    fetchFavorites: () => Promise<void>;
    getPublication: (id: number) => Promise<Publication | null>;
    addPublication: (formData: FormData) => Promise<void>;
    editPublication: (id: number, formData: FormData) => Promise<void>;
    removePublication: (id: number) => Promise<void>;
    fetchComments: (postId: number) => Promise<void>;
    addComment: (postId: number, comment: string) => Promise<void>;
    removeComment: (postId: number, commentId: number) => Promise<void>;
    fetchTopDonors: (postId: number) => Promise<void>;
    fetchRelatedPosts: (category: string, postId: number) => Promise<void>;
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
    userPublications: [],
    comments: {},
    topDonors: [],
    relatedPosts: [],
    loading: false,
    loadingDonors: false,
    loadingRelated: false,
    error: null,
    errorDonors: null,
    errorRelated: null,
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

    fetchUserPublications: async (user: User) => {
        if (!user) {
            console.log("❌ Ошибка: пользователь не передан!");
            return;
        }

        set({ loading: true, error: null });

        try {
            console.log("📥 Фильтруем публикации из user.publications");

            const filteredPublications = user.publications?.map((pub) => {
                return {
                    ...pub,
                    images: pub.images || [], // <--- гарантируем наличие
                    author_name: `${user.first_name} ${user.last_name}`,
                    author_avatar: user.avatar,
                };
            }) || [];


            set({ userPublications: filteredPublications, loading: false });
        } catch (error) {
            console.error("❌ Ошибка загрузки публикаций:", error);
            set({ error: "Failed to fetch user publications", loading: false });
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

    addPublication: async (formData) => {
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

            const updatedPost = await updatePublication(id, formData, token);

            set((state) => ({
                ...state,
                publications: state.publications.map((p) =>
                    p.id === id ? { ...p, ...updatedPost } : p
                ),
                loading: false,
            }));

            return updatedPost;
        } catch (error) {
            set({ error: 'Failed to update publication', loading: false });
            throw error;
        }
    },

    removePublication: async (id) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            if (!token) throw new Error('Unauthorized');
            await deletePublication(id, token);
            await get().fetchPublications();
            await usePublicationsStore.getState().fetchPublications({});
        } catch (error) {
            set({ error: 'Failed to delete publication' });
        } finally {
            set({ loading: false });
        }
    },

    fetchComments: async (postId) => {
        set({ loading: true, error: null });
        try {
            const comments = await fetchCommentsByPostId(postId);
            set((state) => ({
                ...state,
                comments: { ...state.comments, [postId]: comments },
                loading: false,
            }));
        } catch (error) {
            set({ error: `Failed to load comments for post ${postId}`, loading: false });
        }
    },

    addComment: async (postId, comment) => {
        set({ loading: true, error: null });
        try {
            const newComment = await sendComment(postId, comment);
            set((state) => ({
                ...state,
                comments: {
                    ...state.comments,
                    [postId]: [...(state.comments[postId] || []), newComment],
                },
                loading: false,
            }));
        } catch (error) {
            set({ error: `Failed to add comment for post ${postId}`, loading: false });
        }
    },

    removeComment: async (postId, commentId) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            if (!token) throw new Error('Unauthorized');
            await deleteComment(commentId, token);
            set((state) => ({
                ...state,
                comments: {
                    ...state.comments,
                    [postId]: state.comments[postId].filter((c) => c.id !== commentId),
                },
                loading: false,
            }));
        } catch (error) {
            set({ error: `Failed to delete comment ${commentId}`, loading: false });
        }
    },


    fetchTopDonors: async (postId: number) => {
        set({ loadingDonors: true, errorDonors: null });
        try {
            const donors = await fetchTopDonors(postId);
            set({ topDonors: donors, loadingDonors: false });
        } catch (error) {
            console.error("Ошибка при получении топ доноров:", error);
            set({ errorDonors: "Ошибка загрузки топ доноров", loadingDonors: false });
        }
    },

    // Загружаем похожие посты
    fetchRelatedPosts: async (category, postId) => {
        set({ loadingRelated: true, errorRelated: null });
        try {
            const posts = await fetchRelatedPosts(category, postId);
            set({ relatedPosts: posts, loadingRelated: false });
        } catch (error) {
            set({ errorRelated: "Ошибка загрузки похожих постов", loadingRelated: false });
        }
    },

}));
