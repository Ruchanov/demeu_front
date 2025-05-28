import { useTranslation } from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import IconSvg from '../../assets/icons/Icon';
import styles from './style.module.scss';
import {useAuthStore} from "../../../store/authStore";
import useCheckMobileScreen from "../../lib/mobile_check";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {fetchNotifications} from "../../../api/notificationApi";
import { useLocation } from 'react-router-dom';


export const Header = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const currentLanguage = i18n.language;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const isMobile = useCheckMobileScreen();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);



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

  useEffect(() => {
    if (location.pathname === '/notifications') {
      setHasUnreadNotifications(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?token=${token}`);
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && !data.is_read) {
          setHasUnreadNotifications(true);
        }
      } catch (error) {
        console.error("Ошибка при парсинге уведомления:", error);
      }
    };
    socket.onopen = () => {
      console.log("WebSocket соединение установлено");
    };

    socket.onclose = () => {
      console.log("WebSocket соединение закрыто");
    };
    return () => socket.close();
  }, []);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          menuButtonRef.current &&
          !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }

      if (
          languageMenuRef.current &&
          !languageMenuRef.current.contains(event.target as Node) &&
          languageButtonRef.current &&
          !languageButtonRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className={styles.header}>
      <Link to="/" aria-label="Go to main page">
        {isMobile ? <IconSvg name="D_white" width="50px" height="45px" /> : <IconSvg name="D_white" width="80px" height="65px" />}
      </Link>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link to="/" className={styles.navLink}>
          {isMobile ? <IconSvg name="newsIcon" width="25px" height="25px"/> : <span>{t('main_page')}</span>}
        </Link>
        <Link to="/search" className={styles.navLink}>
          {isMobile ? <IconSvg name="searchIcon" width="25px" height="25px" /> : <span>{t('search')}</span>}
        </Link>
        <Link to="/categories" className={styles.navLink}>
          {isMobile ? <IconSvg name="categoriesIcon" width="25px" height="25px" /> : <span>{t('categories')}</span>}
        </Link>
        {isAuthenticated &&(
            <Link to="/favorites" className={styles.navLink}>
              {isMobile ? <IconSvg name="favouriteIconWhite" width="25px" height="25px" /> : <span>{t('favorites')}</span>}
            </Link>
        )}
      </nav>
      <div className={styles.languageSwitcher}>
        <button
            ref={languageButtonRef}
            className={styles.currentLanguage}
            onClick={() => {setIsLanguageMenuOpen((prev) => !prev);
                            setIsMenuOpen(false)}}
            aria-label="Current Language"
        >
          {currentLanguage.toUpperCase()}
        </button>
        {isLanguageMenuOpen && (
            <div  ref={languageMenuRef} className={styles.languageMenu}>
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
                ref={menuButtonRef}
                className={styles.userMenuButton}
                onClick={handleToggleMenu}
                aria-label="User menu"
            >
              <IconSvg name="menu" width="40px" height="40px" />
            </button>
            {isMenuOpen &&(
                <div ref={menuRef} className={styles.dropdownMenu}>
                  <Link to="/profiles/me" className={styles.dropdownItem} onClick={handleMenuItemClick}>
                    <IconSvg name="personIcon" width="30px" height="30px"></IconSvg>
                    {t('profile')}
                  </Link>
                  <Link to="/certificates" className={styles.dropdownItem} onClick={handleMenuItemClick}>
                    <IconSvg name="medalIcon" width="30px" height="30px" />
                    {t('certificates')}
                  </Link>
                  <Link to="/about_us" className={styles.dropdownItem} onClick={handleMenuItemClick}>
                    <IconSvg name="peopleIcon" width="30px" height="30px"></IconSvg>
                    {t('aboutUs')}
                  </Link>
                  <Link to="/notifications" className={styles.dropdownItem} onClick={handleMenuItemClick}>
                    <div className={styles.notificationWrapper}>
                      <IconSvg name="notificationIcon" width="30px" height="30px" />
                      {hasUnreadNotifications && <span className={styles.unreadDot}></span>}
                    </div>
                    <span>{t('notifications.title')}</span>
                  </Link>

                  <Link to="/contact_us" className={styles.dropdownItem} onClick={handleMenuItemClick}>
                    <IconSvg name="techSupportIcon" width="30px" height="30px"></IconSvg>
                    {t('contact_us')}
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
