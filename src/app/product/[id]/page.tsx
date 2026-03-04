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

    if (isLoading) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>{t('chargement')}</div>;
    if (!product) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>{t('produit_non_trouve')}</div>;

    const colorsArray = product.colors ? product.colors.split(',').map((c: string) => c.trim()) : ["واحد"];
    const sizesArray = product.sizes ? product.sizes.split(',').map((c: string) => c.trim()) : ["واحد"];

    return (
        <div className="container" dir={dir}>
            <div style={{ marginTop: '2rem' }}>
                <Link href="/" style={{ color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    العودة للرئيسية <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginTop: '2rem', marginBottom: '4rem' }}>
                <div
                    className={styles.imageBox}
                    style={{
                        height: '550px',
                        backgroundImage: `url("${product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '15px',
                        boxShadow: 'var(--shadow-lg)',
                        position: 'relative'
                    }}
                >
                    {product.isOfferActive && product.offerExpiry && (
                        <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px' }}>
                            <CountdownTimer expiryDate={product.offerExpiry} />
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h1 className="elegant-text" style={{ fontSize: '2.5rem', borderBottom: '2px solid var(--primary-pink)', paddingBottom: '1rem' }}>{product.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '2.5rem', color: 'var(--accent-rose)', fontWeight: 'bold', margin: 0 }}>{product.price.toFixed(2)} درهم</p>
                        {product.isOfferActive && product.originalPrice && (
                            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.5rem' }}>
                                {product.originalPrice.toFixed(2)}
                            </span>
                        )}
                        {product.isOfferActive && (
                            <span style={{ background: '#ffebee', color: '#c62828', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                تخفيض {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                        )}
                    </div>

                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>{product.description}</p>

                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>المقاسات المتوفرة:</h3>
                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                            {sizesArray.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    style={{
                                        padding: '0.6rem 1.2rem',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        backgroundColor: selectedSize === size ? 'var(--primary-pink)' : 'white',
                                        color: selectedSize === size ? 'white' : 'inherit',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>الألوان المتوفرة:</h3>
                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                            {colorsArray.map((color: string) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    style={{
                                        padding: '0.6rem 1.2rem',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        backgroundColor: selectedColor === color ? 'var(--accent-rose)' : 'white',
                                        color: selectedColor === color ? 'white' : 'inherit',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <button
                            onClick={() => setShowOrderModal(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem',
                                width: '100%',
                                padding: '1.3rem',
                                backgroundColor: 'var(--text-dark)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '1.4rem',
                                fontWeight: 'bold',
                                boxShadow: 'var(--shadow-lg)',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'black'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--text-dark)'}
                        >
                            <ShoppingBag size={28} />
                            شراء الآن
                        </button>
                    </div>

                    {product.instagramUrl && (
                        <div style={{ marginTop: '2rem', borderRadius: '15px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                            <iframe
                                src={`${product.instagramUrl.split('?')[0]}${product.instagramUrl.endsWith('/') ? '' : '/'}embed`}
                                width="100%"
                                height="480"
                                frameBorder="0"
                                scrolling="no"
                                allowTransparency={true}
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>

            {/* Internal Order Modal */}
            {showOrderModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2.5rem',
                        borderRadius: '20px',
                        width: '100%',
                        maxWidth: '500px',
                        position: 'relative',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }}>
                        <button
                            onClick={() => setShowOrderModal(false)}
                            style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                        >
                            <X size={24} />
                        </button>

                        <h2 className="elegant-text" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>إتمام الطلب</h2>
                        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>يرجى إدخال معلوماتك لتوصيل طلبك</p>

                        <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} color="var(--accent-rose)" /> الاسم الكامل:</label>
                                <input
                                    type="text"
                                    required
                                    value={orderData.name}
                                    onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                                    placeholder="أدخل اسمك الكامل"
                                    style={{ padding: '0.9rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} color="var(--accent-rose)" /> رقم الهاتف:</label>
                                <input
                                    type="tel"
                                    required
                                    value={orderData.phone}
                                    onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                                    placeholder="أدخل رقم هاتفك"
                                    style={{ padding: '0.9rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} color="var(--accent-rose)" /> العنوان بالتفصيل:</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={orderData.address}
                                    onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                                    placeholder="أدخل عنوان التوصيل"
                                    style={{ padding: '0.9rem', borderRadius: '8px', border: '1px solid #ddd', resize: 'none' }}
                                />
                            </div>

                            <div style={{ background: '#fff5f7', padding: '1rem', borderRadius: '10px', marginTop: '0.5rem' }}>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>ملخص الطلب:</p>
                                <p style={{ margin: '0.5rem 0 0', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{product.name}</span>
                                    <span style={{ color: 'var(--accent-rose)' }}>{product.price.toFixed(2)} درهم</span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary"
                                style={{ padding: '1.2rem', fontSize: '1.2rem', marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب الآن'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
