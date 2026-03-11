'use client';

import React, { useEffect, useState } from 'react';
import styles from "../page.module.css";
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function WomenPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { t, dir, language } = useLanguage();

    useEffect(() => {
        // Fetch categories for women section
        fetch('/api/categories?section=women')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data);
            });
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                let url = '/api/products?section=women';
                if (selectedCategory) {
                    url += `&categoryId=${selectedCategory}`;
                }
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Error fetching women products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory]);

    return (
        <div className="container" dir={dir}>
            <header className={styles.sectionHeader} style={{ marginTop: '8rem', marginBottom: '4rem' }}>
                <h1 className="elegant-text" style={{ fontSize: '4rem', color: 'var(--dark-charcoal)' }}>{t('mode_femmes')}</h1>
                <div className="line-separator" style={{ margin: '2rem auto' }}></div>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{t('selection_exclusive')}</p>
            </header>

            {/* Category Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={selectedCategory === null ? 'btn-primary' : 'btn-outline'}
                    style={{ padding: '0.6rem 2rem', borderRadius: '30px' }}
                >
                    الكل
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}
                        style={{ padding: '0.6rem 2rem', borderRadius: '30px' }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '10rem', fontSize: '1.2rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>{t('chargement')}</div>
            ) : (
                <div className={styles.productGrid} style={{ marginBottom: '8rem' }}>
                    {products.length > 0 ? (
                        products.map(product => {
                            const discount = product.originalPrice && product.isOfferActive ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
                            return (
                                <Link key={product.id} href={`/product/${product.id}`} className={styles.placeholderCard}>
                                    {product.isOfferActive && <div className={styles.saleBadge}>حصري {discount > 0 && `${discount}%`}</div>}
                                    <div
                                        className={styles.imageBox}
                                        style={{ backgroundImage: `url("${product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                    >
                                        {product.offerExpiry && <div style={{ position: 'absolute', bottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                            <CountdownTimer expiryDate={product.offerExpiry} />
                                        </div>}
                                    </div>
                                    <h3 className="elegant-text">{product.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                        <p style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '500', fontSize: '1.2rem' }}>{product.price.toFixed(2)} درهم</p>
                                        {product.originalPrice && product.isOfferActive && (
                                            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1rem' }}>
                                                {product.originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <span className="btn-primary" style={{ marginTop: '1rem', width: '80%' }}>{t('acheter_maintenant')}</span>
                                </Link>
                            );
                        })
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '10rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                            {t('aucun_produit')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
