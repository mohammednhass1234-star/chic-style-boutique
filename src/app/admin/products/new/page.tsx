'use client';

import React, { useState, useEffect } from 'react';
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
        sizes: 'S,M,L,XL,XXL',
        colors: 'أبيض,أسود,أزرق',
        instagramUrl: '',
        videoUrl: '',
        originalPrice: '',
        isOfferActive: false,
        offerExpiry: '',
        section: 'women',
        categoryId: '',
        gender: 'unisex',
        subCategory: 'clothing',
        ageGroup: 'junior'
    });

    const [categories, setCategories] = useState<any[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Filter categories based on selected section
    const filteredCategories = categories.filter(c => c.section === formData.section);

    const isKidsCategory = formData.section === 'kids';

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data);
            })
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        
        setFormData(prev => {
            const newData = { ...prev, [name]: val };
            
            if (name === 'section') {
                newData.categoryId = '';
                if (val === 'kids') {
                    newData.sizes = '4A, 6A, 8A, 10A, 12A, 14A';
                } else {
                    newData.sizes = 'S, M, L, XL, XXL';
                }
            }
            
            if (name === 'categoryId' && prev.section === 'kids') {
                const selectedCat = categories.find(c => c.id.toString() === val);
                const catName = selectedCat?.name || '';
                const catSlug = selectedCat?.slug || '';
                
                if (catName.includes('صغار') || catSlug.includes('junior')) {
                    newData.ageGroup = 'junior';
                } else if (catName.includes('كبار') || catSlug.includes('teen')) {
                    newData.ageGroup = 'teen';
                }
            }
            return newData;
        });
    };

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

    const captureThumbnail = () => {
        if (!formData.videoUrl) return;
        
        setIsLoading(true);
        const video = document.createElement('video');
        video.crossOrigin = "anonymous";
        video.src = formData.videoUrl;
        video.currentTime = 1; // Capture at 1 second mark
        
        video.onloadeddata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                try {
                    const dataUrl = canvas.toDataURL('image/jpeg');
                    setFormData(prev => ({ ...prev, image: dataUrl }));
                    setImagePreview(dataUrl);
                    alert('تم التقاط الصورة بنجاح!');
                } catch (e) {
                    console.error('CORS Error capturing thumbnail:', e);
                    alert('عذراً، لا يمكن التقاط صورة من هذا الرابط بسبب قيود الحماية. يرجى رفع صورة يدوياً.');
                }
            }
            setIsLoading(false);
        };

        video.onerror = () => {
            alert('خطأ في تحميل الفيديو');
            setIsLoading(false);
        };
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
                router.push(isKidsCategory ? '/admin/kids-products' : '/admin/products');
            } else {
                alert(`حدث خطأ: ${result.error || 'فشل في حفظ المنتج'}`);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('خطأ في الاتصال بالخادم.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container" dir="rtl">
            <header style={{ marginBottom: '2rem' }}>
                <Link href="/admin/products" style={{ color: 'var(--accent-rose)', textDecoration: 'none', fontSize: '1rem' }}>
                    &rarr; العودة لإدارة المنتجات
                </Link>
                <h1 className="elegant-text" style={{ marginTop: '1rem' }}>إضافة منتج جديد</h1>
            </header>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '2px solid #e2e8f0', maxWidth: '800px' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📸</span> استيراد من Instagram
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="url" placeholder="رابط المنشور..." id="ig-url" style={{ flex: 1, padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                    <button onClick={async () => {
                        const url = (document.getElementById('ig-url') as HTMLInputElement).value;
                        if (!url) return alert('يرجى وضع الرابط');
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
                                    name: data.name || prev.name,
                                    description: data.description || prev.description, 
                                    price: data.price || prev.price, 
                                    image: data.image || prev.image, 
                                    instagramUrl: url,
                                    videoUrl: data.videoUrl || prev.videoUrl,
                                    sizes: data.sizes || prev.sizes,
                                    colors: data.colors || prev.colors
                                }));
                                if (data.image) setImagePreview(data.image);
                                alert('تم جلب البيانات بنجاح!');
                            } else alert(data.error || 'فشل الجلب');
                        } catch (e) { alert('خطأ اتصال'); } finally { setIsLoading(false); }
                    }} style={{ padding: '0.8rem 1.5rem', background: 'var(--dark-charcoal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>جلب التفاصيل</button>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 25px rgba(0,0,0,0.1)', maxWidth: '800px' }}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold' }}>القسم الرئيسي:</label>
                            <select name="section" value={formData.section} onChange={handleChange} required style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff9fa', color: 'var(--accent-rose)', fontWeight: 'bold' }}>
                                <option value="women">قسم النساء 👗</option>
                                <option value="kids">قسم الأطفال 👶</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>اسم المنتج:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>الوصف:</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>السعر الجديد:</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>السعر القديم:</label>
                            <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff0f3' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>المخزون:</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>الصنف الصغير:</label>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
                                <option value="">اختر الصنف</option>
                                {filteredCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>انتهاء العرض (اختياري):</label>
                            <input type="datetime-local" name="offerExpiry" value={formData.offerExpiry} onChange={handleChange} style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                        </div>
                    </div>

                    {isKidsCategory && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontWeight: 'bold' }}>الجنس:</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                                    <option value="unisex">للجنسين</option>
                                    <option value="boy">ولادي</option>
                                    <option value="girl">بناتي</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontWeight: 'bold' }}>نوع المنتج:</label>
                                <select name="subCategory" value={formData.subCategory} onChange={handleChange} style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                                    <option value="clothing">ملابس</option>
                                    <option value="shoes">أحذية</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#fff9fa', borderRadius: '8px', border: '1px dashed var(--accent-rose)' }}>
                        <input type="checkbox" name="isOfferActive" id="isOfferActive" checked={formData.isOfferActive} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                        <label htmlFor="isOfferActive" style={{ fontWeight: 'bold', color: 'var(--accent-rose)' }}>تفعيل كعرض خاص</label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>رابط فيديو (اختياري):</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://..." style={{ flex: 1, padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                                {formData.videoUrl && (
                                    <button 
                                        type="button" 
                                        onClick={captureThumbnail} 
                                        style={{ padding: '0 1rem', background: 'var(--accent-rose)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        📷 التقاط صورة
                                    </button>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>صورة المنتج:</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} required={!formData.image && !formData.videoUrl} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                        </div>
                    </div>
                    {imagePreview && <div style={{ marginTop: '1rem' }}><img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} /></div>}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>المقاسات:</label>
                            <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>الألوان:</label>
                            <input type="text" name="colors" value={formData.colors} onChange={handleChange} style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={isLoading} style={{ padding: '1.2rem', marginTop: '1rem', fontSize: '1.2rem' }}>
                        {isLoading ? 'جاري الحفظ...' : 'حفظ المنتج'}
                    </button>
                </div>
            </form>
        </div>
    );
}
