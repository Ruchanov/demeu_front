// PublicationCard.tsx
import React from 'react';
import styles from './styles.module.scss';
import {useTranslation} from "react-i18next";

interface PublicationProps {
    publication: {
        id: number;
        title: string;
        category: string;
        images: string[];
        videos: string[];
        description: string;
        amount: number;
        views: number;
        donations: number;
    };
}

const PublicationCard: React.FC<PublicationProps> = ({ publication }) => {
    const {t} = useTranslation();
    return (
        <div className={styles.card}>
            <div className={styles.media}>
                {publication.images.length > 0 ? (
                    <img src={publication.images[0]} alt={publication.title} className={styles.image} />
                ) : (
                    <video src={publication.videos[0]} controls className={styles.video}></video>
                )}
            </div>
            <div className={styles.details}>
                <h3>{publication.title}</h3>
                <p>{publication.description}</p>
                <div className={styles.stats}>
                    <span>{publication.amount} ₸ {t('goal')}</span>
                    <span>{publication.views} {t('views')}</span>
                </div>
            </div>
        </div>
    );
};

export default PublicationCard;
