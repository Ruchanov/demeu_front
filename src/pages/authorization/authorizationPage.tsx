import React, { useState } from 'react';
import LoginForm from '../../components/loginForm/loginForm';
import RegisterForm from '../../components/registerForm/registerFrom';
import styles from './authorization.module.scss';
import Header from '../../shared/ui/header';
import IconSvg from '../../shared/assets/icons/Icon';
import { useTranslation } from 'react-i18next';

const AuthorizationPage = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const {t} = useTranslation();

  const handleTabClick = (isLoginTab: boolean) => {
    setIsLogin(isLoginTab);
  };

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
        </div>
      </div>
      <div className={styles.rightSide}>
        <div className={`${styles.circle} ${styles.circle1}`} />
        <div className={`${styles.circle} ${styles.circle2}`} />
        <div className={`${styles.circle} ${styles.circle3}`} />
        <div className={styles.rightSideContent}>
          <IconSvg name="demeu_logo" width="380px" height="350px" />
        </div>
      </div>
    </div>
  );
};

export default AuthorizationPage;
