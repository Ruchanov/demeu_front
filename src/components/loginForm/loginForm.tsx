import React, { useState } from 'react';
import Input from '../../shared/ui/input/input';
import Button from '../../shared/ui/button/button';
import styles from './loginForm.module.scss';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import GoogleLoginButton from '../googleLoginButton';
import IconSvg from '../../shared/assets/icons/Icon';
// import eye from '../../shared/assets/icons/eye.svg';
// import eyeSlash from '../../shared/assets/icons/eye-slash.svg';

const LoginForm = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error } = useAuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        console.log('👁 icon clicked!');
        setShowPassword(prev => !prev);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(formData.email, formData.password);
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder={t('enter_email')}
                    onChange={handleChange}
                    iconName="emailIcon"
                />

                <div className={styles.passwordWrapper}>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        placeholder={t('enter_password')}
                        onChange={handleChange}
                        iconName="passwordIcon"
                    />
                    <IconSvg
                        name={showPassword ? 'eye-slash' : 'eye'}
                        width="24"
                        height="24"
                        className={styles.eyeIcon}
                        onClick={togglePasswordVisibility}
                    />
                </div>


                {error && <p className={styles.error}>{t(error)}</p>}

                <div className={styles.submitTools}>
                    <Link to="/forgot-password">
                        <h3>{t('forgot_password')}</h3>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading ? t('loading...') : t('login')}
                    </Button>
                </div>

                <div className={styles.divider}>
                    <span className={styles.line}></span>
                    <span className={styles.text}>{t("or")}</span>
                    <span className={styles.line}></span>
                </div>
                <GoogleLoginButton />
            </form>
        </div>
    );
};

export default LoginForm;
