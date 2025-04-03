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
import editIcon from '../../shared/assets/icons/editIcon_profile.svg';

const ProfilePage: React.FC = () => {
    const { user, fetchUserProfile, loading: userLoading } = useProfileStore();
    const {
        userPublications,
        activePublications,
        pendingPublications,
        archivedPublications,
        fetchUserPublications,
        fetchActivePublications,
        fetchPendingPublications,
        fetchArchivedPublications,
        fetchFavorites,
        loading: postsLoading,
    } = usePublicationsStore();
    const { t } = useTranslation();
    const { id: profileId } = useParams();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState<"active" | "pending" | "archived">("active");

    const isOwnProfile = window.location.pathname.includes("/profiles/me");
    const handleCreatePostClick = () => {
        navigate('/create_publication');
    };
    useEffect(() => {
        fetchFavorites();
        fetchUserProfile(profileId);
    }, [profileId]);


    useEffect(() => {
        if (!user?.user_id) return;

        if (isOwnProfile) {
            fetchUserPublications(user);
            fetchActivePublications();
            fetchPendingPublications();
            fetchArchivedPublications();
        } else {
            fetchUserPublications(user);
        }
    }, [user, profileId]);


    if (userLoading) {
        return (
            <div className={styles.loaderWrapper}>
                <span className={styles.loaderText}>{t("loading")}</span>
            </div>
        );
    }

    if (!user) {
        return <div className={styles.error}>{t("loading")}</div>;
    }

    const avatarUrl = user.avatar ? user.avatar : defaultAvatar;

    const renderPublications = (publications: any[]) => (
        publications.length > 0 ? (
            <div className={styles.publicationsGrid}>
                {publications.map((pub) => (
                    <PublicationCard
                        key={pub.id}
                        id={pub.id}
                        title={pub.title}
                        category={pub.category}
                        images={pub.images}
                        amount={pub.amount}
                        donations={pub.total_donated}
                        views={pub.total_views}
                        created_at={pub.created_at}
                        author_name={pub.author_name}
                        is_favorite={pub.is_favorite}
                    />
                ))}
            </div>
        ) : (
            <p className={styles.noPosts}>{t("no_posts")}</p>
        )
    );

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
                                    <img src={editIcon} alt="Edit" className={styles.editIcon_svg}/>
                                </button>
                            )}
                        </div>
                        <h2 className={styles.name}>{user.first_name} {user.last_name}</h2>
                        <p className={styles.daysWithUs}>
                            {user.days_since_registration === 0
                                ? t("days_together_today")
                                : t("days_together", { count: user.days_since_registration })}
                        </p>
                        <p className={styles.bio}>{user.bio || t('not_specified')}</p>
                        {isOwnProfile && (
                            <div className={`${styles.createPostContainer}`}>
                                <div className={styles.plusIcon} onClick={handleCreatePostClick}>+</div>
                                <button className={styles.createPost} onClick={handleCreatePostClick}>
                                    {t("create_post")}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Правая часть */}
                    <div className={styles.rightSection}>
                        <div className={styles.userInfoCard}>
                            <h3 className={styles.userInfoTitle}>{t("full_info")}</h3>
                            <div className={styles.userInfo}>
                                <div className={styles.infoColumn}>
                                    <div className={styles.infoItem}>
                                        <IconSvg name="locationIcon_profile" width="23px" height="23px" />
                                        <span>{user.city && user.country ? `${user.city}, ${user.country}` : t("not_specified")}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <IconSvg name="calendarIcon_profile" width="23px" height="23px" />
                                        <span>{user.birth_date ? user.birth_date : t("not_specified")}</span>
                                    </div>
                                </div>
                                <div className={styles.infoColumn}>
                                    <div className={styles.infoItem}>
                                        <IconSvg name="emailIcon_profile" width="23px" height="23px" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <IconSvg name="phoneIcon_profile" width="23px" height="23px" />
                                        <span>{user.phone_number ? user.phone_number : t("not_specified")}</span>
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

            <div className={styles.postsSection}>
                {isOwnProfile ? (
                    <>
                        <div className={styles.tabButtons}>
                            <button
                                className={selectedTab === "active" ? styles.activeTab : styles.tab}
                                onClick={() => setSelectedTab("active")}
                            >
                                {t("active_posts")}
                            </button>
                            <button
                                className={selectedTab === "pending" ? styles.activeTab : styles.tab}
                                onClick={() => setSelectedTab("pending")}
                            >
                                {t("pending_posts")}
                            </button>
                            <button
                                className={selectedTab === "archived" ? styles.activeTab : styles.tab}
                                onClick={() => setSelectedTab("archived")}
                            >
                                {t("archived_posts")}
                            </button>
                        </div>

                        {postsLoading ? (
                            <p className={styles.loading}>{t("loading")}</p>
                        ) : selectedTab === "active" ? (
                            renderPublications(activePublications)
                        ) : selectedTab === "pending" ? (
                            renderPublications(pendingPublications)
                        ) : (
                            renderPublications(archivedPublications)
                        )}
                    </>
                ) : (
                    <>
                        {postsLoading ? (
                            <p className={styles.loading}>{t("loading")}</p>
                        ) : (
                            renderPublications(userPublications)
                        )}
                    </>
                )}
            </div>

            {isEditOpen && <ProfileEditPopup key={Date.now()} onClose={() => setIsEditOpen(false)} />}
        </div>
    );
};

export default ProfilePage;
