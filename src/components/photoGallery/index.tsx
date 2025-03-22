import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

import main1 from '../../shared/assets/images/main1.png';
import main2 from '../../shared/assets/images/main2.png';
import main3 from '../../shared/assets/images/main3.png';
import {useTranslation} from "react-i18next";

const images = [main1, main2, main3];

const PhotoBanner: React.FC = () => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true);
            setTimeout(() => {
                setCurrentIndex(nextIndex);
                setNextIndex((prev) => (prev + 1) % images.length);
                setFade(false);
            }, 1000);
        }, 5000);

        return () => clearInterval(interval);
    }, [nextIndex]);

    return (
        <div className={styles.banner}>
            <div className={`${styles.image} ${fade ? styles.fadeOut : styles.fadeIn}`} style={{ backgroundImage: `url(${images[currentIndex]})` }} />
            <div className={styles.overlay}>
                <h2>{t('banner_title')}</h2>
                <p>{t('banner_description')}</p>
            </div>
        </div>
    );
};

export default PhotoBanner;
