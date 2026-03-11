'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import styles from "../page.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams } from 'next/navigation';

export default function ProductsClient() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const { t, dir, language } = useLanguage();

    useEffect(() => {
        setSearchQuery(searchParams.get('q') || '');
    }, [searchParams]);

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
                <h1 className="elegant-text" style={{ fontSize: '4rem', color: 'var(--dark-charcoal)' }}>{t('tous_les_produits')}</h1>
                <div className="line-separator" style={{ margin: '2rem auto' }}></div>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{t('decouvrez_elegance')}</p>
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
            ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '10rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                    {searchQuery ? 'لا توجد نتائج مطابقة لبحثك.' : t('aucun_produit')}
                </div>
            ) : (
                <div className={styles.productGrid} style={{ marginBottom: '8rem' }}>
                    {products.map((product) => (
                        <Link href={`/product/${product.id}`} key={product.id} className={styles.placeholderCard}>
                            <div className={styles.imageBox} style={{ backgroundImage: `url("${product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                            <h3 className="elegant-text">{product.name}</h3>
                            <p style={{ color: 'var(--text-dark)', fontWeight: '500', fontSize: '1.2rem', margin: '0.5rem 0' }}>{product.price.toFixed(2)} درهم</p>
                            <span className="btn-primary" style={{ marginTop: '1rem', width: '80%' }}>{t('voir_details')}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
