import React, { useEffect, useState } from 'react';
import styles from './CertificatesPage.module.scss';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { fetchCertificateByUserId } from '../../api/certificatesApi';
import { useTranslation } from 'react-i18next';
import {Certificate} from "./sertificate";



const ALL_LEVELS: Array<'bronze' | 'silver' | 'gold'> = ['bronze', 'silver', 'gold'];

const levelRequirements: Record<string, string[]> = {
    bronze: [
        'cert.requirement.bronze.1',
        'cert.requirement.bronze.2'
    ],
    silver: [
        'cert.requirement.silver.1',
        'cert.requirement.silver.2',
        'cert.requirement.silver.3',
        'cert.requirement.silver.4'
    ],
    gold: [
        'cert.requirement.gold.1',
        'cert.requirement.gold.2',
        'cert.requirement.gold.3',
        'cert.requirement.gold.4'
    ]
};

const CertificatesPage: React.FC = () => {
    const { t } = useTranslation();
    const [userCertificate, setUserCertificate] = useState<Certificate | null>(null);
    const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});
    const token = useAuthStore.getState().token;
    const currentUser = useProfileStore((state) => state.currentUser);
    const fetchCurrentUser = useProfileStore((state) => state.fetchCurrentUser);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    useEffect(() => {
        const loadCertificate = async () => {
            if (!currentUser) return;
            try {
                const data = await fetchCertificateByUserId(currentUser.user_id, token);
                setUserCertificate(data);
            } catch (error) {
                console.warn('Сертификат не найден');
                setUserCertificate(null);
            }
        };
        loadCertificate();
    }, [currentUser, token]);

    const toggleLevel = (level: string) => {
        setExpandedLevels((prev) => ({ ...prev, [level]: !prev[level] }));
    };

    return (
        <div className={styles.pageWrapper}>
            <h1 className={styles.title}>{t('certificates_title')}</h1>

            <div className={styles.cards}>
                {ALL_LEVELS.map((level) => {
                    const achieved = userCertificate?.level === level;
                    const downloadUrl = userCertificate?.certificate_url;
                    const isExpanded = expandedLevels[level];

                    return (
                        <div key={level} className={`${styles.card} ${styles[level]}`}>
                            <div className={styles.image}>{level.toUpperCase()} {t('certificate')}</div>

                            <div className={styles.statusBlock}>
                                <div
                                    className={styles.status}
                                    onClick={() => {
                                        if (!achieved) toggleLevel(level);
                                    }}
                                    style={{ cursor: !achieved ? 'pointer' : 'default' }}
                                >
                                    {achieved ? t('certificates_status_received') : t('certificates_status_pending')}
                                </div>
                                <div className={styles.date}>
                                    {achieved ? `${t('certificates_date_label')}: ${new Date().toLocaleDateString()}` : ''}
                                </div>
                            </div>

                            {achieved ? (
                                <a
                                    className={styles.downloadBtn}
                                    href={downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('certificates_download')}
                                </a>
                            ) : (
                                <button className={styles.disabledBtn} disabled>
                                    {t('certificates_unavailable')}
                                </button>
                            )}

                            {!achieved && isExpanded && (
                                <div className={styles.requirements}>
                                    <h4>{t('certificates_requirements')}</h4>
                                    <ul>
                                        {levelRequirements[level].map((req, idx) => (
                                            <li key={idx}>{t(req)}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <p className={styles.footerNote}>{t('certificates_footer')}</p>
        </div>
    );
};

export default CertificatesPage;
