'use client';

import React, { useEffect, useState } from 'react';
import styles from "../../page.module.css";
import Link from 'next/link';
import { Trash2, AlertCircle } from 'lucide-react';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDeleteOrder = async (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟')) {
            try {
                const response = await fetch(`/api/orders/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('تم حذف الطلب بنجاح');
                    setOrders(prev => prev.filter(o => o.id !== id));
                } else {
                    alert('فشل في حذف الطلب');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('خطأ في الاتصال بالخادم');
            }
        }
    };

    return (
        <div className="container" dir="rtl">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 className="elegant-text" style={{ fontSize: '1.8rem', margin: 0 }}>Chic Jeune - إدارة الطلبات</h1>
                    <span style={{ background: 'var(--primary-pink)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                        {orders.length} طلبات
                    </span>
                </div>
                <Link href="/admin" style={{ color: 'var(--accent-rose)', textDecoration: 'none', fontWeight: 'bold' }}>
                    &rarr; العودة للوحة التحكم
                </Link>
            </header>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>جاري تحميل الطلبات...</div>
            ) : (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: 'var(--shadow-lg)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ textAlign: 'right', borderBottom: '2px solid var(--primary-pink)', background: '#fafafa' }}>
                                <th style={{ padding: '1.2rem' }}>رقم الطلب</th>
                                <th style={{ padding: '1.2rem' }}>العميل</th>
                                <th style={{ padding: '1.2rem' }}>الهاتف</th>
                                <th style={{ padding: '1.2rem' }}>العنوان بالكامل</th>
                                <th style={{ padding: '1.2rem' }}>التفاصيل (المنتج)</th>
                                <th style={{ padding: '1.2rem' }}>المجموع</th>
                                <th style={{ padding: '1.2rem' }}>التاريخ</th>
                                <th style={{ padding: '1.2rem' }}>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '1rem', color: '#888' }}>#{order.id.toString().slice(-6)}</td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{order.customerName}</td>
                                    <td style={{ padding: '1rem' }}>{order.customerPhone}</td>
                                    <td style={{ padding: '1rem', maxWidth: '250px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                        {order.customerAddress}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {order.items?.map((item: any, idx: number) => (
                                            <div key={idx} style={{ fontSize: '0.85rem', marginBottom: '0.3rem', background: '#fef2f2', padding: '0.3rem', borderRadius: '5px' }}>
                                                {item.name} <span style={{ color: 'var(--accent-rose)' }}>({item.size} / {item.color})</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--accent-rose)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {order.total?.toFixed(2)} درهم
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                        {new Date(order.createdAt).toLocaleDateString('ar-MA', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            style={{
                                                color: '#e74c3c',
                                                background: '#fdecea',
                                                border: '1px solid #e74c3c',
                                                padding: '0.5rem 0.8rem',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                fontWeight: 'bold',
                                                fontSize: '0.85rem'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.color = 'white'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fdecea'; e.currentTarget.style.color = '#e74c3c'; }}
                                        >
                                            <Trash2 size={16} /> حذف الطلب
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '5rem' }}>
                                        <div style={{ color: '#ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <AlertCircle size={48} />
                                            <span>لا توجد طلبات مسجلة حالياً</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
