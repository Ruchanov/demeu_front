import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import IconSvg from '../../assets/icons/Icon';
import styles from './style.module.scss';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language; 

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo} aria-label="Go to main page">
        <IconSvg name="D" width="60px" height="60px" />
      </Link>

      <nav className={styles.nav} aria-label="Main navigation">
        <Link to="/news" className={styles.navLink}>
          {t('news')}
        </Link>
        <Link to="/search" className={styles.navLink}>
          {t('search')}
        </Link>
        <Link to="/info" className={styles.navLink}>
          {t('info')}
        </Link>
      </nav>

      <div className={styles.languageSwitcher}>
        <button
          className={`${styles.button} ${currentLanguage === 'kz' ? styles.active : ''}`}
          onClick={() => handleChangeLanguage('kz')}
        >
          KZ
        </button>
        <button
          className={`${styles.button} ${currentLanguage === 'ru' ? styles.active : ''}`}
          onClick={() => handleChangeLanguage('ru')}
        >
          RU
        </button>
        <button
          className={`${styles.button} ${currentLanguage === 'en' ? styles.active : ''}`}
          onClick={() => handleChangeLanguage('en')}
        >
          EN
        </button>
      </div>
    </header>
  );
};

export default Header;
