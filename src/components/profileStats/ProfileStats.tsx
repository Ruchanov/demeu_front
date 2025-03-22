import React from "react";
import { useTranslation } from "react-i18next";
import { useProfileStore } from "../../store/ProfileStore";
import styles from "./ProfileStats.module.scss";
import IconSvg from "../../shared/assets/icons/Icon";

const ProfileStats: React.FC = () => {
    const { t } = useTranslation();
    const { profileStats } = useProfileStore();

    const stats = [
        { icon: "postsIcon", count: profileStats.posts, label: t("posts"), bgColor: "#C3F5E1" },
        { icon: "donationsIcon", count: `${profileStats.donations.toLocaleString()} ₸`, label: t("donations"), bgColor: "#FFD6E0" },
        { icon: "savedIcon", count: profileStats.savedPosts, label: t("saved_posts"), bgColor: "#DAE9FF" },
        { icon: "viewsIcon", count: profileStats.views, label: t("views"), bgColor: "#EBD8FF" },
    ];

    return (
        <div className={styles.statsContainer}>
            {stats.map((stat, index) => (
                <div key={index} className={styles.statCard}>
                    <div className={styles.iconWrapper} style={{ backgroundColor: stat.bgColor }}>
                        <IconSvg name={stat.icon} width="30px" height="30px" />
                    </div>
                    <div className={styles.statValue}>{stat.count}</div>
                    <div className={styles.statLabel}>{stat.label}</div>
                </div>
            ))}
        </div>
    );
};

export default ProfileStats;
