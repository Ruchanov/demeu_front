import React, { useEffect } from 'react';
import { usePublicationsStore } from '../../store/publicationStore';
import PublicationCard from "../../components/publicationCard";
import styles from './styles.module.scss';
import {useTranslation} from "react-i18next";

const MainPage: React.FC = () =>{
    const {t} = useTranslation()
    const { publications, fetchPublications, loading } = usePublicationsStore();

    useEffect(() => {
        fetchPublications();
    }, []);

    return (
        <div className={styles.grid}>
            {loading ? (
                <p>{t('loading')}...</p>
            ) : (
                publications.map((pub) => <PublicationCard key={pub.id} publication={pub} />)
            )}
        </div>
    );
};

export default MainPage;
