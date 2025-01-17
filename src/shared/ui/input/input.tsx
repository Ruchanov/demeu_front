import React from 'react';
import styles from './input.module.scss';
import IconSvg from '../../assets/icons/Icon';

interface InputProps {
  type: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconName?: string; 
}

const Input: React.FC<InputProps> = ({ type, name, value, placeholder, onChange, iconName }) => {
  return (
    <div className={styles.inputWrapper}>
      {iconName && (
        <div className={styles.icon}>
          <IconSvg name={iconName} width="20px" height="20px" />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`${styles.input} ${iconName ? styles.withIcon : ''}`}
      />
    </div>
  );
};

export default Input;
