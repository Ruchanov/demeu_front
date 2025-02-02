import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../../shared/ui/input/input';
import Button from '../../shared/ui/button/button';
import styles from './resetPassword.module.scss';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';

const ResetPasswordForm = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ new_password: '', confirm_password: '' });
    const [error, setError] = useState('');
    const { resetPassword } = useAuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.new_password !== formData.confirm_password) {
            setError(t('passwords_do_not_match'));
            return;
        }

        const response = await resetPassword(token!, formData.new_password, formData.confirm_password);
        if (response.success) {
            navigate('/auth');
        } else {
            setError(response.error);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    placeholder={t('enter_password')}
                    onChange={handleChange}
                    iconName="passwordIcon"
                />
                <Input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    placeholder={t('confirm_password')}
                    onChange={handleChange}
                    iconName="passwordIcon"
                />
                <div className={styles.button}>
                    <Button type="submit">{t('reset_password')}</Button>
                </div>
            </form>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default ResetPasswordForm;
