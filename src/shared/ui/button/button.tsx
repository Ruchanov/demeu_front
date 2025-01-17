import React from 'react';
import styles from './button.module.scss';
import IconSvg from '../../assets/icons/Icon';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  iconName?: string; 
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button', disabled, iconName }) => {
  return (
    <button className={styles.button} onClick={onClick} type={type} disabled={disabled}>
      {iconName && (
        <IconSvg name={iconName} width="20px" height="20px" />
      )}
      {children}
    </button>
  );
};

export default Button;
