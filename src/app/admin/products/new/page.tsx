'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '100',
        categoryId: '1', // Forced as requested
        image: '',
        sizes: 'S,M,L,XL',
        colors: 'أبيض,أسود,أزرق',
        instagramUrl: '',
        videoUrl: '',
        originalPrice: '',
        isOfferActive: false,
        offerExpiry: ''
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, image: base64String }));
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    category: { id: 1, name: 'النساء' } // Auto-assign "النساء"
                }),
            });

            if (response.ok) {
                alert('تم حفظ المنتج بنجاح!');
                router.push('/admin/products');
            } else {
                alert('حدث خطأ أثناء حفظ المنتج');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('خطأ في الاتصال بالخادم.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    return (
        <div className="container" dir="rtl">
            <header style={{ marginBottom: '2rem' }}>
                <Link href="/admin/products" style={{ color: 'var(--accent-rose)', textDecoration: 'none', fontSize: '1rem' }}>
                    &rarr; العودة لإدارة المنتجات
                </Link>
                <h1 className="elegant-text" style={{ marginTop: '1rem' }}>إضافة منتج جديد - قسم النساء</h1>
            </header>

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 25px rgba(0,0,0,0.1)', maxWidth: '800px' }}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>اسم المنتج:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>الوصف:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>السعر الجديد (درهم):</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>السعر قبل التخفيض:</label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                placeholder="اختياري"
                                style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff0f3' }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>تاريخ انتهاء العرض (اختياري):</label>
                                <input
                                    type="datetime-local"
                                    name="offerExpiry"
                                    value={formData.offerExpiry}
                                    onChange={handleChange}
                                    style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>المخزون:</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#fff9fa', borderRadius: '8px', border: '1px dashed var(--accent-rose)' }}>
                        <input
                            type="checkbox"
                            name="isOfferActive"
                            id="isOfferActive"
                            checked={formData.isOfferActive}
                            onChange={handleChange}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <label htmlFor="isOfferActive" style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--accent-rose)' }}>
                            تفعيل هذا المنتج كعرض خاص (سيظهر في قسم العروض والصفحة الرئيسية)
                        </label>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>صورة المنتج (رفع ملف مباشر):</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required={!formData.image}
                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px' }}
                        />
                        {imagePreview && (
                            <div style={{ marginTop: '1rem' }}>
                                <img src={imagePreview} alt="Preview" style={{ maxWidth: '250px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>المقاسات:</label>
                            <input
                                type="text"
                                name="sizes"
                                value={formData.sizes}
                                onChange={handleChange}
                                style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>الألوان:</label>
                            <input
                                type="text"
                                name="colors"
                                value={formData.colors}
                                onChange={handleChange}
                                style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>رابط Instagram Reel:</label>
                        <input
                            type="url"
                            name="instagramUrl"
                            placeholder="https://www.instagram.com/reels/..."
                            value={formData.instagramUrl}
                            onChange={handleChange}
                            style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                        />
                    </div>

                    <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#666' }}>
                        * سيتم تصنيف هذا المنتج تلقائياً في قسم <strong>"النساء"</strong>.
                    </div>

                    <button type="submit" className="btn-primary" disabled={isLoading} style={{ padding: '1.2rem', marginTop: '1rem', fontSize: '1.2rem', opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? 'جاري الحفظ...' : 'حفظ المنتج'}
                    </button>
                </div>
            </form>
        </div>
    );
}
