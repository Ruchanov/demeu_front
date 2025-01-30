import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./categoryPage.module.scss";
import catAni from "../../shared/assets/icons/cat_ani.svg";
import catEdu from "../../shared/assets/icons/cat_edu.svg";
import catEnv from "../../shared/assets/icons/cat_env.svg";
import catEmer from "../../shared/assets/icons/cat_emer.svg";
import catChar from "../../shared/assets/icons/cat_char.svg";
import catMed from "../../shared/assets/icons/cat_med.svg";
import catGen from "../../shared/assets/icons/cat_gen.svg";
import catSpo from "../../shared/assets/icons/cat_spo.svg";

import bg1 from "../../shared/assets/images/bg1.jpg";
import bg2 from "../../shared/assets/images/bg2.jpg";
import bg3 from "../../shared/assets/images/bg3.jpg";
import bg4 from "../../shared/assets/images/bg4.jpg";
import bg5 from "../../shared/assets/images/bg5.jpg";
import bg6 from "../../shared/assets/images/bg6.jpg";
import bg7 from "../../shared/assets/images/bg7.jpg";
import bg8 from "../../shared/assets/images/bg8.jpg";
import bg9 from "../../shared/assets/images/bg9.jpg";

const backgroundImages = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9];

const CategoryPage: React.FC = () => {
    const { t } = useTranslation();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 5000); // Меняем каждые 5 секунд

        return () => clearInterval(interval); // Очищаем таймер при размонтировании
    }, []);

    return (
        <div
            className={styles.container}
            style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}
        >
            <div className={styles.overlay}>
                <h1 className={styles.title}>{t("charity_for_categories")}</h1>
                <p className={styles.subtitle}>{t("description")}</p>

                <div className={styles.categoryWrapper}>
                    <div className={styles.categoryCard}>
                        <img src={catMed} alt={t("medical")} className={styles.icon} />
                        <p>{t("medical")}</p>
                    </div>
                    <div className={styles.categoryCard}>
                        <img src={catEmer} alt={t("emergency")} className={styles.icon} />
                        <p>{t("emergency")}</p>
                    </div>
                    <div className={styles.categoryCard}>
                        <img src={catChar} alt={t("charity")} className={styles.icon} />
                        <p>{t("charity")}</p>
                    </div>
                    <div className={styles.categoryCard}>
                        <img src={catEdu} alt={t("education")} className={styles.icon} />
                        <p>{t("education")}</p>
                    </div>
                    <div className={styles.categoryCard}>
                        <img src={catEnv} alt={t("ecology")} className={styles.icon} />
                        <p>{t("ecology")}</p>
                    </div>
                    <div className={styles.categoryCard}>
                        <img src={catSpo} alt={t("sports")} className={styles.icon} />
                        <p>{t("sports")}</p>
                    </div>
                    <div className={styles.categoryCard}>
                        <img src={catAni} alt={t("animals")} className={styles.icon} />
                        <p>{t("animals")}</p>
                    </div>
                    <div className={styles.categoryCard}>
                        <img src={catMed} alt={t("cancer")} className={styles.icon} />
                        <p>{t("cancer")}</p>
                    </div>
                    <div className={styles.categoryCard}>
                        <img src={catGen} alt={t("general_fundraising")} className={styles.icon} />
                        <p>{t("general_fundraising")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
