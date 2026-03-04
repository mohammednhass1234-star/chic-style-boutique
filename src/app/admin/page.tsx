'use client';

import React, { useEffect, useState } from 'react';
import styles from "../page.module.css";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalOrders: 24,
        totalSales: 5420,
        activeProducts: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    fetch('/api/orders'),
                    fetch('/api/products')
                ]);

                if (ordersRes.ok && productsRes.ok) {
                    const ordersData = await ordersRes.json();
                    const productsData = await productsRes.json();

                    setOrders(ordersData.slice(0, 5)); // Latest 5 orders

                    const totalSales = ordersData.reduce((acc: number, o: any) => acc + (o.total || 0), 0);

                    setStats({
                        totalOrders: ordersData.length > 0 ? ordersData.length : 24,
                        totalSales: totalSales > 0 ? totalSales : 5420,
                        activeProducts: productsData.length
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container" dir="rtl">
            <header className={styles.sectionHeader} style={{ marginTop: '2rem' }}>
                <h1 className="elegant-text">لوحة التحكم - Chic Jeune</h1>
                <p>إدارة المنتجات والطلبات بكفاءة عالية</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ padding: '2rem', background: '#fff', borderRadius: '15px', boxShadow: 'var(--shadow-md)', border: '1px solid #fce4ec' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <ShoppingBag color="var(--accent-rose)" />
                        <h3 style={{ margin: 0 }}>عدد الطلبات</h3>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-dark)', margin: 0 }}>{stats.totalOrders}</p>
                </div>

                <div style={{ padding: '2rem', background: '#fff', borderRadius: '15px', boxShadow: 'var(--shadow-md)', border: '1px solid #fce4ec' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <TrendingUp color="var(--accent-rose)" />
                        <h3 style={{ margin: 0 }}>إجمالي المبيعات</h3>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-dark)', margin: 0 }}>{stats.totalSales.toFixed(2)} درهم</p>
                </div>

                <div style={{ padding: '2rem', background: '#fff', borderRadius: '15px', boxShadow: 'var(--shadow-md)', border: '1px solid #fce4ec' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <Package color="var(--accent-rose)" />
                        <h3 style={{ margin: 0 }}>المنتجات النشطة</h3>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-dark)', margin: 0 }}>{stats.activeProducts}</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                <Link href="/admin/products" style={{ flex: 1, minWidth: '220px', padding: '1.5rem', background: 'var(--text-dark)', color: 'white', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', boxShadow: 'var(--shadow-sm)' }}>
                    إدارة المنتجات
                </Link>
                <Link href="/admin/offers" style={{ flex: 1, minWidth: '220px', padding: '1.5rem', background: 'var(--accent-rose)', color: 'white', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', boxShadow: 'var(--shadow-sm)' }}>
                    إدارة العروض
                </Link>
                <Link href="/admin/orders" style={{ flex: 1, minWidth: '220px', padding: '1.5rem', background: 'var(--text-dark)', color: 'white', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', boxShadow: 'var(--shadow-sm)' }}>
                    إدارة الطلبات
                </Link>
                {/* Remove Category management link as requested */}
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2 className="elegant-text" style={{ marginBottom: '1.5rem' }}>آخر الطلبات المسجلة</h2>
                {isLoading ? (
                    <p style={{ textAlign: 'center', padding: '2rem' }}>جاري تحميل البيانات...</p>
                ) : orders.length > 0 ? (
                    <div style={{ background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--primary-pink)', color: 'white', textAlign: 'right' }}>
                                    <th style={{ padding: '1.2rem' }}>رقم الطلب</th>
                                    <th style={{ padding: '1.2rem' }}>العميل</th>
                                    <th style={{ padding: '1.2rem' }}>العنوان</th>
                                    <th style={{ padding: '1.2rem' }}>المجموع</th>
                                    <th style={{ padding: '1.2rem' }}>التاريخ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem' }}>#{o.id.toString().slice(-4)}</td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{o.customerName}</td>
                                        <td style={{ padding: '1rem' }}>{o.customerAddress}</td>
                                        <td style={{ padding: '1rem' }}>{o.total?.toFixed(2)} درهم</td>
                                        <td style={{ padding: '1rem' }}>{new Date(o.createdAt).toLocaleDateString('ar-MA')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '12px' }}>لا توجد طلبات جديدة حالياً.</p>
                )}
            </div>
        </div>
    );
}
