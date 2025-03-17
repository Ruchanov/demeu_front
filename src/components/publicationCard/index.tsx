import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {Publication, usePublicationsStore} from "../../store/publicationStore";
import IconSvg from "../../shared/assets/icons/Icon";

const PublicationCard: React.FC<Publication> = ({
                                                    id,
                                                    title,
                                                    category,
                                                    images,
                                                    amount,
                                                    donations,
                                                    views,
                                                    created_at,
                                                    author_name,
                                                    is_favorite,
                                                }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const percentage = Math.min(Math.round((donations / amount) * 100), 100);
    const { toggleFavorite } = usePublicationsStore();
    const [isHovered, setIsHovered] = useState(false);
    const [animatedOffset, setAnimatedOffset] = useState(2 * Math.PI * 50);

    const circleRadius = 50;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const progressOffset = circleCircumference * (1 - percentage / 100);

    useEffect(() => {
        if (isHovered) {
            setAnimatedOffset(circleCircumference);
            setTimeout(() => {
                setAnimatedOffset(progressOffset);
            }, 100);
        } else {
            setAnimatedOffset(circleCircumference);
        }
    }, [isHovered, progressOffset]);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    const handleFavoriteClick = async (e: React.MouseEvent) => {
        // e.stopPropagation(); // предотвращает переход на страницу при клике на избранное
        await toggleFavorite(id);
    };
    const handleClick = () => {
        navigate(`/publications/${id}`);
    };

    return (
        <div
            className={styles.card}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles.media}>
                <img src={`http://127.0.0.1:8000${images[0]?.image}`} alt={title} className={styles.image} />
                <div className={styles.overlay}>
                    <div className={styles.topInfo}>
                        <div className={styles.author}>
                            <div className={styles.Circle}>
                                <IconSvg name="authorIcon" />
                            </div>
                            <span>{author_name}</span>
                        </div>
                        <div className={styles.favoriteButton} onClick={handleFavoriteClick}>
                            {is_favorite ? (
                                <IconSvg name="filledFavoritesIcon"/>
                            ) : (
                                <IconSvg name="favoritesIcon" />
                            )}
                        </div>
                    </div>
                    {isHovered && (
                        <div className={styles.progressCircle}>
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r={circleRadius} stroke="#DCEFE3" strokeWidth="10" fill="none" />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r={circleRadius}
                                    stroke="#17A34A"
                                    strokeWidth="10"
                                    fill="none"
                                    strokeDasharray={circleCircumference}
                                    strokeDashoffset={animatedOffset}
                                    strokeLinecap="round"
                                    transform="rotate(-90 60 60)"
                                    className={styles.animatedCircle}
                                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                />
                                <text x="50%" y="45%" textAnchor="middle" fontSize="18px" fill="#17A34A" fontWeight="bold">
                                    {Math.round(percentage)}%
                                </text>
                                <text x="50%" y="60%" textAnchor="middle" fontSize="12px" fill="#17A34A" fontWeight="bold">
                                    {t('collected')}
                                </text>
                            </svg>
                        </div>
                    )}
                    <span className={styles.category}>{category}</span>
                </div>
            </div>
            <div className={styles.details} onClick={handleClick}>
                <div className={styles.dateViews}>
                    <span>👁 {views}</span>
                    <span>{new Date(created_at).toLocaleDateString('kk-KZ', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className={styles.amountSection}>
                    <div className={styles.goal}>
                        <span>{t('goal')}</span>
                        <strong>{amount.toLocaleString()} ₸</strong>
                    </div>
                    <div className={styles.donated}>
                        <span>{t('collected')}</span>
                        <strong>{donations.toLocaleString()} ₸</strong>
                    </div>
                </div>
                <h3>{title}</h3>
                <button className={styles.helpButton}>{t('help_now')}</button>
            </div>
        </div>
    );
};

export default PublicationCard;
