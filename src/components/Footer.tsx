'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { Instagram, Facebook, Phone, MapPin } from 'lucide-react';
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerGrid}>
                <div className={styles.column}>
                    <h3 className="elegant-text">Chic Jeune - شيك جون</h3>
                    <p>أناقة تليق بكِ وبأطفالكِ</p>
                    <div className={styles.contactButtons} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <a href="https://wa.me/212535602375" target="_blank" rel="noopener noreferrer" className={styles.contactBtn + ' ' + styles.whatsapp}>
                            <Phone size={18} /> تواصل عبر واتساب
                        </a>
                        <a href="https://www.instagram.com/chic.jeune" target="_blank" rel="noopener noreferrer" className={styles.contactBtn + ' ' + styles.instagram}>
                            <Instagram size={18} /> تابعونا على إنستغرام
                        </a>
                        <a href="https://www.google.com/maps?q=34.026568,-5.004766" target="_blank" rel="noopener noreferrer" className={styles.contactBtn + ' ' + styles.maps}>
                            <MapPin size={18} /> موقعنا في فاس (حي زواغة)
                        </a>
                    </div>
                </div>

                <div className={styles.column}>
                    <h3>{t('liens_rapides')}</h3>
                    <ul>
                        <li><Link href="/">{t('accueil')}</Link></li>
                        <li><Link href="/women">{t('femmes')}</Link></li>
                        <li><Link href="/offers">{t('offres')}</Link></li>
                        <li><Link href="/about">{t('a_propos')}</Link></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h3>{t('contactez_nous')}</h3>
                    <ul>
                        <li><MapPin size={16} /> حي زواغة، فاس</li>
                        <li><Phone size={16} /> 0535602375</li>
                    </ul>
                    <div className={styles.socials} style={{ marginTop: '1rem' }}>
                        <a href="#" className={styles.socialIcon}><Instagram size={18} /></a>
                        <a href="#" className={styles.socialIcon}><Facebook size={18} /></a>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>&copy; 2026 Chic Jeune - جميع الحقوق محفوظة</p>
            </div>
        </footer>
    );
}
