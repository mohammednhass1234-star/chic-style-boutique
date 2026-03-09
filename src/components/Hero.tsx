'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <section className={styles.heroSection}>
            <div className={styles.videoBackground}>
                <div className={styles.imageOverlay} style={{ backgroundImage: 'url("/images/hero-premium.png")', transform: `translateY(${scrolled ? '15%' : '0'}) scale(${scrolled ? '1.05' : '1'})`, transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}></div>
            </div>

            <div className={styles.heroContent}>
                <div className={styles.textContent}>
                    <p className={styles.subtitle}>الكولكشن الجديد وصل</p>
                    <h1 className="elegant-text">أناقة <br /> لا تقاوم</h1>
                    <p className={styles.description}>
                        اكتشفي الرقي في كل تفصيلة. أزياء مصممة خصيصاً لتبرز جمالك وتليق بذوقك الرفيع.
                    </p>

                    <div className={styles.actionArea}>
                        <Link href="/women" className="btn-primary">
                            تسوقي الآن
                        </Link>
                        <Link href="/about" className="btn-outline" style={{ borderColor: 'var(--pure-white)', color: 'var(--pure-white)' }}>
                            استكشفي الماركة
                        </Link>
                    </div>
                </div>
            </div>

            <div className={styles.scrollIndicator}>
                <span>SCROLL</span>
                <div className={styles.line}></div>
            </div>
        </section>
    );
}
