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
                title={'recommended_publications'}
                type={'recommended'}
                publications={recommendedPublications.slice(0, 10)}
            />

            <CategoryList />

            <PublicationList
                title={'new_posts'}
                type={'new'}
                publications={newPublications.slice(0, 10)}
            />

            <PublicationList
                title={'top_10_posts'}
                type={'top'}
                publications={topPublications.slice(0, 10)}
                isTopList={true}
            />
        </div>
    );
};

export default MainPage;
