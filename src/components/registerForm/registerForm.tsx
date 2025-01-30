import React, { useState } from 'react';
import Input from '../../shared/ui/input/input';
import Button from '../../shared/ui/button/button';
import { useAuthStore } from '../../store/authStore';
import styles from './RegisterForm.module.scss';
import { useTranslation } from 'react-i18next';

const RegisterForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { register, loading, error, successMessage } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(t('passwords_do_not_match'));
      return;
    }
    await register(
        formData.name,
        formData.surname,
        formData.email,
        formData.password,
        formData.confirmPassword
    );
  };

  return (
      <div className={styles.container}>
        {successMessage ? (
            <p className={styles.success}>{successMessage}</p>
        ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder={t('enter_name')}
                  onChange={handleChange}
                  iconName="personIcon"
              />
              <Input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  placeholder={t('enter_surname')}
                  onChange={handleChange}
                  iconName="personIcon"
              />
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
              <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder={t('confirm_password')}
                  onChange={handleChange}
                  iconName="passwordIcon"
              />
              <div className={styles.submitButton}>
                <Button type="submit" disabled={loading}>
                  {loading ? t('loading...') : t('register')}
                </Button>
              </div>
            </form>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
  );
};

export default RegisterForm;
