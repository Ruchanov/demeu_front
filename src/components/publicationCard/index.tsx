import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Publication, usePublicationsStore } from "../../store/publicationStore";
import IconSvg from "../../shared/assets/icons/Icon";
import DonationPopup from "../donationsPopup/DonationPopup";

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
                                                    onDonateClick,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { toggleFavorite } = usePublicationsStore();
    const [isHovered, setIsHovered] = useState(false);
    // const [animatedOffset, setAnimatedOffset] = useState(2 * Math.PI * 50);
    const cleanDonations = typeof donations === 'number' ? donations : donations?.amount || 0;
    const cleanViews = typeof views === 'number' ? views : views?.amount || 0;

    const percentage = Math.min(Math.round((cleanDonations / amount) * 100), 100);

    const circleRadius = 50;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const progressOffset = circleCircumference * (1 - percentage / 100);
    const [animatedOffset, setAnimatedOffset] = useState(circleCircumference);

    // Состояние для показа DonationPopup
    const [isDonationOpen, setDonationOpen] = useState(false);

    const handleOpenDonation = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDonationOpen(true);
    };
    const handleCloseDonation = () => {
        setDonationOpen(false);
    };

    useEffect(() => {
        if (isHovered) {
            // Сначала «убираем» анимацию
            setAnimatedOffset(circleCircumference);
            // Через 100мс — устанавливаем конечное значение
            setTimeout(() => {
                setAnimatedOffset(progressOffset);
            }, 100);
        } else {
            // Если не наведено, обнуляем
            setAnimatedOffset(circleCircumference);
        }
    }, [isHovered, progressOffset]);

    // Обработчики ховера
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Добавить/удалить из избранного
    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await toggleFavorite(id);
    };

    // Переход на детальную страницу
    const handleCardClick = () => {
        navigate(`/publications/${id}`);
    };

    // Получаем URL картинки (проверяем абсолютный путь или локальный)
    const imageUrl = images[0]?.image.startsWith("http")
        ? images[0].image
        : `http://127.0.0.1:8000${images[0]?.image}`;

    return (
        <>
            <div
                className={styles.card}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleCardClick}
            >
                <div className={styles.media}>
                    <img
                        src={imageUrl}
                        alt={title}
                        className={styles.image}
                    />
                    <div className={styles.overlay}>
                        <div className={styles.topInfo}>
                            <div className={styles.author}>
                                <div className={styles.Circle}>
                                    <IconSvg name="authorIcon" />
                                </div>
                                <span>{author_name}</span>
                            </div>
                            <div
                                className={styles.favoriteButton}
                                onClick={handleFavoriteClick}
                            >
                                {is_favorite ? (
                                    <IconSvg name="filledFavoritesIcon" />
                                ) : (
                                    <IconSvg name="favoritesIcon" />
                                )}
                            </div>
                        </div>

                        {isHovered && (
                            <div className={styles.progressCircle}>
                                <svg width="120" height="120" viewBox="0 0 120 120">
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r={circleRadius}
                                        stroke="#DCEFE3"
                                        strokeWidth="10"
                                        fill="none"
                                    />
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
                                        style={{
                                            transition: 'stroke-dashoffset 1s ease-in-out'
                                        }}
                                    />
                                    <text
                                        x="50%"
                                        y="45%"
                                        textAnchor="middle"
                                        fontSize="18px"
                                        fill="#17A34A"
                                        fontWeight="bold"
                                    >
                                        {Math.round(percentage)}%
                                    </text>
                                    <text
                                        x="50%"
                                        y="60%"
                                        textAnchor="middle"
                                        fontSize="12px"
                                        fill="#17A34A"
                                        fontWeight="bold"
                                    >
                                        {t('collected')}
                                    </text>
                                </svg>
                            </div>
                        )}

                        <span className={styles.category}>
                            {category}
                        </span>
                    </div>
                </div>

                <div className={styles.details}>
                    <div className={styles.dateViews}>
                        <span>👁 {cleanViews.toLocaleString()}</span>
                        <span>{new Date(created_at).toLocaleDateString('kk-KZ', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className={styles.amountSection}>
                        <div className={styles.goal}>
                            <span>{t('goal')}</span>
                            <strong>{amount.toLocaleString()} ₸</strong>
                        </div>
                        <div className={styles.donated}>
                            <span>{t('collected')}</span>
                            <strong>{cleanDonations.toLocaleString()} ₸</strong>
                        </div>
                    </div>
                    <h3>{title}</h3>
                    <button
                        className={styles.helpButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDonation(e);
                            onDonateClick?.(id);
                        }}
                    >
                        {t('help_now')}
                    </button>
                </div>
            </div>
            {/* Модальное окно вынесено на уровень выше (соседом),
                чтобы оно не было вложено в .card */}
            {isDonationOpen && ( <DonationPopup
                    publicationId={id}
                    onClose={handleCloseDonation}
                />
            )}
        </>
    );
};

export default PublicationCard;
