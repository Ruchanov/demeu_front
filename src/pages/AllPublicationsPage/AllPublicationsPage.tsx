import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePublicationsStore } from "../../store/publicationStore";
import PublicationCard from "../../components/publicationCard";
import styles from "./allPublicationsPage.module.scss";

const AllPublicationsPage: React.FC = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const type = params.get("type"); // new, top, recommended
    const category = params.get("category"); // medicine, education и т.д.

    const { fetchRecommendedPublications, fetchNewPublications, fetchTopPublications, fetchPublications, publications } =
        usePublicationsStore();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (category) {
            fetchPublications({ categories: [category] }).then(() => setLoading(false));
        } else {
            switch (type) {
                case "recommended":
                    fetchRecommendedPublications().then(() => setLoading(false));
                    break;
                case "new":
                    fetchNewPublications().then(() => setLoading(false));
                    break;
                case "top":
                    fetchTopPublications().then(() => setLoading(false));
                    break;
                default:
                    setLoading(false);
            }
        }
    }, [type, category, fetchRecommendedPublications, fetchNewPublications, fetchTopPublications, fetchPublications]);

    return (
        <div className={styles.container}>
            <h1>
                {category
                    ? t(`categories.${category}`)
                    : t(type === "recommended" ? "recommended_publications" : type === "new" ? "new_posts" : "top_10_posts")}
            </h1>

            {loading ? (
                <p>{t("loading")}</p>
            ) : (
                <div className={styles.publicationsList}>
                    {publications.length > 0 ? (
                        publications.map((pub) => (
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
