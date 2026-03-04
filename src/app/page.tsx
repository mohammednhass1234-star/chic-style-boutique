'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Hero from "@/components/Hero";
import CountdownTimer from "@/components/CountdownTimer";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t, dir } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          // Show only top 4 latest for home
          setProducts(data.slice(0, 4));
        }
      } catch (error) {
        console.error('Error loading home products:', error);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className={styles.container} dir={dir}>
      <Hero />

      {/* Special Offers Section */}
      {products.filter(p => p.isOfferActive).length > 0 && (
        <section className="container" style={{ paddingTop: '0' }}>
          <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
            <h2 className="elegant-text" style={{ color: 'var(--accent-rose)' }}>عروض خاصة ✨</h2>
            <p>اغتنمي الفرصة مع تخفيضاتنا الحصرية لفترة محدودة</p>
          </div>
          <div className={styles.productGrid}>
            {products.filter(p => p.isOfferActive).map(product => {
              const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
              return (
                <Link key={product.id} href={`/product/${product.id}`} className={styles.placeholderCard} style={{ position: 'relative' }}>
                  <div className={styles.saleBadge}>تخفيض {discount > 0 && `${discount}%`}</div>
                  <div
                    className={styles.imageBox}
                    style={{
                      backgroundImage: `url("${product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80'}")`,
                      backgroundSize: 'cover'
                    }}
                  >
                    {product.offerExpiry && <div style={{ position: 'absolute', bottom: '10px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <CountdownTimer expiryDate={product.offerExpiry} />
                    </div>}
                  </div>
                  <h3>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <p style={{ margin: 0 }}>{product.price.toFixed(2)} درهم</p>
                    {product.originalPrice && (
                      <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>
                        {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="container">
        <div className={styles.sectionHeader}>
          <h2 className="elegant-text">أحدث التشكيلات</h2>
          <p>اكتشفي الأناقة والراحة في مجموعتنا الحصرية</p>
        </div>

        <div className={styles.productGrid}>
          {products.length > 0 ? (
            products.map(product => {
              const discount = product.originalPrice && product.isOfferActive ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
              return (
                <Link key={product.id} href={`/product/${product.id}`} className={styles.placeholderCard} style={{ position: 'relative' }}>
                  {product.isOfferActive && <div className={styles.saleBadge}>تخفيض {discount > 0 && `${discount}%`}</div>}
                  <div
                    className={styles.imageBox}
                    style={{
                      backgroundImage: `url("${product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80'}")`,
                      backgroundSize: 'cover'
                    }}
                  ></div>
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
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
              جاري تحميل أحدث المنتجات...
            </div>
          )}
        </div>
      </section>

      <div className={styles.ctaContent} style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--soft-cream)', marginTop: '2rem' }}>
        <h2 className="elegant-text">شيك جون - أناقة تليق بكِ</h2>
        <p>نحرص على تقديم أرقى التصاميم بأسعار تنافسية وجودة عالية.</p>
        <Link href="/women" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block', padding: '1rem 3rem' }}>
          عرض تشكيلة النساء
        </Link>
      </div>
    </div>
  );
}
