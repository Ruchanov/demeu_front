import React, {useEffect, useState} from 'react';
import LoginForm from '../../components/loginForm/loginForm';
import RegisterForm from '../../components/registerForm/registerForm';
import styles from './authorization.module.scss';
import Header from '../../shared/ui/header';
import IconSvg from '../../shared/assets/icons/Icon';
import { useTranslation } from 'react-i18next';
import {useAuthStore} from "../../store/authStore";
import {useNavigate} from "react-router-dom";
import useCheckMobileScreen from "../../shared/lib/mobile_check";
import GoogleLoginButton from "../../components/googleLoginButton";

const AuthorizationPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const {t} = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const isMobile = useCheckMobileScreen();
  const handleTabClick = (isLoginTab: boolean) => {
    setIsLogin(isLoginTab);
  };
  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);


  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isLogin ? styles.active : ''}`}
            onClick={() => handleTabClick(true)}
          >
            {t('login')}
          </button>
          <button
            className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
            onClick={() => handleTabClick(false)}
          >
            {t('register')}
          </button>
        </div>
        <div className={styles.form}>
          {isLogin ? <LoginForm /> : <RegisterForm />}
          {/*{isLogin && (*/}
          {/*    <GoogleLoginButton />*/}

          {/*)}*/}
        </div>
      </div>
      {!isMobile &&(
          <div className={styles.rightSide}>
            <div className={`${styles.circle} ${styles.circle1}`} />
            <div className={`${styles.circle} ${styles.circle2}`} />
            <div className={`${styles.circle} ${styles.circle3}`} />
            <div className={styles.rightSideContent}>
              <IconSvg name="demeu_logo" width="380px" height="350px" />
            </div>
          </div>
      )}

    </div>
  );
};

export default AuthorizationPage;
