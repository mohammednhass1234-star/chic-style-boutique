'use client';

import React, { useEffect, useState } from 'react';
import styles from "../page.module.css";
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function KidsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [genderFilter, setGenderFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const { t, dir, language } = useLanguage();

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    section: 'kids',
                    gender: genderFilter,
                    subCategory: typeFilter
                });
                const response = await fetch(`/api/products?${queryParams.toString()}`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Error fetching kids products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [genderFilter, typeFilter]);

    return (
        <div className="container" dir={dir}>
            <header className={styles.sectionHeader} style={{ marginTop: '8rem', marginBottom: '3rem' }}>
                <h1 className="elegant-text" style={{ fontSize: '4rem', color: 'var(--dark-charcoal)' }}>أزياء الأطفال</h1>
                <div className="line-separator" style={{ margin: '1.5rem auto' }}></div>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>تشكيلة مبهجة ومريحة تليق بصغاركم</p>
            </header>

            {/* Filter UI */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '4rem' }}>
                <div style={{ display: 'flex', gap: '0.8rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '50px', border: '1px solid #e2e8f0' }}>
                    <button 
                        onClick={() => setGenderFilter('all')}
                        style={{ padding: '0.6rem 1.5rem', borderRadius: '50px', border: 'none', cursor: 'pointer', background: genderFilter === 'all' ? 'var(--dark-charcoal)' : 'transparent', color: genderFilter === 'all' ? 'white' : '#64748b', fontWeight: 'bold', transition: '0.3s' }}
                    >الكل</button>
                    <button 
                        onClick={() => setGenderFilter('boy')}
                        style={{ padding: '0.6rem 1.5rem', borderRadius: '50px', border: 'none', cursor: 'pointer', background: genderFilter === 'boy' ? 'var(--dark-charcoal)' : 'transparent', color: genderFilter === 'boy' ? 'white' : '#64748b', fontWeight: 'bold', transition: '0.3s' }}
                    >ولادي 👦</button>
                    <button 
                        onClick={() => setGenderFilter('girl')}
                        style={{ padding: '0.6rem 1.5rem', borderRadius: '50px', border: 'none', cursor: 'pointer', background: genderFilter === 'girl' ? 'var(--dark-charcoal)' : 'transparent', color: genderFilter === 'girl' ? 'white' : '#64748b', fontWeight: 'bold', transition: '0.3s' }}
                    >بناتي 👧</button>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button 
                        onClick={() => setTypeFilter('all')}
                        style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', background: typeFilter === 'all' ? '#cbd5e1' : 'white', color: '#1e293b', transition: '0.3s' }}
                    >كل المنتجات</button>
                    <button 
                        onClick={() => setTypeFilter('clothing')}
                        style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', background: typeFilter === 'clothing' ? '#cbd5e1' : 'white', color: '#1e293b', transition: '0.3s' }}
                    >ملابس 👕</button>
                    <button 
                        onClick={() => setTypeFilter('shoes')}
                        style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', background: typeFilter === 'shoes' ? '#cbd5e1' : 'white', color: '#1e293b', transition: '0.3s' }}
                    >أحذية 👟</button>
                </div>
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
                            لا توجد منتجات متوفرة حالياً في هذا القسم. ترقبوا تشكيلتنا الجديدة للأطفال.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
