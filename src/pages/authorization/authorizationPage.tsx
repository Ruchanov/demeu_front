import React, { useState } from 'react';
import LoginForm from '../../components/loginForm/loginForm';
import RegisterForm from '../../components/registerForm/registerFrom';
import styles from './authorization.module.scss';
import Header from '../../shared/ui/header';
import IconSvg from '../../shared/assets/icons/Icon';

const AuthorizationPage = () => {
  const [isLogin, setIsLogin] = useState(true); 

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
            Кіру
          </button>
          <button
            className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
            onClick={() => handleTabClick(false)}
          >
            Тіркелу
          </button>
        </div>
        <div className={styles.form}>
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
      <div className={styles.rightSide}>
        <IconSvg name={'demeu_logo'} width="150px" height="150px" />
        <div className={`${styles.semicircles} ${styles.semicircle1}`} />
        <div className={`${styles.semicircles} ${styles.semicircle2}`} />
      </div>
    </div>
  );
};

export default AuthorizationPage;
