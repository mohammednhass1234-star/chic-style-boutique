'use client';

import React, { useEffect, useState } from 'react';
import styles from "../page.module.css";
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import { Product } from '@/types';

export default function KidsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products filtered by Kids category (slug 'kids')
                const response = await fetch('/api/products?categorySlug=kids');
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
    }, []);

    return (
        <div className="container" dir="rtl">
            <header className={styles.sectionHeader} style={{ marginTop: '8rem', marginBottom: '6rem' }}>
                <h1 className="elegant-text" style={{ fontSize: '4rem', color: 'var(--dark-charcoal)' }}>أزياء الأطفال</h1>
                <div className="line-separator" style={{ margin: '2rem auto' }}></div>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>تشكيلة مبهجة ومريحة تليق بصغاركم</p>
            </header>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '10rem', fontSize: '1.2rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>جاري التحميل...</div>
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
                                    <span className="btn-primary" style={{ marginTop: '1rem', width: '80%' }}>شراء الآن</span>
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
