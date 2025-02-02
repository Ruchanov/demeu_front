import React from 'react';
import styles from './Popup.module.scss';

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children,size = 'medium'  }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose} aria-hidden="true">
            <div
                className={`${styles.popup} ${styles[size]}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {children}
            </div>
        </div>
    );
};

export default Popup;
