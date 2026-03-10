'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from "../page.module.css";
import Link from 'next/link';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, dir, language } = useLanguage();

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [query]);

    return (
        <div className="container" dir={dir}>
            <header className={styles.sectionHeader} style={{ marginTop: '3rem' }}>
                <h1 className="elegant-text">{language === 'ar' ? 'نتائج البحث عن:' : 'Résultats pour:'} "{query}"</h1>
            </header>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>{t('chargement')}</div>
            ) : products.length > 0 ? (
                <div className={styles.productGrid} style={{ marginTop: '2rem' }}>
                    {products.map(product => {
                        const discount = product.originalPrice && product.isOfferActive ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
                        return (
                            <Link key={product.id} href={`/product/${product.id}`} className={styles.placeholderCard} style={{ position: 'relative' }}>
                                {product.isOfferActive && <div className={styles.saleBadge}>{language === 'ar' ? 'تخفيض' : 'Promo'} {discount > 0 && `${discount}%`}</div>}
                                <div
                                    className={styles.imageBox}
                                    style={{ backgroundImage: `url("${product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80'}")`, backgroundSize: 'cover' }}
                                />
                                <h3>{(language === 'fr' && (product as any).nameFr) ? (product as any).nameFr : product.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                    <p style={{ margin: 0 }}>{product.price.toFixed(2)} {language === 'ar' ? 'درهم' : 'DH'}</p>
                                    {product.originalPrice && product.isOfferActive && (
                                        <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>
                                            {product.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '5rem', background: '#f9f9f9', borderRadius: '15px' }}>
                    <h3 style={{ color: '#666' }}>{language === 'ar' ? 'عذراً، لم يتم العثور على منتجات تطابق بحثك' : 'Désolé, aucun produit ne correspond à votre recherche.'}</h3>
                    <p>{language === 'ar' ? 'جربي البحث بكلمات أخرى أو تصفحي أحدث المجموعات.' : 'Essayez d\'autres mots-clés ou parcourez nos collections.'}</p>
                    <Link href="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>{t('accueil')}</Link>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container" style={{ textAlign: 'center', padding: '5rem' }}>جاري التحميل...</div>}>
            <SearchContent />
        </Suspense>
    );
}
