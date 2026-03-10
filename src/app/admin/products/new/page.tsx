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
        image: '',
        sizes: 'S,M,L,XL',
        colors: 'أبيض,أسود,أزرق',
        instagramUrl: '',
        videoUrl: '',
        originalPrice: '',
        isOfferActive: false,
        offerExpiry: '',
        categoryId: '',
        gender: 'unisex',
        subCategory: 'clothing'
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data);
            })
            .catch(err => console.error('Error fetching categories:', err));
    }, []);


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
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                alert('تم حفظ المنتج بنجاح!');
                router.push('/admin/products');
            } else {
                alert(`حدث خطأ: ${result.error || 'فشل في حفظ المنتج'}`);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

            {/* Instagram Import Section */}
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '2px solid #e2e8f0', maxWidth: '800px' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📸</span> استيراد تفاصيل المنتج من Instagram
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="url"
                        placeholder="ضع رابط المنشور أو الريل هنا..."
                        id="ig-url"
                        style={{ flex: 1, padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                    />
                    <button
                        onClick={async () => {
                            const url = (document.getElementById('ig-url') as HTMLInputElement).value;
                            if (!url) return alert('يرجى وضع الرابط أولاً');
                            
                            setIsLoading(true);
                            try {
                                const res = await fetch('/api/instagram/fetch', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ url })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    setFormData(prev => ({
                                        ...prev,
                                        description: data.description,
                                        price: data.price || prev.price,
                                        image: data.image || prev.image,
                                        instagramUrl: url
                                    }));
                                    if (data.image) setImagePreview(data.image);
                                    alert('تم جلب البيانات بنجاح! يرجى مراجعة التفاصيل قبل الحفظ.');
                                } else {
                                    alert(data.error || 'فشل الجلب');
                                }
                            } catch (e) {
                                alert('خطأ في الاتصال');
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        style={{ padding: '0.8rem 1.5rem', background: 'var(--dark-charcoal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        جلب التفاصيل
                    </button>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                    * سيتم سحب الصورة والوصف والثمن (إذا وجد) تلقائياً لتوفير الوقت.
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 25px rgba(0,0,0,0.1)', maxWidth: '800px' }}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
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
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
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
                            <label>القسم:</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}
                            >
                                <option value="">بدون قسم</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold', color: '#475569' }}>الجنس (خاص بقسم الأطفال):</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}
                            >
                                <option value="unisex">للجنسين (Both)</option>
                                <option value="boy">ولادي (Boy)</option>
                                <option value="girl">بناتي (Girl)</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold', color: '#475569' }}>نوع المنتج:</label>
                            <select
                                name="subCategory"
                                value={formData.subCategory}
                                onChange={handleChange}
                                style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}
                            >
                                <option value="clothing">ملابس (Clothing)</option>
                                <option value="shoes">أحذية (Shoes)</option>
                            </select>
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
                            placeholder="https://www.instagram.com/chicjeune2021?igsh=..."
                            value={formData.instagramUrl}
                            onChange={handleChange}
                            style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                        />
                    </div>


                    <button type="submit" className="btn-primary" disabled={isLoading} style={{ padding: '1.2rem', marginTop: '1rem', fontSize: '1.2rem', opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? 'جاري الحفظ...' : 'حفظ المنتج'}
                    </button>
                </div>
            </form>
        </div>
    );
}
