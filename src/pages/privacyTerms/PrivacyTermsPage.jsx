import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PrivacyTermsPage.module.scss';

const PrivacyTermsPage = () => {
    const { t } = useTranslation();

    const renderBlock = (titleKey, textKey) => (
        <section className={styles.section}>
            <h2>{t(titleKey)}</h2>
            {t(textKey).split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
            ))}
        </section>
    );

    return (
        <div className={styles.wrapper}>
            <h1>{t('privacy.title')}</h1>
            <h2>{t('privacy.policy_title')}</h2>
            <p>{t('privacy.policy_intro')}</p>

            {renderBlock('privacy.collect_title', 'privacy.collect_text')}
            {renderBlock('privacy.usage_title', 'privacy.usage_text')}
            {renderBlock('privacy.access_title', 'privacy.access_text')}
            {renderBlock('privacy.protect_title', 'privacy.protect_text')}
            {renderBlock('privacy.rights_title', 'privacy.rights_text')}

            <hr className={styles.separator} />

            <h1>{t('terms.title')}</h1>
            <p>{t('terms.intro')}</p>
            {renderBlock('terms.purpose_title', 'terms.purpose_text')}
            {renderBlock('terms.user_rules_title', 'terms.user_rules_text')}
            {renderBlock('terms.responsibility_title', 'terms.responsibility_text')}
            {renderBlock('terms.ip_title', 'terms.ip_text')}
            {renderBlock('terms.changes_title', 'terms.changes_text')}

            <hr className={styles.separator} />

            <section className={styles.section}>
                <h2>{t('contact.title')}</h2>
                <p>{t('contact.text')}</p>
            </section>
        </div>
    );
};

export default PrivacyTermsPage;