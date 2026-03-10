'use client';

import React, { useEffect, useState } from 'react';
import styles from "../../page.module.css";
import Link from 'next/link';
import { Trash2, AlertCircle, CheckCircle, Truck, Clock, CreditCard } from 'lucide-react';
import { Order } from '@/types';

const STATUS_OPTIONS = [
    { value: 'قيد المراجعة', label: 'قيد المراجعة', color: '#f59e0b', bg: '#fef3c7', icon: Clock },
    { value: 'تم الدفع', label: 'تم الدفع ✅', color: '#10b981', bg: '#d1fae5', icon: CreditCard },
    { value: 'جاري التوصيل', label: 'جاري التوصيل 🚚', color: '#3b82f6', bg: '#dbeafe', icon: Truck },
    { value: 'تم التسليم', label: 'تم التسليم ✅', color: '#059669', bg: '#a7f3d0', icon: CheckCircle },
    { value: 'ملغي', label: 'ملغي ❌', color: '#ef4444', bg: '#fee2e2', icon: AlertCircle },
];

function getStatusStyle(status: string) {
    const found = STATUS_OPTIONS.find(s => s.value === status);
    return found || { color: '#888', bg: '#f3f4f6', label: status };
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
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

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setOrders(prev => prev.map(o =>
                    o.id === orderId ? { ...o, status: newStatus } : o
                ));
            } else {
                alert('فشل في تحديث الحالة');
            }
        } catch (error) {
            console.error('Status update error:', error);
            alert('خطأ في الاتصال بالخادم');
        }
    };

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

    // Stats
    const pendingCount = orders.filter(o => o.status === 'قيد المراجعة').length;
    const paidCount = orders.filter(o => o.status === 'تم الدفع').length;
    const deliveredCount = orders.filter(o => o.status === 'تم التسليم').length;
    const deliveringCount = orders.filter(o => o.status === 'جاري التوصيل').length;

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

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #f59e0b22' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{pendingCount}</div>
                    <div style={{ fontSize: '0.85rem', color: '#92400e' }}>قيد المراجعة</div>
                </div>
                <div style={{ background: '#d1fae5', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #10b98122' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{paidCount}</div>
                    <div style={{ fontSize: '0.85rem', color: '#065f46' }}>تم الدفع</div>
                </div>
                <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #3b82f622' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{deliveringCount}</div>
                    <div style={{ fontSize: '0.85rem', color: '#1e40af' }}>جاري التوصيل</div>
                </div>
                <div style={{ background: '#a7f3d0', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #05966922' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>{deliveredCount}</div>
                    <div style={{ fontSize: '0.85rem', color: '#064e3b' }}>تم التسليم</div>
                </div>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>جاري تحميل الطلبات...</div>
            ) : (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: 'var(--shadow-lg)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                        <thead>
                            <tr style={{ textAlign: 'right', borderBottom: '2px solid var(--primary-pink)', background: '#fafafa' }}>
                                <th style={{ padding: '1.2rem' }}>رقم الطلب</th>
                                <th style={{ padding: '1.2rem' }}>العميل</th>
                                <th style={{ padding: '1.2rem' }}>الهاتف</th>
                                <th style={{ padding: '1.2rem' }}>العنوان</th>
                                <th style={{ padding: '1.2rem' }}>المنتج</th>
                                <th style={{ padding: '1.2rem' }}>المجموع</th>
                                <th style={{ padding: '1.2rem' }}>الحالة</th>
                                <th style={{ padding: '1.2rem' }}>التاريخ</th>
                                <th style={{ padding: '1.2rem' }}>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? orders.map((order) => {
                                const statusStyle = getStatusStyle(order.status);
                                return (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={{ padding: '1rem', color: '#888' }}>#{order.id.toString().slice(-6)}</td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{order.customerName}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <a href={`tel:${order.customerPhone}`} style={{ color: 'var(--dark-charcoal)', textDecoration: 'none' }}>
                                                {order.customerPhone}
                                            </a>
                                        </td>
                                        <td style={{ padding: '1rem', maxWidth: '200px', lineHeight: '1.5', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                                            {order.customerAddress}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {order.items?.map((item: any, idx: number) => (
                                                <div key={idx} style={{ fontSize: '0.85rem', marginBottom: '0.3rem', background: '#fef2f2', padding: '0.4rem 0.6rem', borderRadius: '5px' }}>
                                                    {item.name || item.product?.name} <span style={{ color: 'var(--accent-rose)' }}>({item.size || '-'} / {item.color || '-'})</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--accent-rose)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            {order.total?.toFixed(2)} درهم
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                style={{
                                                    padding: '0.5rem 0.8rem',
                                                    borderRadius: '20px',
                                                    border: `2px solid ${statusStyle.color}`,
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    fontWeight: 'bold',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    outline: 'none',
                                                    minWidth: '130px'
                                                }}
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                            {new Date(order.createdAt).toLocaleDateString('ar-MA', {
                                                year: 'numeric',
                                                month: 'short',
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
                                                    fontSize: '0.8rem'
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fdecea'; e.currentTarget.style.color = '#e74c3c'; }}
                                            >
                                                <Trash2 size={14} /> حذف
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: 'center', padding: '5rem' }}>
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
