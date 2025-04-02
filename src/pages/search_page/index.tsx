import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import SearchBar from '../../shared/ui/searchBar/SearchBar';
import Categories from '../../components/categories/Categories';
import PublicationCard from '../../components/publicationCard';
import { usePublicationsStore } from '../../store/publicationStore';
import { useTranslation } from 'react-i18next';
import Button from "../../shared/ui/button/button";

const SearchPage = () => {
    const { publications, loading, fetchPublications, fetchFavorites} = usePublicationsStore();
    const resultsRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const getCurrentDate = () => new Date().toISOString().split('T')[0];

    const [filters, setFilters] = useState({
        created_at__gte: '1970-01-01',
        created_at__lte: getCurrentDate(),
        amount__gte: '0',
        amount__lte: '9999999',
        ordering: '',
        search: '',
        categories: [] as string[],
    });

    const [isSearched, setIsSearched] = useState(false);

    const handleScrollToResults = () => {
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };

    const handleSearch = (query: string) => {
        setFilters(prev => ({ ...prev, search: query }));
        setIsSearched(true);
        handleScrollToResults();
    };

    const handleCategorySelect = (category: string) => {
        setFilters(prev => {
            const categories = prev.categories.includes(category)
                ? prev.categories.filter(cat => cat !== category)
                : [...prev.categories, category];
            return { ...prev, categories };
        });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const applyFilters = () => {
        fetchPublications(filters);
        setIsSearched(true);
        handleScrollToResults();
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchPublications(filters);
            await fetchFavorites();
        };

        fetchData();
    }, [filters]); // 👈 ВАЖНО добавить filters в зависимости

    return (
        <div className={styles.container}>
            <div className={styles.textSection}>
                <h1>{t('search_title')}</h1>
                <p>{t('search_subtitle')}</p>
            </div>

            <div className={styles.heroSection}>
                <SearchBar
                    onSearch={handleSearch}
                    placeholder={t('search_placeholder')}
                />
                <div className={styles.categoriesContainer}>
                    <Categories
                        onSelect={handleCategorySelect}
                        selectedCategories={filters.categories}
                    />
                    <label>{t('filter_date')}</label>
                    <div className={styles.dateFilter}>
                        <input className={styles.inputs} type="date" name="created_at__gte" onChange={handleFilterChange} />
                        <input className={styles.inputs} type="date" name="created_at__lte" onChange={handleFilterChange} />
                    </div>

                    <label>{t('filter_amount')}</label>
                    <div className={styles.amountFilter}>
                        <input className={styles.inputs} placeholder={t('filter_from')} type="number" name="amount__gte" onChange={handleFilterChange} />
                        <input className={styles.inputs} placeholder={t('filter_to')} type="number" name="amount__lte" onChange={handleFilterChange} />
                    </div>

                    <button className={styles.applyFiltersBtn} onClick={applyFilters}>
                        {t('apply_filters')}
                    </button>
                </div>
            </div>

            {isSearched && (
                <div ref={resultsRef} className={styles.resultsSection}>
                    {loading && <p>{t('loading')}</p>}

                    {!loading && publications.length === 0 && <p>{t('no_results')}</p>}

                    {!loading && publications.length > 0 && (
                        <>
                            <div className={styles.sortWrapper}>
                                <label className={styles.sortLabel}>{t('sort_by')}</label>
                                <select
                                    className={styles.sortSelect}
                                    name="ordering"
                                    onChange={handleFilterChange}
                                >
                                    <option value="-total_views">{t('sort_most_views')}</option>
                                    <option value="total_views">{t('sort_least_views')}</option>
                                </select>
                            </div>

                            <div className={styles.publicationsGrid}>
                                {publications.map((pub) => (
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
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;