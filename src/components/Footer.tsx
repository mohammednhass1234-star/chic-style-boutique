'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { Instagram, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className={styles.footer} dir="rtl">
            <div className={styles.footerContainer}>

                {/* Brand Column */}
                <div className={styles.brandColumn}>
                    <h2 className="elegant-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>شيك جون</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '300px', lineHeight: '1.8' }}>
                        أيقونة الأناقة والرقي في عالم أزياء النساء والمناسبات الفاخرة.
                    </p>
                </div>

                {/* Directory Columns */}
                <div className={styles.directoryGrid}>
                    <div className={styles.navCol}>
                        <h4 className="elegant-text">استكشفي</h4>
                        <ul>
                            <li><Link href="/women">أزياء النساء</Link></li>
                            <li><Link href="/products">التشكيلة الكاملة</Link></li>
                            <li><Link href="/offers">عروض حصرية</Link></li>
                        </ul>
                    </div>

                    <div className={styles.navCol}>
                        <h4 className="elegant-text">الدار</h4>
                        <ul>
                            <li><Link href="/about">قصتنا</Link></li>
                            <li><Link href="#">سياسة الخصوصية</Link></li>
                            <li><Link href="#">الشروط والأحكام</Link></li>
                        </ul>
                    </div>

                    <div className={styles.navCol}>
                        <h4 className="elegant-text">التواصل</h4>
                        <ul>
                            <li>
                                <a href="https://wa.me/212667519240" target="_blank" rel="noopener noreferrer" className={styles.whatsappLink}>
                                    <MessageCircle size={18} />
                                    واتساب: 0667519240
                                </a>
                            </li>
                            <li>
                                <a href="https://www.google.com/maps?q=34.026568,-5.004766" target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                                    <MapPin size={18} />
                                    حي زواغة، فاس
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

            <div className={styles.footerBottom}>
                <div className={styles.legal}>
                    <p>&copy; {new Date().getFullYear()} CHIC JEUNE. جميع الحقوق محفوظة.</p>
                </div>
                <div className={styles.social}>
                    <a href="https://www.instagram.com/chicjeune2021" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.instagramLink}`}>
                        <Instagram strokeWidth={1.5} size={24} />
                        <span>chicjeune2021</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
