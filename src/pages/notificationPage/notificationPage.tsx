import React, { useEffect, useState } from 'react';
import styles from './NotificationPage.module.scss';
import { useTranslation } from 'react-i18next';
import {getAllNotifications, markAsRead} from '../../api/notificationApi';
import { useNavigate } from 'react-router-dom';
import { getRelativeTime } from '../../utils/timeFormatter';
import { useAuthStore } from "../../store/authStore";

type Notification = {
    id: number;
    verb: string;
    target: string;
    url: string;
    is_read: boolean;
    created_at: string;
};

const NotificationPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = useAuthStore.getState().token;
                const data = await getAllNotifications(token || '');
                setNotifications(data);
            } catch (error) {
                console.error('Ошибка при загрузке уведомлений:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);
    const handleMarkAllRead = async () => {
        try {
            const token = useAuthStore.getState().token;
            const unread = notifications.filter((n) => !n.is_read);
            for (const notif of unread) {
                await markAsRead(notif.id, token || '');
            }
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, is_read: true }))
            );
        } catch (err) {
            console.error('Ошибка при отметке всех как прочитанных:', err);
        }
    };

    const filtered = activeTab === 'all'
        ? notifications
        : notifications.filter((n) => !n.is_read);

    const handleClick = async (notif: Notification) => {
        try {
            const token = useAuthStore.getState().token;
            if (!notif.is_read) {
                await markAsRead(notif.id, token || '');
                setNotifications((prev) =>
                    prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
                );
            }
            navigate(notif.url);
        } catch (err) {
            console.error('Ошибка при переходе и отметке как прочитанного:', err);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <h1 className={styles.title}>{t('notifications.title')}</h1>

            <div className={styles.box}>
                <div className={styles.tabsWrapper}>
                    <div className={styles.tabsRow}>
                        <button className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
                                onClick={() => setActiveTab('all')}>
                            {t('notifications.all')}
                        </button>
                        <button className={`${styles.tab} ${activeTab === 'unread' ? styles.active : ''}`}
                                onClick={() => setActiveTab('unread')}>
                            {t('notifications.unread')}
                            <span className={styles.count}>{notifications.filter((n) => !n.is_read).length}</span>
                        </button>
                        <button className={styles.markAllRead} disabled={notifications.every(n => n.is_read)}
                                onClick={handleMarkAllRead}>
                            {t('notifications.mark_all')}
                        </button>
                    </div>

                </div>


                <div className={styles.list}>
                    {loading ? (
                        <p>{t('notifications.loading')}</p>
                    ) : filtered.length === 0 ? (
                        <p>{t('notifications.empty')}</p>
                    ) : (
                        filtered.map((notif) => (
                            <div
                                key={notif.id}
                                className={`${styles.card} ${!notif.is_read ? styles.unread : ''}`}
                                onClick={() => handleClick(notif)}
                            >
                            {/*{!notif.is_read && <span className={styles.dot} />}*/}
                                <div>
                                    <div className={styles.verb}>{notif.verb}</div>
                                    <div className={styles.target}>{notif.target}</div>
                                </div>
                                <div className={styles.time}>{getRelativeTime(notif.created_at)}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;
