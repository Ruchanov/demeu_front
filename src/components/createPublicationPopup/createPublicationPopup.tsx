import React from "react";
import styles from "./createPublicationPopup.module.scss";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/ui/button/button";
import { useTranslation } from 'react-i18next';

interface CreatePublicationPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreatePublicationPopup: React.FC<CreatePublicationPopupProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (!isOpen) return null;

    const handleRedirect = () => {
        onClose();
        navigate("/"); // Redirect to home page
    };

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
                <p>{t('your_post_takes_several_days')}</p>
                <Button onClick={handleRedirect}>{t('return_to_main_page')}</Button>
            </div>
        </div>
    );

};

export default CreatePublicationPopup;
