'use client';

import styles from "../page.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
    const { t, dir } = useLanguage();

    return (
        <div className="container" dir={dir}>
            <header className={styles.sectionHeader} style={{ marginTop: '4rem' }}>
                <h1 className="elegant-text" style={{ fontSize: '3rem' }}>{t('a_propos')}</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '1rem auto' }}>
                    {t('a_propos_desc')}
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', marginTop: '4rem', alignItems: 'center' }}>
                <div style={{ height: '500px', background: 'var(--primary-pink)', borderRadius: '15px', backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68ec25d43d?w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <h2 className="elegant-text">{t('notre_vision')}</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            {t('notre_vision_desc')}
                        </p>
                    </div>

                    <div>
                        <h2 className="elegant-text">{t('nos_valeurs')}</h2>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', ...(dir === 'rtl' ? { paddingRight: '1.5rem' } : { paddingLeft: '1.5rem' }) }}>
                            <li>{t('valeur_qualite')}</li>
                            <li>{t('valeur_elegance')}</li>
                            <li>{t('valeur_confiance')}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <section style={{ marginTop: '6rem', marginBottom: '6rem', textAlign: 'center', background: 'var(--soft-cream)', padding: '4rem', borderRadius: '20px' }}>
                <h2 className="elegant-text">{t('pourquoi_chic')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                    <div>
                        <h4 style={{ color: 'var(--accent-rose)', fontSize: '1.5rem', marginBottom: '1rem' }}>{t('livraison_rapide')}</h4>
                        <p>{t('livraison_rapide_desc')}</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--accent-rose)', fontSize: '1.5rem', marginBottom: '1rem' }}>{t('prix_competitifs')}</h4>
                        <p>{t('prix_competitifs_desc')}</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--accent-rose)', fontSize: '1.5rem', marginBottom: '1rem' }}>{t('support_continu')}</h4>
                        <p>{t('support_continu_desc')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
