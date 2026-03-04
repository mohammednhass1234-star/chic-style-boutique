'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import styles from "../page.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, dir, language } = useLanguage();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="container" dir={dir}>
            <header className={styles.sectionHeader} style={{ marginTop: '3rem' }}>
                <h1 className="elegant-text">{t('tous_les_produits')}</h1>
                <p>{t('decouvrez_elegance')}</p>
            </header>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>{t('chargement')}</div>
            ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>{t('aucun_produit') || (language === 'ar' ? 'لا توجد منتجات متوفرة حالياً.' : 'Aucun produit disponible pour le moment.')}</div>
            ) : (
                <div className={styles.productGrid}>
                    {products.map((product) => (
                        <Link href={`/product/${product.id}`} key={product.id} className={styles.placeholderCard}>
                            <div className={styles.imageBox} style={{ backgroundImage: `url(${product.image || 'https://via.placeholder.com/300'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                            <h3>{product.name}</h3>
                            <p>{product.price.toFixed(2)} {language === 'ar' ? 'درهم' : 'DH'}</p>
                            <button className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>{t('voir_details') || (language === 'ar' ? 'عرض التفاصيل' : 'Voir les détails')}</button>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
