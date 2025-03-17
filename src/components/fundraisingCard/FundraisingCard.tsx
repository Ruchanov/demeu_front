import React, { useState, useEffect } from "react";
import styles from "./FundraisingCard.module.scss";
import SharePopup from "../sharePopup/SharePopup";
import { useTranslation } from "react-i18next";
import {useProfileStore} from "../../store/profileStore";
import Button from "../../shared/ui/button/button";

const formatCurrency = (amount) => {
    if (amount === 0) return "0 ₸";
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M ₸`;
    } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K ₸`;
    }
    return `${amount} ₸`;
};

const FundraisingCard = ({ totalDonated = 0, goal = 1, daysLeft = 0, percentage = 0, author_email }) => {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const { t } = useTranslation();
    const { user } = useProfileStore();
    const isOwner = user?.email === author_email

    console.log("User:", user);
    console.log("Author:", author_email);
    console.log("isOwner:", isOwner);

    const circleRadius = 50;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const [animatedPercentage, setAnimatedPercentage] = useState(0);
    const [progressOffset, setProgressOffset] = useState(circleCircumference);

    useEffect(() => {
        let start = 0;
        const duration = 800; // Время анимации в мс
        const startTime = performance.now();

        const animate = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const newPercentage = progress * percentage;
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
            {/* Круг прогресса с анимацией */}
            <div className={styles.progressCircle}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={circleRadius} stroke="#DCEFE3" strokeWidth="10" fill="none" />
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
                    <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="20px" fill="#17A34A">
                        {Math.round(animatedPercentage)}%
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
                <span>{daysLeft ? daysLeft : "0"} {t("days")}</span>
            </div>

            <button className={styles.shareButton} onClick={() => setIsShareOpen(true)}>{t("share")}</button>

            {isOwner ? (
                <button className={styles.deleteButton}>{t("delete")}</button>
                ) : (
                <button className={styles.donateButton}>{t("donateNow")}</button>
                )}

            {isShareOpen && <SharePopup onClose={() => setIsShareOpen(false)} />}
        </div>
    );
};

export default FundraisingCard;