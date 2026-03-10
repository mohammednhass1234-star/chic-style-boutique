'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import styles from "../../page.module.css";
import CountdownTimer from "@/components/CountdownTimer";
import { ShoppingBag, ArrowRight, User, Phone, MapPin, X } from 'lucide-react';
import Link from "next/link";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { t, dir } = useLanguage();

    const [product, setProduct] = useState<any>(null);
    const [selectedSize, setSelectedSize] = useState<string>("M");
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [showOrderModal, setShowOrderModal] = useState(false);

    // Order form state
    const [orderData, setOrderData] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const resolvedParams = await params;
                const response = await fetch(`/api/products/${resolvedParams.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                    if (data.colors) {
                        const colorsArray = data.colors.split(',').map((c: string) => c.trim());
                        setSelectedColor(colorsArray[0]);
                    }
                }
            } catch (error) {
                console.error('Error loading product:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProduct();
    }, [params]);

    const handleOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: orderData.name,
                    customerPhone: orderData.phone,
                    customerAddress: orderData.address,
                    total: product.price,
                    items: [
                        {
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            size: selectedSize,
                            color: selectedColor
                        }
                    ]
                })
            });

            if (response.ok) {
                alert('تم استلام طلبك بنجاح! سنتصل بك قريباً.');
                setShowOrderModal(false);
                setOrderData({ name: '', phone: '', address: '' });
            } else {
                alert('حدث خطأ أثناء إرسال الطلب. حاول مجدداً.');
            }
        } catch (error) {
            console.error('Order error:', error);
            alert('حدث خطأ في الاتصال بالخادم.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="container" style={{ padding: '20vh 0', textAlign: 'center', letterSpacing: '3px', textTransform: 'uppercase' }}>{t('chargement')}</div>;
    if (!product) return <div className="container" style={{ padding: '20vh 0', textAlign: 'center' }}>{t('produit_non_trouve')}</div>;

    const colorsArray = product.colors ? product.colors.split(',').map((c: string) => c.trim()) : ["واحد"];
    const sizesArray = product.sizes ? product.sizes.split(',').map((c: string) => c.trim()) : ["واحد"];
    const displayPriceCurrency = 'درهم';

    return (
        <div style={{ backgroundColor: 'var(--soft-cream)', minHeight: '100vh', paddingBottom: '4rem' }} dir={dir}>

            <div className="container" style={{ paddingTop: '8rem', paddingBottom: '2rem' }}>
                <Link href="/" style={{ color: 'var(--dark-charcoal)', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', fontWeight: 500, letterSpacing: '1px', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                    <ArrowRight strokeWidth={1.5} size={18} style={{ transform: dir === 'rtl' ? 'rotate(180deg)' : 'none' }} /> {t('accueil')}
                </Link>
            </div>

            {/* Split Screen Layout */}
            <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '6rem', alignItems: 'flex-start' }}>

                {/* Left Side: Immersive Imagery */}
                <div style={{ flex: '1.5', minWidth: '350px' }}>
                    <div
                        style={{
                            height: '80vh',
                            minHeight: '600px',
                            width: '100%',
                            backgroundImage: `url("${product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        {product.isOfferActive && product.offerExpiry && (
                            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                                <CountdownTimer expiryDate={product.offerExpiry} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Sticky Details */}
                <div style={{ flex: '1', minWidth: '320px', position: 'sticky', top: '8rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingRight: dir === 'rtl' ? 0 : '2rem', paddingLeft: dir === 'rtl' ? '2rem' : 0 }}>

                    <div>
                        <h1 className="elegant-text" style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '1.5rem', color: 'var(--dark-charcoal)' }}>{product.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <p style={{ fontSize: '1.8rem', color: 'var(--text-dark)', fontWeight: '600', margin: 0, letterSpacing: '1px' }}>{product.price.toFixed(2)} {displayPriceCurrency}</p>
                            {product.isOfferActive && product.originalPrice && (
                                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                                    {product.originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={{ height: '1px', width: '40px', background: 'var(--accent-gold)' }}></div>

                    <p style={{ color: 'var(--text-muted)', lineHeight: '2', fontSize: '1.05rem' }}>{product.description}</p>

                    <div>
                        <h3 className="elegant-text" style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--dark-charcoal)' }}>{t('taille_label')}</h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {sizesArray.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: selectedSize === size ? '2px solid var(--dark-charcoal)' : '1px solid #e0e0e0',
                                        borderRadius: '50%',
                                        backgroundColor: selectedSize === size ? 'var(--dark-charcoal)' : 'transparent',
                                        color: selectedSize === size ? 'white' : 'var(--text-dark)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        fontFamily: 'var(--font-sans)',
                                        fontWeight: 500
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="elegant-text" style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--dark-charcoal)' }}>{t('couleur_label')}</h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {colorsArray.map((color: string) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    style={{
                                        padding: '0.8rem 2rem',
                                        border: selectedColor === color ? '2px solid var(--dark-charcoal)' : '1px solid #e0e0e0',
                                        borderRadius: '2px',
                                        backgroundColor: selectedColor === color ? 'var(--soft-cream)' : 'transparent',
                                        color: 'var(--text-dark)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        fontWeight: 500
                                    }}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button
                            onClick={() => setShowOrderModal(true)}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                padding: '1.5rem',
                                fontSize: '1rem',
                                letterSpacing: '2px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <span>{t('ajouter_au_panier')}</span>
                            <span>{product.price.toFixed(2)} {displayPriceCurrency}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Expansive Full-Width Instagram Embed if available */}
            {product.instagramUrl && (
                <div className="container" style={{ marginTop: '8rem' }}>
                    <h3 className="elegant-text" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>شاهديه على الطبيعة</h3>
                    <div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid var(--glass-border)', background: 'var(--pure-white)', padding: '1rem' }}>
                        <iframe
                            src={`${product.instagramUrl.split('?')[0]}${product.instagramUrl.endsWith('/') ? '' : '/'}embed`}
                            width="100%"
                            height="600"
                            frameBorder="0"
                            scrolling="no"
                            allowTransparency={true}
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Premium Minimalist Order Modal */}
            {showOrderModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(28,28,28,0.4)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                }}>
                    <div style={{
                        backgroundColor: 'var(--soft-cream)',
                        width: '100%',
                        maxWidth: '500px',
                        height: '100vh',
                        position: 'absolute',
                        right: dir === 'rtl' ? 0 : 'auto',
                        left: dir === 'rtl' ? 'auto' : 0,
                        padding: '4rem 3rem',
                        boxShadow: 'var(--shadow-lg)',
                        overflowY: 'auto',
                        animation: dir === 'rtl' ? 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <style>{`
                            @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
                            @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
                        `}</style>

                        <button
                            onClick={() => setShowOrderModal(false)}
                            style={{ position: 'absolute', top: '2rem', left: dir === 'rtl' ? '2rem' : 'auto', right: dir === 'rtl' ? 'auto' : '2rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dark-charcoal)' }}
                        >
                            <X strokeWidth={1.5} size={30} />
                        </button>

                        <h2 className="elegant-text" style={{ marginBottom: '1rem', fontSize: '2.5rem', color: 'var(--dark-charcoal)' }}>إتمام الطلب</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>يرجى إدخال معلومات التوصيل لإتمام عملية الشراء بنجاح.</p>

                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <div style={{ width: '80px', height: '100px', backgroundImage: `url("${product.image}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                            <div>
                                <h4 className="elegant-text" style={{ fontSize: '1.2rem', margin: 0 }}>{product.name}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0' }}>اللون: {selectedColor} | المقاس: {selectedSize}</p>
                                <p style={{ color: 'var(--dark-charcoal)', fontWeight: 600, fontSize: '1.2rem', margin: 0 }}>{product.price.toFixed(2)} درهم</p>
                            </div>
                        </div>

                        <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    required
                                    value={orderData.name}
                                    onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                                    placeholder="الاسم الكامل"
                                    style={{ width: '100%', padding: '1rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--dark-charcoal)', outline: 'none', fontSize: '1.1rem', color: 'var(--dark-charcoal)' }}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <input
                                    type="tel"
                                    required
                                    value={orderData.phone}
                                    onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                                    placeholder="رقم الهاتف"
                                    style={{ width: '100%', padding: '1rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--dark-charcoal)', outline: 'none', fontSize: '1.1rem', color: 'var(--dark-charcoal)' }}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <textarea
                                    required
                                    rows={2}
                                    value={orderData.address}
                                    onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                                    placeholder="العنوان بالتفصيل"
                                    style={{ width: '100%', padding: '1rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--dark-charcoal)', outline: 'none', fontSize: '1.1rem', color: 'var(--dark-charcoal)', resize: 'none' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary"
                                style={{ padding: '1.5rem', fontSize: '1.1rem', marginTop: '2rem', width: '100%', letterSpacing: '2px' }}
                            >
                                {isSubmitting ? 'جاري المعالجة...' : 'تأكيد الطلب'}
                            </button>
                        </form>
                    </div>
                </div>
            )
            }
        </div >
    );
}
