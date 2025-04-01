import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePublicationsStore } from '../../store/publicationStore';
import PublicationCard from '../../components/publicationCard';
import styles from './CategoryDetailPage.module.scss';

const CategoryDetailPage: React.FC = () => {
    const { category } = useParams();
    const { t } = useTranslation();
    const { publications, fetchPublications } = usePublicationsStore();

    useEffect(() => {
        if (category) {
            fetchPublications({ categories: [category] });
        }
    }, [category]);

    const filtered = publications.filter(pub => pub.category === category);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t(category || '')}</h1>
            {filtered.length === 0 ? (
                <p className={styles.noPublications}>{t("no_publications_for_category")}</p>
            ) : (
                <div className={styles.publicationsGrid}>
                    {filtered.map(pub => (
                        <PublicationCard
                            key={pub.id}
                            id={pub.id}
                            title={pub.title}
                            category={pub.category}
                            images={pub.images}
                            amount={pub.amount}
                            donations={pub.total_donated}
                            views={pub.total_views}
                            created_at={pub.created_at}
                            author_name={pub.author_name}
                            is_favorite={pub.is_favorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryDetailPage;