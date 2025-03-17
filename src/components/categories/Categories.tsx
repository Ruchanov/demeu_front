import React from 'react';
import styles from './categories.module.scss';
import IconSvg from "../../shared/assets/icons/Icon";
import { useTranslation } from 'react-i18next';

interface CategoriesProps {
    onSelect: (category: string) => void;
    selectedCategories?: string[];
}

const Categories: React.FC<CategoriesProps> = ({ onSelect, selectedCategories = [] }) => {
    const { t } = useTranslation();

    const categories = [
        { label: t('medicine'), icon: 'cat_med', value: 'medicine' },
        { label: t('emergency'), icon: 'cat_emer', value: 'emergency' },
        { label: t('charity'), icon: 'cat_char', value: 'charity' },
        { label: t('education'), icon: 'cat_edu', value: 'education' },
        { label: t('general'), icon: 'cat_char', value: 'general' },
        { label: t('sports'), icon: 'cat_spo', value: 'sports' },
        { label: t('ecology'), icon: 'cat_env', value: 'ecology' },
        { label: t('animals'), icon: 'cat_ani', value: 'animals' },
    ];

    return (
        <div className={styles.categories}>
            {categories.map((category, index) => (
                <button
                    key={index}
                    className={`${styles.category} ${selectedCategories.includes(category.value) ? styles.selected : ''}`}
                    onClick={() => onSelect(category.value)}
                    aria-label={category.label}
                >
                    <IconSvg name={category.icon} width="20" height="20" fill="#333" className={styles.icon} />
                    {category.label}
                </button>
            ))}
        </div>
    );
};

export default Categories;
