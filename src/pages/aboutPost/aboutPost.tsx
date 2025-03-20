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
import { usePublicationsStore } from "../../store/publicationStore";

const AboutPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [post, setPost] = useState(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const { user, fetchUserProfile } = useProfileStore();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Для смены фото
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { editPublication, fetchPublications } = usePublicationsStore();

    const loadPost = async () => {
        try {
            const data = await fetchPostById(id);
            setPost(data);
        } catch (error) {
            console.error("Ошибка загрузки поста:", error);
        }
    };

    useEffect(() => {
        loadPost();

        if (!user) {
            fetchUserProfile();
        }
    }, [id, user, fetchUserProfile])

    const getImageUrl = (url) => {
        if (!url) return "";
        const decodedUrl = decodeURIComponent(url);
        return decodedUrl.startsWith("http") ? decodedUrl : `http://127.0.0.1:8000${decodedUrl}`;
    };

    const imageUrls = post?.images?.length
        ? post.images.map(img => getImageUrl(img.image))
        : [post?.image ? getImageUrl(post.image.image) : ""];

    const authorAvatar = defaultAvatar;

    useEffect(() => {
        if (imageUrls.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
            }, 5000); // Каждые 5 секунд

            return () => clearInterval(interval);
        }
    }, [imageUrls]);

    const openModal = (index) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
    };

    if (!post) {
        return <p className={styles.loading}>{t("loading")}</p>;
    }

    const goToAuthorProfile = () => {
        if (!post?.author_id) return;

        if (user?.email === post.author_email) {
            navigate(`/profile/me/`);
        } else {
            navigate(`/profile/${post.author_id}/`);
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

                    <p className={styles.categoryTag}>{t("category")}: {t(`${post.category}`)}</p>

                    {/* мобВариант автор */}
                    <div className={`${styles.authorContainer} ${styles.mobileEdit}`} onClick={goToAuthorProfile} style={{ cursor: "pointer" }}>
                        <img src={user?.avatar || authorAvatar} alt="Author Avatar" className={styles.authorAvatar} />
                        <span className={styles.authorName}>{post.author_name}</span>
                    </div>

                    {/* Изображение поста */}
                    <div className={styles.imageContainer} onClick={() => openModal(currentImageIndex)}>
                        <img
                            src={imageUrls[currentImageIndex]}
                            alt={post.title}
                            className={styles.image}
                        />
                    </div>

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
                    <CommentSection postId={post.id} onCommentChange={loadPost} />
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
            {isEditOpen && <EditPostPopup post={post} onClose={() => setIsEditOpen(false)} />}

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        {imageUrls.length > 1 && (
                            <>
                                <button className={styles.prevButton} onClick={prevImage}>‹</button>
                                <button className={styles.nextButton} onClick={nextImage}>›</button>
                            </>
                        )}
                        <img src={imageUrls[currentImageIndex]} alt="Full Image" className={styles.fullImage} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutPostPage;