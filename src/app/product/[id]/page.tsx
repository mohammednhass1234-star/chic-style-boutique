'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import styles from "../../page.module.css";
import CountdownTimer from "@/components/CountdownTimer";
import { ShoppingBag, ArrowRight, User, Phone, MapPin, X, CheckCircle } from 'lucide-react';
import Link from "next/link";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { t, dir } = useLanguage();

    const [product, setProduct] = useState<any>(null);
    const [selectedSize, setSelectedSize] = useState<string>("M");
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

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
            const totalPrice = product.price;
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: orderData.name,
                    customerPhone: orderData.phone,
                    customerAddress: orderData.address,
                    customerCity: "Fes", // Default
                    total: totalPrice,
                    status: 'بانتظار الدفع عبر الواتساب',
                    items: [
                        {
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            size: selectedSize,
                            color: selectedColor,
                            quantity: 1
                        }
                    ]
                })
            });

            if (response.ok) {
                const orderDataResp = await response.json();
                const newOrderId = orderDataResp.id;
                setOrderId(newOrderId);
                setIsSuccess(true);

                // Construct WhatsApp Message
                const whatsappNumber = '212667519240';
                const message = `*طلب جديد (طلب سريع)* 🛍️\n\n` +
                    `*رقم الطلب:* #ORD-${newOrderId}\n` +
                    `*الاسم:* ${orderData.name}\n` +
                    `*الهاتف:* ${orderData.phone}\n` +
                    `*العنوان:* ${orderData.address}\n\n` +
                    `*المنتج:* ${product.name}\n` +
                    `*المقاس:* ${selectedSize}\n` +
                    `*اللون:* ${selectedColor}\n\n` +
                    `*المجموع الإجمالي:* ${totalPrice.toFixed(2)} درهم\n\n` +
                    `يرجى إرسال صورة وصل الأداء هنا لتأكيد طلبي. شكراً! 🙏`;

                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

                // Attempt auto-redirect after a short delay
                setTimeout(() => {
                    window.location.href = whatsappUrl;
                }, 1000);
            } else {
                alert(t('erreur_commande'));
            }
        } catch (error) {
            console.error('Order error:', error);
            alert(t('echec_connexion'));
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

                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#fffbeb', border: '1px solid #fbd38d', borderRadius: '4px', fontSize: '0.9rem', color: '#975a16' }}>
                        {t('paiement_livraison')}
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

            {/* Instagram Video Link */}
            {product.instagramUrl && (
                <div className="container" style={{ marginTop: '6rem', marginBottom: '4rem', textAlign: 'center' }}>
                    <div style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                        borderRadius: '16px',
                        padding: '3rem 2rem',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.1)' }}></div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white" style={{ marginBottom: '1rem' }}>
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            <h3 className="elegant-text" style={{ fontSize: '1.8rem', marginBottom: '0.8rem', color: 'white' }}>شاهدي الفيديو على إنستغرام</h3>
                            <p style={{ marginBottom: '2rem', opacity: 0.9, fontSize: '1rem' }}>شوفي المنتج بالتفصيل في فيديو حقيقي 🎬</p>
                            <a
                                href={product.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    background: 'white',
                                    color: '#dc2743',
                                    padding: '1rem 3rem',
                                    borderRadius: '30px',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    textDecoration: 'none',
                                    transition: 'transform 0.3s ease',
                                    letterSpacing: '1px'
                                }}
                            >
                                ▶ افتحي الفيديو
                            </a>
                        </div>
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
                            onClick={() => {
                                setShowOrderModal(false);
                                if (isSuccess) {
                                    setIsSuccess(false);
                                    setOrderId(null);
                                    setOrderData({ name: '', phone: '', address: '' });
                                }
                            }}
                            style={{ position: 'absolute', top: '2rem', left: dir === 'rtl' ? '2rem' : 'auto', right: dir === 'rtl' ? 'auto' : '2rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dark-charcoal)', zIndex: 10 }}
                        >
                            <X strokeWidth={1.5} size={30} />
                        </button>

                        {isSuccess ? (
                            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', paddingTop: '2rem' }}>
                                <div style={{ width: '80px', height: '80px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                    <CheckCircle size={48} />
                                </div>
                                <h2 className="elegant-text" style={{ fontSize: '2.2rem', color: 'var(--dark-charcoal)' }}>تم تسجيل طلبكِ!</h2>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    رقم طلبكِ هو: <strong>#ORD-{orderId}</strong><br />
                                    يرجى الضغط على الزر أسفله لإرسال تفاصيل الطلب عبر الواتساب وتأكيد عملية الدفع والشحن.
                                </p>
                                
                                <a 
                                    href={`https://wa.me/212667519240?text=${encodeURIComponent(`*طلب جديد (طلب سريع)* 🛍️\n\n*رقم الطلب:* #ORD-${orderId}\n*الاسم:* ${orderData.name}\n*الهاتف:* ${orderData.phone}\n*العنوان:* ${orderData.address}\n\n*المنتج:* ${product.name}\n*المقاس:* ${selectedSize}\n*اللون:* ${selectedColor}\n\n*المجموع الإجمالي:* ${product.price.toFixed(2)} درهم\n\nيرجى إرسال صورة وصل الأداء هنا لتأكيد طلبي. شكراً! 🙏`)}`}
                                    className="btn-primary"
                                    style={{ width: '100%', padding: '1.5rem', fontSize: '1.1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}
                                >
                                    <Phone size={20} /> إرسال عبر الواتساب الآن
                                </a>

                                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                                    سيتم توجيهكِ تلقائياً خلال لحظات...
                                </p>
                            </div>
                        ) : (
                            <>
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

                                <div style={{ background: '#fffbeb', border: '1px solid #fbd38d', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.9rem', color: '#975a16' }}>
                                    {t('paiement_livraison')}
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
                            </>
                        )}
                    </div>
                </div>
            )
            }
        </div >
    );
}
