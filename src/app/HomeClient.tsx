'use client';

import React from 'react';
import Hero from '@/components/Hero';
import Link from 'next/link';
import styles from './page.module.css';
import CountdownTimer from '@/components/CountdownTimer';
import { useLanguage } from '@/context/LanguageContext';

export default function HomeClient({ featuredOfferProducts, latestProducts }: { featuredOfferProducts: any[], latestProducts: any[] }) {
  const { dir, language, t } = useLanguage();

  return (
    <main dir={dir} style={{ overflowX: 'hidden' }}>
      <Hero />

      <div className="container">
        {/* NEW Asymmetric Editorial "Featured Collections" Section */}
        <section style={{ marginTop: '4rem', padding: '4rem 0' }}>
          <div className={styles.sectionHeader}>
            <h2 className="elegant-text">التشكيلات الحصرية</h2>
            <p>صُممت خصيصاً للمرأة العصرية التي تبحث عن التميز والرقي في كل مناسبة.</p>
          </div>

          <div className={styles.featuredCollectionsGrid}>
            {/* Large Asymmetric Image */}
            <Link href="/women" className={styles.featuredCardLarge}>
              <div className={styles.imageBox} style={{ backgroundImage: 'url("/images/collection-1.png")' }}></div>
              <div className={styles.glassContent}>
                <h3 className="elegant-text">أناقة السهرة</h3>
                <p>أزياء راقية للمناسبات الفاخرة</p>
                <span className="btn-outline" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.8rem 2rem' }}>{t('acheter_maintenant')}</span>
              </div>
            </Link>

            {/* Stacked Small Asymmetric Images */}
            <div className={styles.featuredStack}>
              <Link href="/offers" className={styles.featuredCardSmall}>
                <div className={styles.imageBox} style={{ backgroundImage: 'url("/images/collection-2.png")' }}></div>
                <div className={styles.glassContent} style={{ bottom: '1rem', left: '1rem', padding: '1.5rem', transform: 'none', opacity: 1, background: 'rgba(255,255,255,0.7)' }}>
                  <h4 className="elegant-text" style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>عروض الموسم</h4>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>اكتشفي المزيد</span>
                </div>
              </Link>

              <Link href="/products" className={styles.featuredCardSmall}>
                <div className={styles.imageBox} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80")' }}></div>
                <div className={styles.glassContent} style={{ bottom: '1rem', left: '1rem', padding: '1.5rem', transform: 'none', opacity: 1, background: 'rgba(255,255,255,0.7)' }}>
                  <h4 className="elegant-text" style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>الوصول الجديد</h4>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>استعرضي الكولكشن</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Minimalist Special Offers Section */}
        {featuredOfferProducts && featuredOfferProducts.length > 0 && (
          <section>
            <div className={styles.sectionHeader}>
              <h2 className="elegant-text">عروض لا تفوت</h2>
              <div className="line-separator" style={{ margin: '2rem auto' }}></div>
            </div>
            <div className={styles.productGrid}>
              {featuredOfferProducts.map(product => {
                const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
                return (
                  <Link key={product.id} href={`/product/${product.id}`} className={styles.placeholderCard}>
                    <div className={styles.saleBadge}>خصم حصري {discount > 0 && `${discount}%`}</div>
                    <div className={styles.imageBox} style={{ backgroundImage: `url("${product.image}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      {product.isOfferActive && product.offerExpiry && (
                        <div style={{ position: 'absolute', bottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                          <CountdownTimer expiryDate={String(product.offerExpiry)} />
                        </div>
                      )}
                    </div>
                    <h3>{product.name}</h3>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '0.5rem' }}>
                      <p style={{ color: 'var(--accent-gold)', fontSize: '1.3rem', margin: 0 }}>{product.price.toFixed(2)} درهم</p>
                      {product.originalPrice && <p style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '1rem', margin: 0 }}>{product.originalPrice.toFixed(2)}</p>}
                    </div>

                    {/* Hover Button */}
                    <span className="btn-primary">{t('acheter_maintenant')}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Minimalist Latest Products */}
        <section>
          <div className={styles.sectionHeader}>
            <h2 className="elegant-text">وصل حديثاً</h2>
            <div className="line-separator" style={{ margin: '2rem auto' }}></div>
          </div>
          <div className={styles.productGrid}>
            {latestProducts.map(product => (
              <Link key={product.id} href={`/product/${product.id}`} className={styles.placeholderCard}>
                <div className={styles.imageBox} style={{ backgroundImage: `url("${product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <h3>{product.name}</h3>
                <p style={{ color: 'var(--text-dark)', fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: 500 }}>{product.price.toFixed(2)} درهم</p>

                {/* Hover Button */}
                <span className="btn-primary">{t('voir_details')}</span>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link href="/products" className="btn-outline">
              عرض جميع الكولكشن
            </Link>
          </div>
        </section>

      </div>

      {/* Extreme Luxury CTA */}
      <section className={styles.ctaSection}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url("/images/collection-1.png")', backgroundSize: 'cover', backgroundAttachment: 'fixed', opacity: 0.15 }}></div>
        <h2 className="elegant-text">انضمي إلى عالم الأناقة</h2>
        <p>كوني أول من يكتشف أحدث صيحات الموضة والعروض الحصرية المصممة لتبرز جمالك.</p>
        <Link href="/women" className="btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1.1rem' }}>
          تسوقي التشكيلة الفاخرة
        </Link>
      </section>
    </main>
  );
}
