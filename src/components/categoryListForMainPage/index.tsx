import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import IconSvg from "../../shared/assets/icons/Icon";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { categories } from "../categories/Categories";

const CategoryList: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(4);
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        const updateVisibleCount = () => {
            setVisibleCount(Math.max(1, Math.floor(window.innerWidth / 180)));
        };

        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);
        return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

    const nextSlide = () => {
        if (startIndex + visibleCount < categories.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const prevSlide = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    const handleClick = (category: string) => {
        navigate(`/publications?category=${category}`);
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2>{t("categories")}</h2>
                <div>
                    <a href="#" className={styles.viewAll} onClick={() => navigate("/publications?type=all")}>
                        {t("view_all")}
                    </a>
                    <button className={styles.arrow} onClick={prevSlide} disabled={startIndex === 0}>
                        <IconSvg name="leftArrow" />
                    </button>
                    <button className={styles.arrow} onClick={nextSlide} disabled={startIndex + visibleCount >= categories.length}>
                        <IconSvg name="rightArrow" />
                    </button>
                </div>
            </div>
            <div className={styles.categories}>
                {categories.slice(startIndex, startIndex + visibleCount).map((cat) => (
                    <div key={cat.value} className={styles.category} onClick={() => handleClick(cat.value)}>
                        <div className={styles.iconCircle}>
                            <IconSvg name={cat.icon} width="24" height="24" fill="#333" />
                        </div>
                        <span>{t(cat.labelKey as any)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
