import React from 'react';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';

const statistics = [
    { label: 'statistics_successful_collections', value: 1438, target: 5000, color: '#28a745' },
    { label: 'statistics_active_collections', value: 320, target: 1000, color: '#fd7e14' },
    { label: 'statistics_total_amount_collected', value: 24680000, target: 50000000, color: '#6f42c1' },
    { label: 'statistics_donors_count', value: 12492, target: 20000, color: '#d63384' },
];

const BannerWithStatistics: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.statisticsCard}>
            <h3 className={styles.title}>{t('statistics_title')}</h3>
            <ul className={styles.list}>
                {statistics.map((stat, index) => {
                    const percentage = (stat.value / stat.target) * 100;

                    return (
                        <li key={index} className={styles.statItem}>
                            <div className={styles.statHeader}>
                                <span className={styles.label}>{t(stat.label as any)}</span>
                                <span className={styles.value} style={{ color: stat.color }}>
                                    {stat.value.toLocaleString()} / {stat.target.toLocaleString()}
                                </span>
                            </div>
                            <div className={styles.progressBarContainer}>
                                <div className={styles.progressBar}
                                     style={{ backgroundColor: stat.color, width: `${percentage}%` }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default BannerWithStatistics;
