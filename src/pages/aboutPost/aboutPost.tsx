import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../../api/publicationsApi";
import styles from "./AboutPost.module.scss";
import { useTranslation } from "react-i18next";
import DonorList from "../../components/donorList/DonorList";
import RelatedPosts from "../../components/relatedPosts/RelatedPosts";
import CommentSection from "../../components/commentSection/CommentSection";
import FundraisingCard from "../../components/fundraisingCard/FundraisingCard";
import SharePopup from "../../components/sharePopup/SharePopup";
import IconSvg from "../../shared/assets/icons/Icon";
import { useAuthStore } from "../../store/authStore";

const AboutPostPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const [post, setPost] = useState(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        const loadPost = async () => {
            try {
                const data = await fetchPostById(id);
                setPost(data);
            } catch (error) {
                console.error("Ошибка загрузки поста:", error);
            }
        };

        loadPost();
    }, [id]);

    if (!post) {
        return <p className={styles.loading}>{t("loading")}</p>;
    }

    const getImageUrl = (url: string | null) => {
        if (!url) return "";
        const decodedUrl = decodeURIComponent(url);
        return decodedUrl.startsWith("http") ? decodedUrl : `http://127.0.0.1:8000${decodedUrl}`;
    };

    const imageUrl = post.image ? getImageUrl(post.image.image) : (post.images?.length ? getImageUrl(post.images[0].image) : "");

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.leftColumn}>

                    {/* Заголовок поста */}
                    <div className={styles.postTitle}>
                        <h1>{post.title}</h1>
                        {user?.email === post.author?.email ? (
                            <button className={styles.editButton}>
                                <IconSvg name="pencil_icon" width="30px" height="30px" />
                            </button>
                        ) : (
                            <button className={styles.saveButton}>
                                <IconSvg name="save_icon_aboutPost" width="30px" height="30px" />
                            </button>
                        )}
                    </div>

                    {/* Основное изображение */}
                    <img src={imageUrl} alt={post.title} className={styles.image} />
                    <p className={styles.description}>{post.description}</p>

                    {/* Заголовок с датой и иконками */}
                    <div className={styles.postHeader}>
                        <div className={styles.postDate}>
                            <IconSvg name="clock_icon" width="25px" height="25px" />
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.postStats}>
                            <IconSvg name="eye_icon" width="25px" height="25px" />
                            <span>{post.total_views || 0}</span>

                            <IconSvg name="comment_icon" width="25px" height="25px" />
                            <span>{post.total_comments || 0}</span>
                        </div>
                    </div>

                    {/* Блок комментариев */}
                    <CommentSection postId={post.id} />
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.cardSpacing}>
                        <FundraisingCard
                            totalDonated={post.total_donated}
                            goal={post.amount}
                            daysLeft={post.days_left}
                            percentage={post.donation_percentage}
                            onShareClick={() => setIsShareOpen(true)}
                        />
                    </div>

                    <div className={styles.cardSpacing}>
                        <DonorList postId={post.id} />
                    </div>

                    <div className={styles.cardSpacing}>
                        <RelatedPosts category={post.category} postId={post.id} />
                    </div>
                </div>
            </div>

            {isShareOpen && <SharePopup onClose={() => setIsShareOpen(false)} />}
        </div>
    );
};

export default AboutPostPage;
