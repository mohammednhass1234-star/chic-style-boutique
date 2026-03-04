'use client';

import React from 'react';
import styles from './Hero.module.css';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <section className={styles.hero}>
            <div className={styles.heroOverlay}></div>
            <div className={styles.heroContent}>
                <h1 className="elegant-text">Chic Jeune - <span>شيك جون</span></h1>
                <p>{t('l_elegance_sublime')}</p>
                <Link href="/products" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.2rem' }}>
                    {t('tous_les_produits')}
                </Link>
            </div>
        </section>
    );
};

export default Hero;
