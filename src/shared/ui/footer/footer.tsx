import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./footer.module.scss";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <p className={styles.footerIntro}>{t("footer_intro")}</p>

                <div className={styles.footerGrid}>
                    <div className={styles.footerColumn}>
                        <h4>{t("footer_links")}</h4>
                        <ul>
                            <li><Link to="/news">{t("footer_news")}</Link></li>
                            <li><Link to="/search">{t("footer_search")}</Link></li>
                            <li><Link to="/categories">{t("footer_categories")}</Link></li>
                        </ul>
                    </div>

                    <div className={styles.footerColumn}>
                        <p>{t("footer_copyright")}</p>
                        <ul>
                            <li><Link to="/terms">{t("footer_terms")}</Link></li>
                            <li><Link to="/help">{t("footer_help")}</Link></li>
                            <li><Link to="/request">{t("footer_request")}</Link></li>
                        </ul>
                    </div>

                    <div className={styles.footerColumn}>
                        <h4>{t("footer_supporters")}</h4>
                        <ul>
                            <li>{t("footer_kaspi")}</li>
                            <li>{t("footer_beeline")}</li>
                            <li>{t("footer_halyk")}</li>
                        </ul>
                    </div>

                    <div className={styles.footerColumn}>
                        <h4>{t("footer_contact")}</h4>
                        <ul>
                            <li>{t("footer_email")}</li>
                            <li>{t("footer_phone")}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
