import React, { useState, useEffect } from "react";
import styles from "./FundraisingCard.module.scss";
import SharePopup from "../sharePopup/SharePopup";
import { useTranslation } from "react-i18next";
import { useProfileStore } from "../../store/profileStore";
import { usePublicationsStore } from "../../store/publicationStore";
import { useNavigate } from "react-router-dom";
import DonationPopup from "../donationsPopup/DonationPopup";

const formatCurrency = (amount: number) => {
    if (amount === 0) return "0 ₸";
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M ₸`;
    } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K ₸`;
    }
    return `${amount} ₸`;
};

interface FundraisingCardProps {
    postId: number;
    totalDonated?: number;
    goal?: number;
    daysLeft?: number;
    durationDays?: number;
    percentage?: number;
    author_id: number;
    author_email: string;
    onDonationSuccess?: () => void;
}


const FundraisingCard: React.FC<FundraisingCardProps> = ({
                                                             postId,
                                                             totalDonated = 0,
                                                             goal = 1,
                                                             daysLeft = 0,
                                                             durationDays = 0,
                                                             percentage = 0,
                                                             author_id,
                                                             onDonationSuccess,
                                                         }) => {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { currentUser } = useProfileStore();
    const { removePublication } = usePublicationsStore();

    const isOwner = currentUser?.user_id === author_id;

    const circleRadius = 50;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const [animatedPercentage, setAnimatedPercentage] = useState(0);
    const [progressOffset, setProgressOffset] = useState(circleCircumference);
    const [isDonationOpen, setDonationOpen] = useState(false);

    const handleOpenDonation = () => {
        setDonationOpen(true);
    };

    const handleCloseDonation = () => {
        setDonationOpen(false);
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(t("are_you_sure_delete"));
        if (!confirmed) return;

        try {
            await removePublication(postId);
            navigate("/profiles/me");
        } catch (error) {
            console.error("❌ Ошибка при удалении:", error);
        }
    };

    useEffect(() => {
        const startTime = performance.now();
        const duration = 800;

        const animate = (time: number) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const newPercentage = progress * Math.min(percentage, 100);
            setAnimatedPercentage(newPercentage);
            setProgressOffset(circleCircumference * (1 - newPercentage / 100));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [percentage]);

    return (
        <div className={styles.fundraisingCard}>
            <div className={styles.progressCircle}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle
                        cx="60"
                        cy="60"
                        r={circleRadius}
                        stroke="#DCEFE3"
                        strokeWidth="10"
                        fill="none"
                    />
                    <circle
                        cx="60"
                        cy="60"
                        r={circleRadius}
                        stroke="#17A34A"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={circleCircumference}
                        strokeDashoffset={progressOffset}
                        strokeLinecap="round"
                        transform="rotate(90 60 60)"
                    />
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dy=".3em"
                        fontSize="20px"
                        fill="#17A34A"
                    >
                        {Math.min(Math.round(animatedPercentage), 100)}%
                    </text>
                </svg>
            </div>

            <p className={styles.amountCollected}>{formatCurrency(totalDonated)}</p>
            <p className={styles.text}>{t("collected")}</p>

            <div className={styles.goalDetails}>
                <span>{t("goal")}</span>
                <span>{formatCurrency(goal)}</span>
            </div>
            <div className={styles.goalDetails}>
                <span>{t("daysLeft")}</span>
                <span>{daysLeft || 0} / {durationDays || "?"} {t("days")}</span>
            </div>

            <button
                className={styles.shareButton}
                onClick={() => setIsShareOpen(true)}
            >
                {t("share")}
            </button>

            {isOwner ? (
                <button
                    className={styles.deleteButton}
                    onClick={handleDelete}
                >
                    {t("delete")}
                </button>
            ) : (
                <button className={styles.donateButton} onClick={handleOpenDonation}>
                    {t("donateNow")}
                </button>
            )}

            {isShareOpen && <SharePopup onClose={() => setIsShareOpen(false)} />}
            {isDonationOpen && (
                <DonationPopup
                    publicationId={postId}
                    onClose={handleCloseDonation}
                    onDonationSuccess={onDonationSuccess}
                />
            )}
        </div>
    );
};

export default FundraisingCard;
