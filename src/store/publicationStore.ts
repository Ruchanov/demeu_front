import { create } from 'zustand';
import {
    getPublications,
    getPublicationById,
    createPublication,
    updatePublication,
    deletePublication,
    fetchCommentsByPostId,
    sendComment,
    deleteComment
} from '../api/publicationsAPI';
import { useAuthStore } from "./authStore";
import {fetchRelatedPosts, fetchTopDonors} from "../api/aboutPostApi";

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

type Post = Pick<Publication, "id" | "title" | "category" | "images">;


interface PublicationState {
    publications: Publication[];
    comments: Record<number, Comment[]>;
    loading: boolean;
    error: string | null;
    fetchPublications: () => Promise<void>;
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

export const usePublicationsStore = create<PublicationState>((set, get) => ({
    publications: [],
    comments: {},
    topDonors: [],
    relatedPosts: [],
    loading: false,
    loadingDonors: false,
    loadingRelated: false,
    error: null,
    errorDonors: null,
    errorRelated: null,

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
            await updatePublication(id, formData, token);
            await get().fetchPublications();
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
            await get().fetchPublications();
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

    fetchTopDonors: async (postId) => {
        set({ loadingDonors: true, errorDonors: null });
        try {
            const donors = await fetchTopDonors(postId);
            set({ topDonors: donors, loadingDonors: false });
        } catch (error) {
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
