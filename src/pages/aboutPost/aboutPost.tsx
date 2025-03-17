import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById } from "../../api/publicationsApi";
import styles from "./AboutPost.module.scss";
import { useTranslation } from "react-i18next";
import DonorList from "../../components/donorList/DonorList";
import RelatedPosts from "../../components/relatedPosts/RelatedPosts";
import CommentSection from "../../components/commentSection/CommentSection";
import FundraisingCard from "../../components/fundraisingCard/FundraisingCard";
import SharePopup from "../../components/sharePopup/SharePopup";
import IconSvg from "../../shared/assets/icons/Icon";
import defaultAvatar from "../../shared/assets/images/profile_donate.png";
import {useProfileStore} from "../../store/profileStore";
import EditPostPopup from "../../components/editPostPopup/EditPostPopup";

const AboutPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [post, setPost] = useState(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const { user } = useProfileStore();
    const [isEditOpen, setIsEditOpen] = useState(false);

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

    const handleSavePost = async (updatedPost) => {
        try {
            const formData = new FormData();
            Object.keys(updatedPost).forEach((key) => {
                formData.append(key, updatedPost[key]);
            });

            await editPublication(id, formData);
            const updatedData = await fetchPostById(id);
            setPost(updatedData);
        } catch (error) {
            console.error("Ошибка обновления поста:", error);
        }
    };

    if (!post) {
        return <p className={styles.loading}>{t("loading")}</p>;
    }

    const getImageUrl = (url) => {
        if (!url) return "";
        const decodedUrl = decodeURIComponent(url);
        return decodedUrl.startsWith("http") ? decodedUrl : `http://127.0.0.1:8000${decodedUrl}`;
    };

    const imageUrl = post.image ? getImageUrl(post.image.image) : (post.images?.length ? getImageUrl(post.images[0].image) : "");
    const authorAvatar = post.author_avatar ? getImageUrl(post.author_avatar) : defaultAvatar;

    const goToAuthorProfile = () => {
        if (post.author_email) {
            navigate(`/profile/${post.author_email}`); // <-- меняем URL
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.leftColumn}>

                    {/* Заголовок поста */}
                    <div className={styles.postTitle}>
                        <h1>{post.title}</h1>
                        { user?.email === post.author_email ? (
                            <button className={styles.editButton} onClick={() => {
                                console.log("Нажали на кнопку редактирования!");
                                setIsEditOpen(true);
                            }}>
                                <IconSvg name="pencil_icon" width="30px" height="30px" />
                            </button>

                        ) : (
                            <button className={styles.saveButton}>
                                <IconSvg name="save_icon_aboutPost" width="30px" height="30px" />
                            </button>
                        )}
                    </div>

                    {/* мобВариант автор */}
                    <div className={`${styles.authorContainer} ${styles.mobileEdit}`} onClick={goToAuthorProfile} style={{ cursor: "pointer" }}>
                        <img src={user?.avatar || authorAvatar} alt="Author Avatar" className={styles.authorAvatar} />
                        <span className={styles.authorName}>{post.author_name}</span>
                    </div>

                    {/* Основное изображение */}
                    <img src={imageUrl} alt={post.title} className={styles.image} />

                    {/* мобВариант fundraiseing */}
                    <div className={`${styles.cardSpacing} ${styles.mobileEdit}`}>
                        <FundraisingCard
                            totalDonated={post.total_donated}
                            goal={post.amount}
                            daysLeft={post.days_left}
                            percentage={post.donation_percentage}
                            author_email={post.author_email}
                            onShareClick={() => setIsShareOpen(true)}
                        />
                    </div>

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

                    <div className={`${styles.cardSpacing} ${styles.mobileEdit}`}>
                        <DonorList postId={post.id} />
                    </div>

                    <div className={`${styles.cardSpacing} ${styles.mobileEdit}`}>
                        <RelatedPosts category={post.category} postId={post.id} />
                    </div>

                    {/* Блок комментариев */}
                    <CommentSection postId={post.id} />
                </div>

                <div className={styles.rightColumn}>
                    <div className={`${styles.cardSpacing} ${styles.desktopEdit}`}>
                        <div className={styles.authorContainer} onClick={goToAuthorProfile} style={{ cursor: "pointer" }}>
                            <img src={user?.avatar || authorAvatar} alt="Author Avatar" className={styles.authorAvatar} />
                            <span className={styles.authorName}>{post.author_name}</span>
                        </div>
                    </div>

                    <div className={`${styles.cardSpacing} ${styles.desktopEdit}`}>
                        <FundraisingCard
                            totalDonated={post.total_donated}
                            goal={post.amount}
                            daysLeft={post.days_left}
                            percentage={post.donation_percentage}
                            author_email={post.author_email}
                            onShareClick={() => setIsShareOpen(true)}
                        />
                    </div>

                    <div className={`${styles.cardSpacing} ${styles.desktopEdit}`}>
                        <DonorList postId={post.id} />
                    </div>

                    <div className={`${styles.cardSpacing} ${styles.desktopEdit}`}>
                        <RelatedPosts category={post.category} postId={post.id} />
                    </div>
                </div>
            </div>

            {isShareOpen && <SharePopup onClose={() => setIsShareOpen(false)} />}
            {isEditOpen && <EditPostPopup post={post} onClose={() => setIsEditOpen(false)} onSave={handleSavePost} />}
        </div>
    );
};

export default AboutPostPage;