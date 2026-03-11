'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FetchedProduct {
    url: string;
    name: string;
    description: string;
    price: string;
    image: string;
    videoUrl: string;
    sizes: string;
    colors: string;
    section: string;
    categoryId: string;
    status: 'pending' | 'loading' | 'success' | 'error';
    error?: string;
}

export default function BulkImportAssistant() {
    const router = useRouter();
    const [urlsInput, setUrlsInput] = useState('');
    const [products, setProducts] = useState<FetchedProduct[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data);
            });
    }, []);

    const autoCategorize = (description: string) => {
        const desc = description.toLowerCase();
        let section = 'women';
        let categoryId = '';

        // Section Detection
        const kidsKeywords = ['أطفال', 'صغار', 'بيبي', 'kids', 'baby', 'junior', 'ولادي', 'بناتي'];
        if (kidsKeywords.some(k => desc.includes(k))) {
            section = 'kids';
        }

        // Category Detection
        const filtered = categories.filter(c => c.section === section);
        for (const cat of filtered) {
            const catName = cat.name.toLowerCase();
            if (desc.includes(catName) || catName.includes(desc)) {
                categoryId = cat.id.toString();
                break;
            }
        }

        return { section, categoryId };
    };

    const processUrls = async () => {
        const lines = urlsInput.split('\n').map(l => l.trim()).filter(l => l.startsWith('http'));
        if (lines.length === 0) return alert('يرجى إدخال روابط صحيحة');

        const initialProducts = lines.map(url => ({
            url,
            name: '',
            description: '',
            price: '',
            image: '',
            videoUrl: '',
            sizes: '',
            colors: '',
            section: 'women',
            categoryId: '',
            status: 'pending' as const
        }));

        setProducts(initialProducts);
        setIsProcessing(true);

        // Process in chunks or parallel
        for (let i = 0; i < initialProducts.length; i++) {
            setProducts(prev => {
                const next = [...prev];
                next[i].status = 'loading';
                return next;
            });

            try {
                const res = await fetch('/api/instagram/fetch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: lines[i] })
                });
                const data = await res.json();

                if (data.success) {
                    const { section, categoryId } = autoCategorize(data.description || '');
                    setProducts(prev => {
                        const next = [...prev];
                        next[i] = {
                            ...next[i],
                            ...data,
                            section,
                            categoryId: categoryId || next[i].categoryId,
                            status: 'success'
                        };
                        return next;
                    });
                } else {
                    setProducts(prev => {
                        const next = [...prev];
                        next[i].status = 'error';
                        next[i].error = data.error;
                        return next;
                    });
                }
            } catch (e) {
                setProducts(prev => {
                    const next = [...prev];
                    next[i].status = 'error';
                    next[i].error = 'خطأ اتصال';
                    return next;
                });
            }
        }
        setIsProcessing(false);
    };

    const handleUpdateProduct = (index: number, field: keyof FetchedProduct, value: string) => {
        setProducts(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const saveAll = async () => {
        const validProducts = products.filter(p => p.status === 'success');
        if (validProducts.length === 0) return alert('لا توجد منتجات جاهزة للحفظ');

        setIsSaving(true);
        let successCount = 0;

        for (const p of validProducts) {
            try {
                const res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...p,
                        stock: 100,
                        isOfferActive: false
                    })
                });
                if (res.ok) successCount++;
            } catch (e) {
                console.error('Error saving p:', e);
            }
        }

        setIsSaving(false);
        alert(`تم حفظ ${successCount} منتجات بنجاح!`);
        if (successCount > 0) router.push('/admin/products');
    };

    return (
        <div className="container" dir="rtl" style={{ padding: '2rem 1rem' }}>
            <style jsx>{`
                .bulk-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    gap: 1rem;
                }
                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                .price-section-row {
                    display: flex;
                    gap: 0.5rem;
                }
                @media (max-width: 768px) {
                    .bulk-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .product-grid {
                        grid-template-columns: 1fr;
                    }
                    .price-section-row {
                        flex-direction: column;
                    }
                    .price-section-row input {
                        width: 100% !important;
                    }
                }
            `}</style>

            <header style={{ marginBottom: '2rem' }}>
                <Link href="/admin/products" style={{ color: 'var(--accent-rose)', textDecoration: 'none' }}>
                    &rarr; العودة للوحة التحكم
                </Link>
                <h1 className="elegant-text" style={{ marginTop: '1rem' }}>مساعد الاستيراد السريع 🤖</h1>
                <p style={{ color: '#666' }}>قم بلصق روابط إنستقرام هنا وسيقوم المساعد بتعبئة كل شيء بدلاً منك.</p>
            </header>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <textarea 
                    placeholder="ضع كل رابط في سطر جديد..."
                    value={urlsInput}
                    onChange={(e) => setUrlsInput(e.target.value)}
                    rows={6}
                    style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '1rem', fontSize: '1rem' }}
                />
                <button 
                    onClick={processUrls} 
                    disabled={isProcessing || !urlsInput.trim()}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
                >
                    {isProcessing ? 'جاري معالجة الروابط...' : 'ابدأ المعالجة الذكية'}
                </button>
            </div>

            {products.length > 0 && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="bulk-header">
                        <h2 className="elegant-text">المنتجات المكتشفة ({products.length})</h2>
                        <button 
                            onClick={saveAll} 
                            disabled={isSaving || products.every(p => p.status !== 'success')}
                            style={{ padding: '0.8rem 2rem', background: 'var(--dark-charcoal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', maxWidth: '300px' }}
                        >
                            {isSaving ? 'جاري الحفظ...' : 'حفظ كل المنتجات الجاهزة'}
                        </button>
                    </div>

                    <div className="product-grid">
                        {products.map((p, idx) => (
                            <div key={idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee', opacity: p.status === 'error' ? 0.6 : 1 }}>
                                {p.status === 'loading' && <div style={{ textAlign: 'center', padding: '2rem' }}>جاري الجلب...</div>}
                                {p.status === 'error' && <div style={{ color: 'red', fontSize: '0.9rem' }}>خطأ: {p.error}</div>}
                                {p.status === 'success' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ height: '150px', backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px' }}></div>
                                        <input 
                                            value={p.name} 
                                            onChange={(e) => handleUpdateProduct(idx, 'name', e.target.value)}
                                            placeholder="اسم المنتج"
                                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontWeight: 'bold', width: '100%' }}
                                        />
                                        <div className="price-section-row">
                                            <input 
                                                value={p.price} 
                                                onChange={(e) => handleUpdateProduct(idx, 'price', e.target.value)}
                                                placeholder="السعر"
                                                style={{ width: '80px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                            />
                                            <select 
                                                value={p.section} 
                                                onChange={(e) => handleUpdateProduct(idx, 'section', e.target.value)}
                                                style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                            >
                                                <option value="women">نساء</option>
                                                <option value="kids">أطفال</option>
                                            </select>
                                        </div>
                                        <select 
                                            value={p.categoryId} 
                                            onChange={(e) => handleUpdateProduct(idx, 'categoryId', e.target.value)}
                                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
                                        >
                                            <option value="">اختر الصنف</option>
                                            {categories.filter(c => c.section === p.section).map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
