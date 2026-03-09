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
            <header className={styles.sectionHeader} style={{ marginTop: '8rem', marginBottom: '6rem' }}>
                <h1 className="elegant-text" style={{ fontSize: '4rem', color: 'var(--dark-charcoal)' }}>الكولكشن الكامل</h1>
                <div className="line-separator" style={{ margin: '2rem auto' }}></div>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>استكشفي الأناقة والرقي في تشكيلتنا الفاخرة المخصصة لكِ</p>
            </header>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '10rem', fontSize: '1.2rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>جاري التحميل...</div>
            ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '10rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>لا توجد منتجات متوفرة حالياً.</div>
            ) : (
                <div className={styles.productGrid} style={{ marginBottom: '8rem' }}>
                    {products.map((product) => (
                        <Link href={`/product/${product.id}`} key={product.id} className={styles.placeholderCard}>
                            <div className={styles.imageBox} style={{ backgroundImage: `url("${product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                            <h3 className="elegant-text">{product.name}</h3>
                            <p style={{ color: 'var(--text-dark)', fontWeight: '500', fontSize: '1.2rem', margin: '0.5rem 0' }}>{product.price.toFixed(2)} {language === 'ar' ? 'درهم' : 'DH'}</p>
                            <span className="btn-primary" style={{ marginTop: '1rem', width: '80%' }}>التفاصيل</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
