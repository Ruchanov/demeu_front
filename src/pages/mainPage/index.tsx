    import React, { useEffect } from "react";
    import styles from './styles.module.scss';
    import Banner from "../../components/bannerWithStatistics";
    import PhotoGallery from "../../components/photoGallery";
    import PublicationList from "../../components/publicationList/PublicationList";
    import { usePublicationsStore } from "../../store/publicationStore";
    import CategoryList from "../../components/categoryListForMainPage";
    import { useTranslation } from "react-i18next";

    const MainPage: React.FC = () => {
        const {
            fetchRecommendedPublications,
            fetchNewPublications,
            fetchTopPublications,
            recommendedPublications,
            newPublications,
            topPublications
        } = usePublicationsStore();

        const { t } = useTranslation();

        useEffect(() => {
            fetchRecommendedPublications();
            fetchNewPublications();
            fetchTopPublications();
        }, [fetchRecommendedPublications, fetchNewPublications, fetchTopPublications]);

        return (
            <div className={styles.container}>
                <div className={styles.highSection}>
                    <PhotoGallery />
                    <Banner />
                </div>

                <PublicationList
                    title={t('recommended_publications')}
                    publications={recommendedPublications.slice(0, 10)} // Ограничение до 10 публикаций
                />

                <CategoryList />

                <PublicationList
                    title={t('new_posts')}
                    publications={newPublications.slice(0, 10)} // Ограничение до 10 публикаций
                />

                <PublicationList
                    title={t('top_10_posts')}
                    publications={topPublications.slice(0, 10)} // Ограничение до 10 публикаций
                    isTopList={true}
                />
            </div>
        );
    };

    export default MainPage;
