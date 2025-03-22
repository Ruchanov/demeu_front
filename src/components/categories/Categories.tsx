import React from 'react';
import styles from './categories.module.scss';
import IconSvg from "../../shared/assets/icons/Icon";
import { useTranslation } from 'react-i18next';


export const categories = [
    { labelKey: 'medicine', icon: 'cat_med', value: 'medicine' },
    { labelKey: 'emergency', icon: 'cat_emer', value: 'emergency' },
    { labelKey: 'charity', icon: 'cat_char', value: 'charity' },
    { labelKey: 'education', icon: 'cat_edu', value: 'education' },
    { labelKey: 'general', icon: 'cat_char', value: 'general' },
    { labelKey: 'sports', icon: 'cat_spo', value: 'sports' },
    { labelKey: 'ecology', icon: 'cat_env', value: 'ecology' },
    { labelKey: 'animals', icon: 'cat_ani', value: 'animals' },
];


interface CategoriesProps {
    onSelect: (category: string) => void;
    selectedCategories?: string[];
}

const Categories: React.FC<CategoriesProps> = ({ onSelect, selectedCategories = [] }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.categories}>
            {categories.map((category, index) => (
                <button
                    key={index}
                    className={`${styles.category} ${selectedCategories.includes(category.value) ? styles.selected : ''}`}
                    onClick={() => onSelect(category.value)}
                    aria-label={t(category.labelKey as any)}
                >
                    <IconSvg name={category.icon} width="20" height="20" fill="#333" className={styles.icon} />
                    {t(category.labelKey as any)}
                </button>
            ))}
        </div>
    );
};

export default Categories;
