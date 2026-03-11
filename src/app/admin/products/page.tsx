'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import styles from "../../page.module.css";
import { Trash2, Edit } from 'lucide-react';
import { Product } from '@/types';

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products?section=women');
                if (response.ok) {
                    const data: Product[] = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            try {
                const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    setProducts(prev => prev.filter(p => p.id !== id));
                    alert('تم حذف المنتج بنجاح');
                } else {
                    alert('فشل في حذف المنتج');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('حدث خطأ في الاتصال');
            }
        }
    };

    return (
        <div className="container" dir="rtl">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="elegant-text">إدارة منتجات النساء 👗</h1>
                <Link href="/admin/products/new" className="btn-primary" style={{ textDecoration: 'none' }}>
                    إضافة منتج جديد +
                </Link>
            </header>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>جاري تحميل المنتجات...</div>
            ) : (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'right', borderBottom: '2px solid var(--primary-pink)' }}>
                                <th style={{ padding: '1rem' }}>الصورة</th>
                                <th style={{ padding: '1rem' }}>الاسم</th>
                                <th style={{ padding: '1rem' }}>السعر</th>
                                <th style={{ padding: '1rem' }}>المخزن</th>
                                <th style={{ padding: '1rem' }}>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map((product) => (
                                <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                backgroundImage: product.image ? `url("${product.image}")` : 'none',
                                                backgroundColor: !product.image ? '#f0f0f0' : 'transparent',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--accent-rose)',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                border: '1px solid #eee'
                                            }}
                                        >
                                            {!product.image && product.videoUrl && (
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid var(--accent-rose)', margin: '0 auto 2px auto' }}></div>
                                                    <span>فيديو</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{product.name}</td>
                                    <td style={{ padding: '1rem' }}>{product.price.toFixed(2)} درهم</td>
                                    <td style={{ padding: '1rem' }}>{product.stock}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                            >
                                                <Trash2 size={18} /> حذف
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>لا توجد منتجات حالياً.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
