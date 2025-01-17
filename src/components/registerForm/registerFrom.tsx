import React, { useState } from 'react';
import Input from '../../shared/ui/input/input';
import Button from '../../shared/ui/button/button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/auth/authSlice';
import { RootState } from '../../app/store';
import styles from './RegisterForm.module.scss';
import { AppDispatch } from '../../app/store';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    dispatch(register(formData));
  };

  return (
    <div className={styles.container}>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Введите Email"
          onChange={handleChange}
          iconName="emailIcon"
        />
        <Input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Введите пароль"
          onChange={handleChange}
          iconName="passwordIcon"
        />
        <Input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          placeholder="Подтвердите пароль"
          onChange={handleChange}
          iconName="passwordIcon"
        />
        <Input
          type="text"
          name="phone"
          value={formData.phone}
          placeholder="Введите номер телефона"
          onChange={handleChange}
          iconName="phoneIcon"
        />
        {error && <div className={styles.error}>{error}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </Button>
      </form>
      <p className={styles.link}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
