import React, { useState } from 'react';
import Input from '../../shared/ui/input/input';
import Button from '../../shared/ui/button/button';
import styles from './loginForm.module.scss';
import { useTranslation } from 'react-i18next';
import {useAuthStore} from "../../store/authStore";

const LoginForm = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login, loading, error } = useAuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder={t('enter_password')}
                    onChange={handleChange}
                    iconName="passwordIcon"
                />
                <div className={styles.submitTools}>
                    <h3>{t('forgot_password')}</h3>
                    <Button type="submit" disabled={loading}>
                        {loading ? t('loading...') : t('login')}
                    </Button>
                </div>
            </form>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default LoginForm;
