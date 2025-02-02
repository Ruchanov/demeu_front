import React, { useState } from 'react';
import Input from '../../shared/ui/input/input';
import Button from '../../shared/ui/button/button';
import styles from './forgotPassword.module.scss';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import Popup from "../../shared/ui/popup/Popup";

const ForgotPasswordForm = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupError, setPopupError] = useState(false);
    const { requestPasswordReset, loading, error} = useAuthStore(); // ✅ Используем `loading` из useAuthStore

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPopupMessage('');
        setPopupError(false);

        const response = await requestPasswordReset(email);

        if (response?.message) {
            setPopupMessage(response.message); // ✅ Выводим сообщение от бэка
            setIsPopupOpen(true);
        } else {
            setPopupMessage(response.err || t('error_occurred'));
            setPopupError(true);
            setIsPopupOpen(true);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    type="email"
                    name="email"
                    value={email}
                    placeholder={t('enter_email')}
                    onChange={(e) => setEmail(e.target.value)}
                    iconName="emailIcon"
                />
                <div className={styles.button}>
                    <Button type="submit" disabled={loading}>
                        {loading ? t('loading...') : t('reset_password')}
                    </Button>
                </div>
            </form>

            <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} size='small'>
                <h3>{popupError ? t('error') : t('success')}</h3>
                <p>{popupMessage}</p>
                <div className={styles.button}>
                    <Button onClick={() => setIsPopupOpen(false)}>{t('close')}</Button>
                </div>
            </Popup>
        </div>
    );
};

export default ForgotPasswordForm;
