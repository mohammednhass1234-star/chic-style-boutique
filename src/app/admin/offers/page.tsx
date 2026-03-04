'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, CheckCircle, XCircle } from 'lucide-react';

export default function ManageOffersPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleOffer = async (id: number, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/products/${id}/toggle-offer`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isOfferActive: !currentStatus })
            });
            if (res.ok) {
                setProducts(products.map(p => p.id === id ? { ...p, isOfferActive: !currentStatus } : p));
            }
        } catch (error) {
            console.error('Error toggling offer:', error);
        }
    };

    const deleteProduct = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const terminateOffer = async (id: number) => {
        try {
            const res = await fetch(`/api/products/${id}/toggle-offer`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isOfferActive: false, offerExpiry: null })
            });
            if (res.ok) {
                setProducts(products.map(p => p.id === id ? { ...p, isOfferActive: false, offerExpiry: null } : p));
            }
        } catch (error) {
            console.error('Error terminating offer:', error);
        }
    };

    return (
        <div className="container" dir="rtl">
            <header style={{ marginBottom: '2rem', marginTop: '2rem' }}>
                <Link href="/admin" style={{ color: 'var(--accent-rose)', textDecoration: 'none' }}>
                    &rarr; العودة للوحة التحكم
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <Tag size={32} color="var(--accent-rose)" />
                    <h1 className="elegant-text" style={{ margin: 0 }}>إدارة العروض الخاصة - Chic Jeune</h1>
                </div>
                <p style={{ marginTop: '0.5rem', color: '#666' }}>تحكم في ظهور المنتجات في قسم "عروض خاصة" والصفحة الرئيسية.</p>
            </header>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>جاري تحميل المنتجات...</div>
            ) : (
                <div style={{ background: 'white', borderRadius: '15px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--text-dark)', color: 'white', textAlign: 'right' }}>
                                <th style={{ padding: '1.2rem' }}>المنتج</th>
                                <th style={{ padding: '1.2rem' }}>السعر الحالي</th>
                                <th style={{ padding: '1.2rem' }}>السعر القديم</th>
                                <th style={{ padding: '1.2rem' }}>انتهاء العرض</th>
                                <th style={{ padding: '1.2rem' }}>حالة العرض</th>
                                <th style={{ padding: '1.2rem' }}>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => {
                                const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                                return (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: `url(${p.image}) center/cover` }}></div>
                                            <span style={{ fontWeight: 'bold' }}>{p.name}</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{p.price.toFixed(2)} درهم</td>
                                        <td style={{ padding: '1rem', color: '#999', textDecoration: 'line-through' }}>
                                            {p.originalPrice ? `${p.originalPrice.toFixed(2)} درهم` : '-'}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {p.offerExpiry ? new Date(p.offerExpiry).toLocaleString('ar-MA') : '-'}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {p.isOfferActive ? (
                                                <span style={{ color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <CheckCircle size={18} /> فعال
                                                </span>
                                            ) : (
                                                <span style={{ color: '#c62828', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <XCircle size={18} /> غير مفعل
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => toggleOffer(p.id, p.isOfferActive)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: p.isOfferActive ? '#ffeb3b' : '#eee',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {p.isOfferActive ? 'إبطال' : 'تفعيل'}
                                            </button>
                                            {p.isOfferActive && (
                                                <button
                                                    onClick={() => terminateOffer(p.id)}
                                                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#ccc', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    إنهاء الآن
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteProduct(p.id)}
                                                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#f44336', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                حذف
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
