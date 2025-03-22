import React, { useEffect } from "react";
import styles from "./RelatedPosts.module.scss";
import { usePublicationsStore } from "../../store/publicationStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const getImageUrl = (post) => {
    if (!post) return "/icons/image-placeholder.svg";
    const url = post.image || (post.images?.length ? post.images[0].image : "");
    if (!url) return "/icons/image-placeholder.svg";

    const decodedUrl = decodeURIComponent(url);
    return decodedUrl.startsWith("http") ? decodedUrl : `http://127.0.0.1:8000${decodedUrl}`;
};

const formatDate = (dateString, t) => {
    if (!dateString) return t("no_date");
    return new Date(dateString).toLocaleDateString(t("locale"), { year: "numeric", month: "2-digit", day: "2-digit" });
};

const RelatedPosts = ({ category, postId }) => {
    const { relatedPosts, loading, error, fetchRelatedPosts } = usePublicationsStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (category) {
            fetchRelatedPosts(category, postId);
        }
    }, [category, postId, fetchRelatedPosts]);

    if (loading) return <p className={styles.loading}>{t("loading")}...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>{t("related_posts")}</h3>
            {relatedPosts.length > 0 ? (
                <ul className={styles.list}>
                    {relatedPosts.map((post) => (
                        <li
                            key={post.id}
                            className={styles.relatedItem}
                            onClick={() => navigate(`/publications/${post.id}`)}
                        >
                            <img
                                src={getImageUrl(post)}
                                alt={post.title}
                                className={styles.image}
                                onError={(e) => (e.target.src = "/icons/image-placeholder.svg")}
                            />
                            <div className={styles.info}>
                                <span className={styles.postTitle}>{post.title}</span>
                                <span className={styles.date}>{formatDate(post.created_at || post.updated_at, t)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.noData}>{t("no_posts")}</p>
            )}
        </div>
    );
};

export default RelatedPosts;
