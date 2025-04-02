import React from 'react';
import styles from './SharePopup.module.scss';
import IconSvg from "../../shared/assets/icons/Icon";
import {useTranslation} from "react-i18next";

interface SharePopupProps {
    onClose: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const shareLink = 'https://demeu/1c4916de';
    const shareMessage = t('share_message');

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${shareMessage} ${shareLink}`)
            .then(() => {
                alert(t('link_copied_success'));
            })
            .catch(() => {
                alert(t('link_copied_failure'));
            });
    };

    const socialLinks = [
        {
            name: 'WhatsApp',
            icon: 'whatsapp_icon',
            url: `https://api.whatsApp.com/send?text=${encodeURIComponent(`${shareMessage} ${shareLink}`)}`,
        },
        {
            name: 'Telegram',
            icon: 'telegram_icon',
            url: `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareMessage)}`,
        },
        {
            name: 'Facebook',
            icon: 'facebook_icon',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`,
        },
        {
            name: 'Email',
            icon: 'email_icon',
            url: `mailto:?subject=${encodeURIComponent('Присоединяйтесь к нашей кампании!')}&body=${encodeURIComponent(`${shareMessage} ${shareLink}`)}`,
        },
        {
            name: 'ВКонтакте',
            icon: 'vk_icon',
            url: `https://vk.com/share.php?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(shareMessage)}`,
        },
        {
            name: 'Instagram',
            icon: 'instagram_icon',
            url: `https://www.instagram.com/direct/new/`,
        },
    ];

    return (
        <div className={styles.backdrop} onClick={onClose}> {/* Затемненный фон */}
            <div className={styles.container} onClick={(e) => e.stopPropagation()}> {/* Остановка всплытия */}
                <button className={styles.closeButton} onClick={onClose}>
                    <IconSvg name="closeIcon" width="24px" height="24px" />
                </button>
                <h2 className={styles.title}>{t('share')}</h2>
                <div className={styles.linkContainer}>
                    <input type="text" readOnly value={shareLink} className={styles.linkInput} />
                    <button className={styles.copyButton} onClick={handleCopyLink}>
                        <IconSvg name="copy_icon" width="16px" height="16px" />
                        {t('copy_link')}
                    </button>
                </div>
                <p className={styles.description}>{t('share_description')}</p>
                <div className={styles.socialIcons}>
                    {socialLinks.map((link) => (
                        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                            <IconSvg name={link.icon} width="30px" height="30px" />
                            {link.name}
                        </a>
                    ))}
                </div>
                <p className={styles.footerText}>{t('footer_text')}</p>
            </div>
        </div>
    );
};

export default SharePopup;
