'use client';

import React, { useEffect, useState } from 'react';
import styles from "../page.module.css";
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';

export default function WomenPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products specifically for "النساء" category
                const response = await fetch('/api/products?category=النساء');
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
    }, []);

    return (
        <div className="container" dir="rtl">
            <header className={styles.sectionHeader} style={{ marginTop: '3rem' }}>
                <h1 className="elegant-text">ملابس النساء - CHIC JEUNE</h1>
                <p>اكتشفي الأناقة والرقي في تشكيلتنا المخصصة لكِ</p>
            </header>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>جاري تحميل المنتجات...</div>
            ) : (
                <div className={styles.productGrid} style={{ marginTop: '2rem' }}>
                    {products.length > 0 ? (
                        products.map(product => {
                            const discount = product.originalPrice && product.isOfferActive ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
                            return (
                                <Link key={product.id} href={`/product/${product.id}`} className={styles.placeholderCard} style={{ position: 'relative' }}>
                                    {product.isOfferActive && <div className={styles.saleBadge}>تخفيض {discount > 0 && `${discount}%`}</div>}
                                    <div
                                        className={styles.imageBox}
                                        style={{ backgroundImage: `url("${product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80'}")`, backgroundSize: 'cover' }}
                                    >
                                        {product.offerExpiry && <div style={{ position: 'absolute', bottom: '10px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                            <CountdownTimer expiryDate={product.offerExpiry} />
                                        </div>}
                                    </div>
                                    <h3>{product.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                        <p style={{ margin: 0 }}>{product.price.toFixed(2)} درهم</p>
                                        {product.originalPrice && product.isOfferActive && (
                                            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>
                                                {product.originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem' }}>
                            لا توجد منتجات متوفرة حالياً في هذا القسم.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
