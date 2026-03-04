'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from "../page.module.css";
import Link from 'next/link';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        <div className="container" dir="rtl">
            <header className={styles.sectionHeader} style={{ marginTop: '3rem' }}>
                <h1 className="elegant-text">نتائج البحث عن: "{query}"</h1>
            </header>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>جاري البحث...</div>
            ) : products.length > 0 ? (
                <div className={styles.productGrid} style={{ marginTop: '2rem' }}>
                    {products.map(product => {
                        const discount = product.originalPrice && product.isOfferActive ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
                        return (
                            <Link key={product.id} href={`/product/${product.id}`} className={styles.placeholderCard} style={{ position: 'relative' }}>
                                {product.isOfferActive && <div className={styles.saleBadge}>تخفيض {discount > 0 && `${discount}%`}</div>}
                                <div
                                    className={styles.imageBox}
                                    style={{ backgroundImage: `url("${product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80'}")`, backgroundSize: 'cover' }}
                                />
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
                    })}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '5rem', background: '#f9f9f9', borderRadius: '15px' }}>
                    <h3 style={{ color: '#666' }}>عذراً، لم يتم العثور على منتجات تطابق بحثك</h3>
                    <p>جربي البحث بكلمات أخرى أو تصفحي أحدث المجموعات.</p>
                    <Link href="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>العودة للرئيسية</Link>
                </div>
            )}
        </div>
    );
}
