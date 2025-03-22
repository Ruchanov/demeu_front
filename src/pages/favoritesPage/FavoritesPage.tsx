import React, { useEffect } from 'react';
import { usePublicationsStore } from "../../store/publicationStore";
import PublicationCard from "../../components/publicationCard";
import styles from "./FavoritesPage.module.scss";

const FavoritesPage = () => {
    const { favoritePublications, fetchFavorites } = usePublicationsStore();

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Избранные публикации</h1>
            {favoritePublications.length === 0 ? (
                <p className={styles.noFavorites}>У вас пока нет избранных публикаций.</p>
            ) : (
                <div className={styles.publicationsGrid}>
                    {favoritePublications.map(pub => (
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
                            is_favorite={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
