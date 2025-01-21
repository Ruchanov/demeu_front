import React, { useState } from 'react';
import Input from '../../shared/ui/input/input';
import Button from '../../shared/ui/button/button';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/auth/authSlice';
import { RootState } from '../../app/store';
import styles from './RegisterForm.module.scss';
import { AppDispatch } from '../../app/store';
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
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(t('passwords_do_not_match')); 
      return;
    }
    dispatch(register(formData));
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="text"
          name="name"
          value={formData.name}
          placeholder={t('enter_name')}
          onChange={handleChange}
          iconName="phoneIcon"
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
          iconName="personIcon"
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
    </div>
  );
};

export default RegisterForm;
