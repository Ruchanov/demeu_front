import React, { useRef, useState, useEffect } from "react";
import styles from "./styles.module.scss";
import IconSvg from "../../shared/assets/icons/Icon";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { categories } from "../categories/Categories";
import useCheckMobileScreen from "../../shared/lib/mobile_check";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const CategoryList: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useCheckMobileScreen();

    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const swiperRef = useRef<any>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const [slidesPerView, setSlidesPerView] = useState(4);

    useEffect(() => {
        const updateSlidesPerView = () => {
            const width = window.innerWidth;
            const itemWidth = isMobile ? 130 : 170;
            const count = Math.max(1, Math.floor(width / itemWidth));
            setSlidesPerView(count);
        };

        updateSlidesPerView();
        window.addEventListener("resize", updateSlidesPerView);
        return () => window.removeEventListener("resize", updateSlidesPerView);
    }, [isMobile]);

    const handleSlideChange = () => {
        if (swiperRef.current) {
            setIsBeginning(swiperRef.current.isBeginning);
            setIsEnd(swiperRef.current.isEnd);
        }
    };

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.params) {
            swiperRef.current.params.navigation.prevEl = prevRef.current;
            swiperRef.current.params.navigation.nextEl = nextRef.current;
            swiperRef.current.navigation.destroy();
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
        }
    }, [slidesPerView]);

    const handleClick = (category: string) => {
        navigate(`/publications?category=${category}`);
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2>{t("categories")}</h2>
                <div className={styles.navButtons}>
                    <a href="#" className={styles.viewAll} onClick={() => navigate("/categories")}>
                        {t("view_all")}
                    </a>
                    <button ref={prevRef} className={styles.arrow} disabled={isBeginning}>
                        <IconSvg name="leftArrow" />
                    </button>
                    <button ref={nextRef} className={styles.arrow} disabled={isEnd}>
                        <IconSvg name="rightArrow" />
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Navigation]}
                spaceBetween={12}
                slidesPerView={slidesPerView}
                loop={false}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    handleSlideChange();
                }}
                onSlideChange={handleSlideChange}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
            >
                {categories.map((cat) => (
                    <SwiperSlide key={cat.value}>
                        <div className={styles.category} onClick={() => handleClick(cat.value)}>
                            <div className={styles.iconCircle}>
                                <IconSvg name={cat.icon} width="24" height="24" fill="#333" />
                            </div>
                            <span>{t(cat.labelKey as any)}</span>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CategoryList;
