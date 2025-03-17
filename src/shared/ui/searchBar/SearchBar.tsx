import React, { useState } from 'react';
import styles from './searchBar.module.scss';
import Input from '../input/Input';
import Button from '../button/Button';
import {useTranslation} from "react-i18next";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Іздеу...', className }) => {
    const [query, setQuery] = useState('');

    const { t } = useTranslation();
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form className={`${styles.searchBar} ${className || ''}`} onSubmit={handleSearch}>
            <Input
                type="text"
                name="search"
                value={query}
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.input}
                iconName="searchIcon2"
            />
            <Button type="submit" className={styles.button}>
                {t('search')}
            </Button>
        </form>
    );
};

export default SearchBar;
