import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePublicationsStore, Publication } from "../../store/publicationStore";
import PublicationCard from "../../components/publicationCard";
import styles from "./allPublicationsPage.module.scss";

const AllPublicationsPage: React.FC = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const type = params.get("type"); // new, top, recommended
    const category = params.get("category"); // medicine, education и т.д.

    const {
        fetchRecommendedPublications,
        fetchNewPublications,
        fetchTopPublications,
        fetchPublications,
        recommendedPublications,
        newPublications,
        topPublications,
        publications,
        fetchFavorites,
    } = usePublicationsStore();

    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            if (category) {
                await fetchPublications({ categories: [category] });
            } else {
                switch (type) {
                    case "recommended":
                        await fetchRecommendedPublications();
                        break;
                    case "new":
                        await fetchNewPublications();
                        break;
                    case "top":
                        await fetchTopPublications();
                        break;
                    default:
                        await fetchPublications();
                }
            }
            // Обновляем избранное после загрузки публикаций
            await fetchFavorites();
            setLoading(false);
        };

        fetchData();
    }, [type, category, fetchRecommendedPublications, fetchNewPublications, fetchTopPublications, fetchPublications, fetchFavorites]);
    useEffect(() => {
        setLoading(true);

        if (category) {
            fetchPublications({ categories: [category] }).finally(() => setLoading(false));
        } else {
            switch (type) {
                case "recommended":
                    fetchRecommendedPublications().finally(() => setLoading(false));
                    break;
                case "new":
                    fetchNewPublications().finally(() => setLoading(false));
                    break;
                case "top":
                    fetchTopPublications().finally(() => setLoading(false));
                    break;
                default:
                    fetchPublications().finally(() => setLoading(false));
            }
        }
    }, [type, category, fetchRecommendedPublications, fetchNewPublications, fetchTopPublications, fetchPublications]);

    const getPublicationsByType = (): Publication[] => {
        if (category) {
            return publications;
        }
        switch (type) {
            case "recommended":
                return recommendedPublications;
            case "new":
                return newPublications;
            case "top":
                return topPublications;
            default:
                return publications;
        }
    };

    const currentPublications = getPublicationsByType();

    return (
        <div className={styles.container}>
            <h1>
                {category
                    ? t(`categories.${category}`)
                    : t(
                        type === "recommended"
                            ? "recommended_publications"
                            : type === "new"
                                ? "new_posts"
                                : type === "top"
                                    ? "top_10_posts"
                                    : "all_publications"
                    )}
            </h1>

            {loading ? (
                <p>{t("loading")}</p>
            ) : (
                <div className={styles.publicationsList}>
                    {currentPublications.length > 0 ? (
                        currentPublications.map((pub) => (
                            <PublicationCard
                                key={pub.id}
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
                        ))
                    ) : (
                        <p>{t("no_publications_found")}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AllPublicationsPage;
