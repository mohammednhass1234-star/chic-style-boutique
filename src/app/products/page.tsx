'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import styles from "../page.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const { t, dir, language } = useLanguage();

    useEffect(() => {
        // Fetch categories
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data);
            });
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                let url = `/api/products?q=${encodeURIComponent(searchQuery)}`;
                if (selectedCategory) {
                    url += `&categoryId=${selectedCategory}`;
                }
                const response = await fetch(url);
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

        const timer = setTimeout(() => {
            fetchProducts();
        }, 300); // Debounce search

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory]);

    return (
        <div className="container" dir={dir}>
            <header className={styles.sectionHeader} style={{ marginTop: '8rem', marginBottom: '4rem' }}>
                <h1 className="elegant-text" style={{ fontSize: '4rem', color: 'var(--dark-charcoal)' }}>الكولكشن الكامل</h1>
                <div className="line-separator" style={{ margin: '2rem auto' }}></div>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>استكشفي الأناقة والرقي في تشكيلتنا الفاخرة المخصصة لكِ</p>
            </header>

            {/* Search & Filter Controls */}
            <div style={{ maxWidth: '800px', margin: '0 auto 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                        type="text"
                        placeholder="ابحثي عن منتج..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1.2rem 3rem 1.2rem 1.2rem',
                            borderRadius: '50px',
                            border: '1px solid #eee',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            fontSize: '1.1rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                    />
                    <span style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </span>
                </div>

                {/* Category Tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
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
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '10rem', fontSize: '1.2rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>جاري التحميل...</div>
            ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '10rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                    {searchQuery ? 'لا توجد نتائج مطابقة لبحثك.' : 'لا توجد منتجات متوفرة حالياً.'}
                </div>
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
