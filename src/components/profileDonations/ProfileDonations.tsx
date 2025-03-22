import React from "react";
import { useProfileStore } from "../../store/ProfileStore";
import IconSvg from "../../shared/assets/icons/Icon";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./ProfileDonations.module.scss";

const getDaysAgo = (dateString: string, t: any) => {
    if (!dateString) return t("unknown_date");

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("today");
    if (diffDays === 1) return t("yesterday");
    return t("days_ago", { count: diffDays });
};

const ProfileDonations: React.FC = () => {
    const { user } = useProfileStore();
    const { t } = useTranslation();
    const donations = user?.latest_donations?.slice(0, 5) || [];

    if (donations.length === 0) return null;

    return (
        <div className={styles.donationsContainer}>
            <h3 className={styles.title}>{t("latest_donations")}</h3>
            <ul className={styles.donationList}>
                {donations.map((donation, index) => (
                    <li key={index} className={styles.donationItem}>
                        <div className={styles.donationInfo}>
                            <div className={styles.donationIconWrapper}>
                                <IconSvg name="donationIcon" width="30px" height="30px" />
                            </div>
                            <div>
                                <Link to={`/publications/${donation.publication_id}`} className={styles.publicationLink}>
                                    {donation.publication_title}
                                </Link>
                                <p className={styles.donationDate}>
                                    {getDaysAgo(donation.publication_created_at, t)}
                                </p>
                            </div>
                        </div>
                        <div className={styles.donationDetails}>
                            <span className={styles.donationAmount}>
                                {donation.donor_amount ? `${donation.donor_amount} ₸` : "-"}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileDonations;