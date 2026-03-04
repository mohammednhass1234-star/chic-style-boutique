'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../page.module.css";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, cartCount, clearCart } = useCart();
    const { t, dir, language } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        address: ''
    });

    const totalPrice = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return total + (price * item.quantity);
    }, 0);

    const currency = language === 'ar' ? 'درهم' : 'DH';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setIsLoading(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    customerPhone: formData.phone,
                    customerCity: formData.city,
                    customerAddress: formData.address,
                    total: totalPrice,
                    items: cart
                }),
            });

            if (response.ok) {
                alert(t('succes_commande'));
                clearCart();
                router.push('/');
            } else {
                alert(t('erreur_commande'));
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(t('echec_connexion'));
        } finally {
            setIsLoading(false);
        }
    };

    if (cartCount === 0 && !isLoading) {
        return (
            <div className="container" style={{ padding: '5rem', textAlign: 'center' }} dir={dir}>
                <h1 className="elegant-text">{t('panier_vide')}</h1>
                <p style={{ marginTop: '1rem' }}>{t('commencer_achat')}</p>
                <button onClick={() => router.push('/products')} className="btn-primary" style={{ marginTop: '2rem' }}>{t('acheter_maintenant')}</button>
            </div>
        );
    }

    return (
        <div className="container" dir={dir}>
            <header className={styles.sectionHeader} style={{ marginTop: '2rem' }}>
                <h1 className="elegant-text">{t('checkout_titre')}</h1>
                <p>{t('checkout_desc')}</p>
            </header>

            <div style={{ maxWidth: '1000px', margin: '3rem auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="name">{t('nom_complet')}</label>
                        <input type="text" id="name" value={formData.name} onChange={handleChange} placeholder={t('prenom_nom')} style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="phone">{t('num_tel')}</label>
                        <input type="tel" id="phone" value={formData.phone} onChange={handleChange} placeholder="06XXXXXXXX" style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="city">{t('ville')}</label>
                        <input type="text" id="city" value={formData.city} onChange={handleChange} placeholder={t('ville')} style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="address">{t('adresse_complete')}</label>
                        <textarea id="address" value={formData.address} onChange={handleChange} placeholder={t('adresse_placeholder')} rows={3} style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} required></textarea>
                    </div>

                    <button type="submit" disabled={isLoading} className="btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', marginTop: '1rem', opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? t('en_cours_envoi') : t('confirmation_commande')}
                    </button>
                </form>

                <div style={{ padding: '1.5rem', background: 'var(--soft-cream)', borderRadius: '8px', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>{t('resume_commande')}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <span>{t('nb_produits')}</span>
                        <span>{cartCount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <span>{t('sous_total')}</span>
                        <span>{totalPrice.toFixed(2)} {currency}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <span>{t('livraison')}</span>
                        <span style={{ color: 'green' }}>{t('gratuit')}</span>
                    </div>
                    <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>{t('total')}</span>
                        <span style={{ color: 'var(--accent-rose)' }}>{totalPrice.toFixed(2)} {currency}</span>
                    </div>

                    <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {t('paiement_livraison')}
                    </div>
                </div>
            </div>
        </div>
    );
}
