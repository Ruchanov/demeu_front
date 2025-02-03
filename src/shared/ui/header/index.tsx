import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import IconSvg from '../../assets/icons/Icon';
import styles from './style.module.scss';
import {useAuthStore} from "../../../store/authStore";
import useCheckMobileScreen from "../../lib/mobile_check";

export const Header = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const currentLanguage = i18n.language;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const isMobile = useCheckMobileScreen();
  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/');
  };
  const handleToggleMenu = () => {
    setIsLanguageMenuOpen(false);
    setIsMenuOpen((prev) => !prev);
  };
  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    setIsLanguageMenuOpen(false);
  };
  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <Link to="/" aria-label="Go to main page">
        {isMobile ? <IconSvg name="D_white" width="50px" height="45px" /> : <IconSvg name="D_white" width="80px" height="65px" />}
      </Link>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link to="/news" className={styles.navLink}>
          {isMobile ? <IconSvg name="newsIcon" width="25px" height="25px"/> : <span>{t('news')}</span>}
        </Link>
        <Link to="/search" className={styles.navLink}>
          {isMobile ? <IconSvg name="searchIcon" width="25px" height="25px" /> : <span>{t('search')}</span>}
        </Link>
        <Link to="/categories" className={styles.navLink}>
          {isMobile ? <IconSvg name="categoriesIcon" width="25px" height="25px" /> : <span>{t('categories')}</span>}
        </Link>
        {isAuthenticated &&(
            <Link to="/favorites" className={styles.navLink}>
              {isMobile ? <IconSvg name="favoritesIcon" width="25px" height="25px" /> : <span>{t('favorites')}</span>}
            </Link>
        )}
      </nav>
      <div className={styles.languageSwitcher}>
        <button
            className={styles.currentLanguage}
            onClick={() => {setIsLanguageMenuOpen((prev) => !prev);
                            setIsMenuOpen(false)}}
            aria-label="Current Language"
        >
          {currentLanguage.toUpperCase()}
        </button>
        {isLanguageMenuOpen && (
            <div className={styles.languageMenu}>
              <div
                  className={`${styles.languageOption} ${
                      currentLanguage === 'kz' ? styles.active : ''
                  }`}
                  onClick={() => handleChangeLanguage('kz')}
              >
                Қазақша
              </div>
              <div
                  className={`${styles.languageOption} ${
                      currentLanguage === 'ru' ? styles.active : ''
                  }`}
                  onClick={() => handleChangeLanguage('ru')}
              >
                Русский
              </div>
              <div
                  className={`${styles.languageOption} ${
                      currentLanguage === 'en' ? styles.active : ''
                  }`}
                  onClick={() => handleChangeLanguage('en')}
              >
                English
              </div>
            </div>
        )}
      </div>
        {isAuthenticated ?(
          <div className={styles.userMenu}>
            <button
                className={styles.userMenuButton}
                onClick={handleToggleMenu}
                aria-label="User menu"
            >
              <IconSvg name="menu" width="40px" height="40px" />
            </button>
            {isMenuOpen &&(
                <div className={styles.dropdownMenu}>
                  <Link to="/profile/me" className={styles.dropdownItem} onClick={handleMenuItemClick}>
                    <IconSvg name="personIcon" width="30px" height="30px"></IconSvg>
                    {t('profile')}
                  </Link>
                  <Link to="/about" className={styles.dropdownItem} onClick={handleMenuItemClick}>
                    <IconSvg name="peopleIcon" width="30px" height="30px"></IconSvg>
                    {t('aboutUs')}
                  </Link>
                  <Link to="/settings" className={styles.dropdownItem} onClick={handleMenuItemClick}>
                    <IconSvg name="settingsIcon" width="30px" height="30px"></IconSvg>
                    {t('settings')}
                  </Link>
                  <Link to="/support" className={styles.dropdownItem} onClick={handleMenuItemClick}>
                    <IconSvg name="techSupportIcon" width="30px" height="30px"></IconSvg>
                    {t('tech_support')}
                  </Link>
                  <Link to="/rules" className={styles.dropdownItem} onClick={handleMenuItemClick}>
                    <IconSvg name="rulesIcon" width="30px" height="30px"></IconSvg>
                    {t('privacy_rules')}
                  </Link>
                  <button onClick={handleLogout} className={styles.logoutItem}>
                    <IconSvg name="logoutIcon" width="30px" height="30px"></IconSvg>
                    {t('logout')}
                  </button>
                </div>
            )

            }
          </div>
        ):(
            <Link to="/auth" className={styles.authLink}>
                {t('login')}
            </Link>
        )}
    </header>
  );
};

export default Header;
