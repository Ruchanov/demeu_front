import React from 'react';
import styles from './styles.module.scss';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface PublicationProps {
    publication: {
        id: number;
        title: string;
        category: string;
        image?: string;
        videos?: string[];
        description: string;
        amount: number;
        views: number;
        donations: number;
    };
}

const PublicationCard: React.FC<PublicationProps> = ({ publication }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/about-post/${publication.id}`);
    };

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '';
        const decodedPath = decodeURIComponent(imagePath);
        console.log("Decoded Image URL:", decodedPath);
        return decodedPath;
    };

    return (
        <div className={styles.card} onClick={handleClick}>
            <div className={styles.media}>
                {publication.image ? (
                    <>
                        {console.log("Rendering Image:", publication.image)}
                        <img
                            src={getImageUrl(publication.image)}
                            alt={publication.title}
                            className={styles.image}
                            style={{ display: "block", border: "2px solid red", width: "200px", height: "200px" }}
                        />
                    </>
                ) : (publication.videos ?? []).length > 0 ? (
                    <video src={publication.videos[0]} controls className={styles.video}></video>
                ) : (
                    <div className={styles.placeholder}>{t("no_media")}</div>
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
