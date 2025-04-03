import { useTranslation } from "react-i18next";
import Footer from "../../components/footer/footer";
import styles from "./aboutUs.module.scss";
import useCheckMobileScreen from "../../shared/lib/mobile_check";
import React from "react";
import IconSvg from "../../shared/assets/icons/Icon";

const About = () => {
    const { t } = useTranslation();
    const isMobile = useCheckMobileScreen();

    return (
        <div className={styles.aboutPage}>
            <section className={styles.heroSection}>
                <div className={styles.heroText}>
                    <h1>{t("hero_title")}</h1>
                    <p>{t("hero_description")}</p>
                </div>
                {!isMobile &&(
                    <>
                        <div className={styles.heroLogo}>
                            <IconSvg name="demeu_logo" width="30vw" height="40vh" />
                        </div>
                        <div className={styles.circle + " " + styles.circle1}></div>
                        <div className={styles.circle + " " + styles.circle2}></div>
                        <div className={styles.circle + " " + styles.circle3}></div>
                    </>
                )}
            </section>

            <section className={styles.valuesSection}>
                <h2>{t("values_title")}</h2>
                <div className={styles.valuesGrid}>
                    <div className={styles.valueCard}>
                        <h3>{t("value_transparency")}</h3>
                        <p>{t("value_transparency_desc")}</p>
                    </div>
                    <div className={styles.valueCard}>
                        <h3>{t("value_reliability")}</h3>
                        <p>{t("value_reliability_desc")}</p>
                    </div>
                    <div className={styles.valueCard}>
                        <h3>{t("value_cooperation")}</h3>
                        <p>{t("value_cooperation_desc")}</p>
                    </div>
                </div>
            </section>

            <section className={styles.howItWorks}>
                <h2>{t("how_it_works")}</h2>
                <div className={styles.videoContainer}>
                    <div className={styles.videoPlaceholder}>
                        <div className={styles.playIcon}>▶</div>
                    </div>
                </div>
            </section>

            <section className={styles.statsSection}>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <strong>500+</strong>
                        <p>{t("stats_people_helped")}</p>
                    </div>
                    <div className={styles.statCard}>
                        <strong>10 000 000₸</strong>
                        <p>{t("stats_money_collected")}</p>
                    </div>
                    <div className={styles.statCard}>
                        <strong>2500+</strong>
                        <p>{t("stats_donors")}</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
