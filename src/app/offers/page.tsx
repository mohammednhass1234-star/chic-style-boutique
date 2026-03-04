'use client';

import Link from "next/link";
import styles from "../page.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function OffersPage() {
    const { t, dir } = useLanguage();

    const products = [
        { id: 101, nameKey: "festan_eid", price: 299.00, oldPrice: 450.00, category: "offres" },
        { id: 102, nameKey: "taqm_waladi", price: 150.00, oldPrice: 220.00, category: "offres" },
        { id: 103, nameKey: "haqiba_fakhira", price: 180.00, oldPrice: 300.00, category: "offres" },
    ];

    return (
        <div className="container" dir={dir}>
            <header className={styles.sectionHeader} style={{ marginTop: '2rem' }}>
                <h1 className="elegant-text">{t('offres_titre')}</h1>
                <p>{t('offres_desc')}</p>
            </header>

            <div className={styles.productGrid}>
                {products.map((product) => (
                    <Link href={`/product/${product.id}`} key={product.id} className={styles.placeholderCard}>
                        <div className={styles.imageBox} style={{ backgroundColor: 'var(--primary-pink)', backgroundImage: product.id === 101 ? 'url("https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80")' : product.id === 102 ? 'url("https://images.unsplash.com/photo-1512436030959-26920f26fdc3?w=500&q=80")' : 'url("https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--accent-rose)', color: 'white', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>{t('promo')}</span>
                        </div>
                        <h3>{t(product.nameKey)}</h3>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                            <p style={{ color: 'var(--accent-rose)', fontWeight: 'bold' }}>{product.price.toFixed(2)} درهم</p>
                            <p style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.9rem' }}>{product.oldPrice.toFixed(2)} درهم</p>
                        </div>
                        <button className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>عرض التفاصيل</button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
