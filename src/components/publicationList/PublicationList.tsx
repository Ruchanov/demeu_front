import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';
import { Publication } from '../../store/publicationStore';
import PublicationCard from '../PublicationCard';
import IconSvg from "../../shared/assets/icons/Icon";

interface PublicationListProps {
    title: string;
    publications: Publication[];
    isTopList?: boolean; // Флаг для нумерации карточек в "ТОП-10 посттар"
}

const PublicationList: React.FC<PublicationListProps> = ({ title, publications, isTopList }) => {
    const { t } = useTranslation();
    const [visibleCount, setVisibleCount] = useState(3); // Кол-во карточек на экране
    const [startIndex, setStartIndex] = useState(0); // Начальный индекс карточек

    useEffect(() => {
        const updateVisibleCount = () => {
            setVisibleCount(Math.max(1, Math.ceil( window.innerWidth / 350)));

        };

        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    const nextSlide = () => {
        if (startIndex + visibleCount < publications.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const prevSlide = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2>{t(title)}</h2>
                <div>
                    <a href="#" className={styles.viewAll}>{t('view_all')}</a>
                    <button className={styles.arrow} onClick={prevSlide} disabled={startIndex === 0}>
                        <IconSvg name="leftArrow" />
                    </button>
                    <button className={styles.arrow} onClick={nextSlide} disabled={startIndex + visibleCount >= publications.length}>
                        <IconSvg name="rightArrow" />
                    </button>
                </div>
            </div>

            <div className={styles.slider}>
                <div className={styles.cardsContainer}>
                    {publications.slice(startIndex, startIndex + visibleCount).map((pub, index) => (
                        <div key={pub.id} className={styles.cardWrapper}>
                            {isTopList && <span className={styles.rank}>{startIndex + index + 1}</span>}
                            <PublicationCard
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PublicationList;
