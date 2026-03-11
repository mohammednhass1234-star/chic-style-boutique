'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../page.module.css";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle, Phone, X } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, cartCount, clearCart } = useCart();
    const { t, dir } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

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

    const currency = 'درهم';

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
                    items: cart,
                    status: 'بانتظار الدفع عبر الواتساب'
                }),
            });

            if (response.ok) {
                const orderDataResp = await response.json();
                const newOrderId = orderDataResp.id;
                setOrderId(newOrderId);
                setIsSuccess(true);
                
                // Construct WhatsApp Message
                const whatsappNumber = '212667519240';
                const message = `*طلب جديد من المتجر* 🛍️\n\n` +
                    `*رقم الطلب:* #ORD-${newOrderId}\n` +
                    `*الاسم:* ${formData.name}\n` +
                    `*الهاتف:* ${formData.phone}\n` +
                    `*المدينة:* ${formData.city}\n` +
                    `*العنوان:* ${formData.address}\n\n` +
                    `*المنتجات:*\n` +
                    cart.map(item => `- ${item.name} (${item.size}/${item.color}) x${item.quantity}`).join('\n') +
                    `\n\n*المجموع الإجمالي:* ${totalPrice.toFixed(2)} ${currency}\n\n` +
                    `يرجى إرسال صورة وصل الأداء هنا لتأكيد طلبي. شكراً! 🙏`;

                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                
                // Clear cart
                clearCart();

                // Attempt auto-redirect after a short delay
                setTimeout(() => {
                    window.location.href = whatsappUrl;
                }, 1000);
            } else {
                alert(t('erreur_commande'));
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(t('echec_connexion'));
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

    if (isSuccess) {
        return (
            <div className="container" style={{ padding: '5rem 0', textAlign: 'center', maxWidth: '600px' }} dir={dir}>
                <div style={{ width: '100px', height: '100px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', margin: '0 auto 2rem' }}>
                    <CheckCircle size={60} />
                </div>
                <h1 className="elegant-text" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>تم تسجيل طلبكِ بنجاح!</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '3rem' }}>
                    شكراً لكِ على تسوقكِ من Chic Style Boutique. رقم طلبكِ هو: <strong style={{ color: 'var(--dark-charcoal)' }}>#ORD-{orderId}</strong>
                    <br />
                    الخطوة الأخيرة هي إرسال تفاصيل الطلب عبر الواتساب لتأكيد الدفع وبدء عملية الشحن.
                </p>

                <a 
                    href={`https://wa.me/212667519240?text=${encodeURIComponent(`*طلب جديد من المتجر* 🛍️\n\n*رقم الطلب:* #ORD-${orderId}\n*الاسم:* ${formData.name}\n*الهاتف:* ${formData.phone}\n*المدينة:* ${formData.city}\n*العنوان:* ${formData.address}\n\n*المجموع الإجمالي:* ${totalPrice.toFixed(2)} درهم\n\nيرجى إرسال صورة وصل الأداء هنا لتأكيد طلبي. شكراً! 🙏`)}`}
                    className="btn-primary"
                    style={{ padding: '1.5rem 3rem', fontSize: '1.2rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                >
                    <Phone size={24} /> إرسال عبر الواتساب الآن
                </a>

                <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
                    سيتم توجيهكِ تلقائياً إلى تطبيق الواتساب خلال لحظات...
                </p>
                
                <div style={{ marginTop: '4rem' }}>
                    <Link href="/" style={{ color: 'var(--accent-rose)', fontWeight: 'bold' }}>&larr; العودة للرئيسية</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" dir={dir}>
            <header className={styles.sectionHeader} style={{ marginTop: '2rem' }}>
                <h1 className="elegant-text">{t('checkout_titre')}</h1>
                <p>يرجى ملء معلوماتك لإتمام الطلب والتواصل معنا عبر الواتساب</p>
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

                    <div style={{ background: '#fffbeb', border: '1px solid #fbd38d', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#975a16' }}>
                        <strong>تنبيه هام:</strong> يتم شحن الطلب مباشرة بعد إرسال صور وصل الدفع عبر الواتساب.
                    </div>

                    <button type="submit" disabled={isLoading} className="btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        {isLoading ? 'جاري معالجة الطلب...' : 'تأكيد الطلب والإرسال عبر الواتساب'}
                    </button>
                    
                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
                        سيتم توجيهك إلى تطبيق الواتساب لإرسال تفاصيل طلبك وإتمام عملية الدفع.
                    </p>
                </form>

                <div style={{ padding: '1.5rem', background: 'var(--soft-cream)', borderRadius: '8px', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>{t('resume_commande')}</h3>
                    
                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        {cart.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.5)', padding: '0.5rem', borderRadius: '6px' }}>
                                <div style={{ 
                                    width: '50px', 
                                    height: '60px', 
                                    backgroundImage: item.image ? `url("${item.image}")` : 'none',
                                    backgroundColor: !item.image ? '#f0f0f0' : 'transparent',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent-rose)',
                                    fontSize: '0.6rem',
                                    fontWeight: 'bold',
                                    flexShrink: 0
                                }}>
                                    {!item.image && (
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid var(--accent-rose)', margin: '0 auto 1px auto' }}></div>
                                            <span>فيديو</span>
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                    <div style={{ color: '#666', fontSize: '0.75rem' }}>{item.size} / {item.color}</div>
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.quantity}x</div>
                            </div>
                        ))}
                    </div>
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
