import React, { useEffect } from "react";
import styles from "./DonorList.module.scss";
import { usePublicationsStore } from "../../store/publicationStore";
import defaultAvatar from "../../shared/assets/images/profile_donate.png";
import { useTranslation } from "react-i18next";

const formatAmount = (amount) => {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M ₸`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K ₸`;
    return `${amount.toFixed(2)} ₸`;
};

const getDaysAgo = (dateString, t) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("today");
    if (diffDays === 1) return t("yesterday");
    return t("days_ago", { count: diffDays });
};

const DonorList = ({ postId }) => {
    const { topDonors, loading, error, fetchTopDonors } = usePublicationsStore();
    const { t } = useTranslation();

    useEffect(() => {
        if (postId) {
            fetchTopDonors(postId);
        }
    }, [postId, fetchTopDonors]);

    if (loading) return <p>{t("loading")}...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>{t("top_donors")}</h3>
            {topDonors.length > 0 ? (
                <ul className={styles.list}>
                    {topDonors.map((donor, index) => {
                        const avatarUrl = donor.avatar ? donor.avatar : defaultAvatar;
                        return (
                            <li key={index} className={styles.donorItem}>
                                <div className={styles.avatar}>
                                    <img src={avatarUrl} alt="Donor Avatar" />
                                </div>
                                <div className={styles.donorInfo}>
                                    <span className={styles.name}>{donor.donor_name}</span>
                                    <span className={styles.date}>{getDaysAgo(donor.created_at, t)}</span>
                                </div>
                                <span className={styles.amount}>{formatAmount(donor.donor_amount)}</span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className={styles.noData}>{t("no_donations")}</p>
            )}
        </div>
    );
};

export default DonorList;
