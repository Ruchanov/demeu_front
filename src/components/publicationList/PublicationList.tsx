    import React, { useState, useEffect, useRef } from 'react';
    import styles from './styles.module.scss';
    import { useTranslation } from 'react-i18next';
    import { Publication } from '../../store/publicationStore';
    import PublicationCard from '../PublicationCard';
    import IconSvg from "../../shared/assets/icons/Icon";
    import { Swiper, SwiperSlide } from 'swiper/react';
    import { Navigation } from 'swiper/modules';
    import { Link } from 'react-router-dom';
    import 'swiper/css';
    import 'swiper/css/navigation';

    interface PublicationListProps {
        title: string;
        publications: Publication[];
        type: 'recommended' | 'new' | 'top';
        isTopList?: boolean;
    }

    const PublicationList: React.FC<PublicationListProps> = ({ title, publications, type, isTopList }) => {
        const { t } = useTranslation();
        const [visibleCount, setVisibleCount] = useState(3);
        const swiperRef = useRef<any>(null);
        const prevRef = useRef<HTMLButtonElement>(null);
        const nextRef = useRef<HTMLButtonElement>(null);
        const [isBeginning, setIsBeginning] = useState(true);
        const [isEnd, setIsEnd] = useState(false);

        useEffect(() => {
            const updateVisibleCount = () => {
                setVisibleCount(Math.max(1, Math.floor(window.innerWidth / 350)));
            };

            updateVisibleCount();
            window.addEventListener('resize', updateVisibleCount);
            return () => window.removeEventListener('resize', updateVisibleCount);
        }, []);

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
                handleSlideChange();
            }
        }, [visibleCount, publications]);

        return (
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>{t(title)}</h2>
                    <div className={styles.navButtons}>
                        <Link to={`/publications?type=${type}`} className={styles.viewAll}>
                            {t('view_all')}
                        </Link>
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
                    spaceBetween={20}
                    slidesPerView={visibleCount}
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
                    touchStartPreventDefault={false}
                    touchMoveStopPropagation={false}
                >
                    {publications.map((pub, index) => (
                        <SwiperSlide key={pub.id}>
                            <div className={styles.cardWrapper}>
                                {isTopList && <span className={styles.rank}>{index + 1}</span>}
                                <PublicationCard
                                    id={pub.id}
                                    title={pub.title}
                                    category={pub.category}
                                    images={pub.images}
                                    videos={pub.videos}
                                    description={pub.description}
                                    amount={pub.amount}
                                    views={pub.total_views}
                                    donations={pub.total_donated}
                                    created_at={pub.created_at}
                                    author_name={pub.author_name}
                                    is_favorite={pub.is_favorite}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    };

    export default PublicationList;
