import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import IconSvg from '../../assets/icons/Icon';
import styles from './style.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../../store/auth/authSlice";
import Button from "../button/button";
import {AppDispatch} from "../../../app/store";

export const Header = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  // const isAuthenticated = true
  const user = useSelector((state: any) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };
  const handleToggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
  };
  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };
  const handleMenuItemClick = () => {
    setIsMenuOpen(false); // Закрываем меню при выборе пункта.
  };

  return (
    <header className={styles.header}>
      <Link to="/" aria-label="Go to main page">
        <IconSvg name="D_white" width="80px" height="65px" />
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
                  <Link to="/profile" className={styles.dropdownItem} onClick={handleMenuItemClick}>
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

      {/*<div className={styles.languageSwitcher}>*/}
      {/*  <button*/}
      {/*    className={`${styles.button} ${currentLanguage === 'kz' ? styles.active : ''}`}*/}
      {/*    onClick={() => handleChangeLanguage('kz')}*/}
      {/*  >*/}
      {/*    KZ*/}
      {/*  </button>*/}
      {/*  <button*/}
      {/*    className={`${styles.button} ${currentLanguage === 'ru' ? styles.active : ''}`}*/}
      {/*    onClick={() => handleChangeLanguage('ru')}*/}
      {/*  >*/}
      {/*    RU*/}
      {/*  </button>*/}
      {/*  <button*/}
      {/*    className={`${styles.button} ${currentLanguage === 'en' ? styles.active : ''}`}*/}
      {/*    onClick={() => handleChangeLanguage('en')}*/}
      {/*  >*/}
      {/*    EN*/}
      {/*  </button>*/}
      {/*</div>*/}
    </header>
  );
};

export default Header;
