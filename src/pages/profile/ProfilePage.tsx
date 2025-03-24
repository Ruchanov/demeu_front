import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProfileStore } from "../../store/profileStore";
import { usePublicationsStore } from "../../store/publicationStore";
import ProfileStats from "../../components/profileStats/ProfileStats";
import ProfileDonations from "../../components/profileDonations/ProfileDonations";
import PublicationCard from "../../components/publicationCard";
import ProfileEditPopup from "../../components/profileEditPopup/ProfileEditPopup";
import styles from "./ProfilePage.module.scss";
import IconSvg from "../../shared/assets/icons/Icon";
import { useTranslation } from "react-i18next";
import defaultAvatar from "../../shared/assets/images/profile_default.png";
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const { user, fetchUserProfile, loading: userLoading } = useProfileStore();
    const { userPublications, loading: postsLoading, fetchUserPublications, fetchFavorites } = usePublicationsStore();
    const { t } = useTranslation();
    const { id: profileId } = useParams();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const navigate = useNavigate();

    const isOwnProfile = window.location.pathname.includes("/profiles/me");
    const handleCreatePostClick = () => {
        navigate('/create_publication');
    };
    useEffect(() => {
        console.log("🔄 Загружаем профиль для:", profileId || "me");
        fetchFavorites();
        fetchUserProfile(profileId);
    }, [profileId, fetchUserProfile]);

    useEffect(() => {
        if (!user?.user_id) {
            console.log("⏳ Ожидание загрузки пользователя...");
            return;
        }

        console.log("✅ User загружен:", user.user_id);

        if (isOwnProfile) {
            console.log("📥 Фильтруем публикации для текущего пользователя:", user.user_id);
            fetchUserPublications(user);
        } else {
            console.log("📥 Загружаем публикации для профиля:", profileId);
            fetchUserPublications(user);
        }
    }, [user, profileId, fetchUserPublications]);

    if (userLoading) {
        return <div className={styles.loader}>{t("loading")}</div>;
    }

    if (!user) {
        return <div className={styles.error}>{t("loading")}</div>;
    }

    const avatarUrl = user.avatar ? user.avatar : defaultAvatar;

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
                <div className={styles.profileContent}>
                    {/* Левая часть */}
                    <div className={styles.leftSection}>
                        <div className={styles.avatarWrapper}>
                            <img src={avatarUrl} alt="User Avatar" className={styles.avatar} />

                            {isOwnProfile && (
                                <button className={styles.editAvatar} onClick={() => setIsEditOpen(true)}>
                                    <IconSvg name="editIcon_profile" width="25px" height="25px" />
                                </button>
                            )}
                        </div>
                        <h2 className={styles.name}>{user.first_name} {user.last_name}</h2>
                        <p className={styles.daysWithUs}>
                            {user.days_since_registration === 0
                                ? t("days_together_today")
                                : t("days_together", { count: user.days_since_registration })}
                        </p>
                        <p className={styles.bio}>{user.bio}</p>
                        <div className={`${styles.createPostContainer}`}>
                            <div className={styles.plusIcon} onClick={handleCreatePostClick}>+</div>
                            <button className={styles.createPost} onClick={handleCreatePostClick}>{t("create_post")}</button>
                        </div>
                    </div>

                    {/* Правая часть */}
                    <div className={styles.rightSection}>
                        <div className={styles.userInfoCard}>
                            <h3 className={styles.userInfoTitle}>{t("full_info")}</h3>
                            <div className={styles.userInfo}>
                                <div className={styles.infoColumn}>
                                    <div className={styles.infoItem}>
                                        <IconSvg name="locationIcon_profile" width="23px" height="23px" />
                                        <span>{user.city}, {user.country}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <IconSvg name="calendarIcon_profile" width="23px" height="23px" />
                                        <span>{user.birth_date}</span>
                                    </div>
                                </div>
                                <div className={styles.infoColumn}>
                                    <div className={styles.infoItem}>
                                        <IconSvg name="emailIcon_profile" width="23px" height="23px" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <IconSvg name="phoneIcon_profile" width="23px" height="23px" />
                                        <span>{user.phone_number}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ProfileStats
                            posts={user.total_publications}
                            donations={user.total_donations}
                            views={user.total_profile_views}
                            savedPosts={user.total_favorite_publications}
                        />
                        <ProfileDonations />
                    </div>
                </div>
            </div>

            {/* Список публикаций пользователя */}
            <div className={styles.postsSection}>
                <h3>{t("posts")}</h3>

                {postsLoading ? (
                    <p className={styles.loading}>{t("loading")}</p>
                ) : userPublications?.length > 0 ? (
                    <div className={styles.publicationsGrid}>
                        {userPublications.map((pub) => (
                            <PublicationCard
                                key={pub.id}
                                id={pub.id}
                                title={pub.title}
                                category={pub.category}
                                images={pub.images}
                                videos={pub.videos}
                                description={pub.description}
                                amount={pub.amount}
                                views={pub.total_views}
                                donations={pub.total_donated}
                                created_at={pub.created_at}
                                author_name={pub.author_name}
                                is_favorite={pub.is_favorite}
                            />
                        ))}
                    </div>
                ) : (
                    <p className={styles.noPosts}>{t("no_posts")}</p>
                )}
            </div>

            {isEditOpen && <ProfileEditPopup key={Date.now()} onClose={() => setIsEditOpen(false)} />}
        </div>
    );
};

export default ProfilePage;
