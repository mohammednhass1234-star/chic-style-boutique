'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../page.module.css';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, cartCount, clearCart } = useCart();
    const { t, dir, language } = useLanguage();

    const totalPrice = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return total + (price * item.quantity);
    }, 0);

    const currency = language === 'ar' ? 'درهم' : 'DH';

    if (cartCount === 0) {
        return (
            <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }} dir={dir}>
                <ShoppingBag size={80} style={{ color: 'var(--primary-pink)', marginBottom: '2rem' }} />
                <h1 className="elegant-text">{t('panier_vide')}</h1>
                <p style={{ margin: '1rem 0 2rem' }}>{t('commencer_achat')}</p>
                <Link href="/products" className="btn-primary" style={{ display: 'inline-block' }}>{t('acheter_maintenant')}</Link>
            </div>
        );
    }

    return (
        <div className="container" dir={dir}>
            <header className={styles.sectionHeader} style={{ marginTop: '3rem' }}>
                <h1 className="elegant-text">{t('panier_titre')}</h1>
                <p>{language === 'ar' ? `لديك ${cartCount} ${t('articles_dans_panier')}` : `Vous avez ${cartCount} ${t('articles_dans_panier')}`}</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    {cart.map((item, index) => (
                        <div key={`${item.id}-${item.size}-${item.color}`} style={{
                            display: 'flex',
                            gap: '1.5rem',
                            padding: '1.5rem 0',
                            borderBottom: index === cart.length - 1 ? 'none' : '1px solid #eee',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                backgroundImage: `url("${item.image}")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '8px',
                                flexShrink: 0
                            }} />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('taille_label')}: {item.size} | {t('couleur_label')}: {item.color}</p>
                                <p style={{ color: 'var(--accent-rose)', fontWeight: 'bold', marginTop: '0.5rem' }}>{item.price}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span>
                                <button
                                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                                    style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                                    title={t('supprimer_article')}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={clearCart}
                        style={{ marginTop: '1.5rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {t('vider_panier')}
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ background: 'var(--soft-cream)', padding: '2rem', borderRadius: '8px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>{t('resume_commande')}</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span>{t('sous_total')}:</span>
                            <span>{totalPrice.toFixed(2)} {currency}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span>{t('livraison')}:</span>
                            <span style={{ color: 'green' }}>{t('gratuit')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>{t('total')}:</span>
                            <span style={{ color: 'var(--accent-rose)' }}>{totalPrice.toFixed(2)} {currency}</span>
                        </div>
                        <Link href="/checkout" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '2rem', padding: '1rem' }}>
                            {t('passer_commande')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
