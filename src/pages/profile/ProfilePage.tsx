import React, { useEffect, useState, useCallback } from "react";
import styles from "./ProfilePage.module.scss";
import { useProfileStore } from "../../store/profileStore";
import { useNavigate } from "react-router-dom";
import IconSvg from "../../shared/assets/icons/Icon";
import ProfileEditPopup from "../../components/profileEditPopup/ProfileEditPopup";
import UserPostList from "../../components/userPosts/UserPostList";
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
    const { user, isAuthenticated, fetchUserProfile } = useProfileStore();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/auth");
        } else {
            fetchUserProfile();
        }
    }, [isAuthenticated, fetchUserProfile, navigate]);

    if (!user) {
        return <p>Загрузка...</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.profileContent}>
                <div className={styles.leftSide}>
                    <img src={user.avatar} alt="Avatar" className={styles.avatar} />
                    <div className={`${styles.changeIcon} ${styles.mobileEdit}`} onClick={() => setPopupOpen(true)}>
                        <IconSvg name="change_icon" width="30px" height="30px" />
                    </div>
                    <h2>{user.first_name} {user.last_name}</h2>
                    <p className={styles.userLocation}>
                        {user.country && user.city ? `${user.country} / ${user.city}` : "Kazakhstan / Almaty"}
                    </p>
                    <div className={`${styles.createPostContainer} ${styles.desktopOnly}`}>
                        <div className={styles.plusIcon}>+</div>
                        <button className={styles.createPost}>{t('create_post')}</button>
                    </div>
                </div>

                <div className={styles.rightSide}>
                    <div className={styles.contactInfo}>
                        <p><strong>{t('email')}:</strong> {user.email}</p>
                        <p><strong>{t('phone')}:</strong> {user.phone_number || "Не указан"}</p>
                        <div
                            className={`${styles.changeIcon} ${styles.desktopEdit}`}
                            onClick={() => {
                                setPopupOpen(true);
                            }}>
                            <IconSvg name="change_icon" width="30px" height="30px" />
                        </div>
                    </div>
                    <p className={styles.birthDate}><strong>{t('birth_date')}:</strong> {user.birth_date || t('not_provided')}</p>
                    <p className={styles.userBio}>{user.bio || "Пользователь пока не добавил описание."}</p>

                    <div className={styles.socialIcons}>
                        {user.instagram && <a href={user.instagram}><IconSvg name="instagram_icon" width="40px" height="40px" /></a>}
                        {user.facebook && <a href={user.facebook}><IconSvg name="facebook_icon" width="40px" height="40px" /></a>}
                        {user.whatsapp && <a href={user.whatsapp}><IconSvg name="whatsapp_icon" width="40px" height="40px" /></a>}
                        {user.telegram && <a href={user.telegram}><IconSvg name="telegram_icon" width="40px" height="40px" /></a>}
                    </div>

                    <div className={`${styles.createPostContainer} ${styles.mobileOnly}`}>
                        <div className={styles.plusIcon}>+</div>
                        <button className={styles.createPost}>{t('create_post')}</button>
                    </div>
                </div>
            </div>

            {isPopupOpen && <ProfileEditPopup onClose={() => setPopupOpen(false)} />}

            <div className={styles.postsContainer}>
                <h2>Жазбалар:</h2>
                <div className={styles.postsPlaceholder}>
                    <UserPostList />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
