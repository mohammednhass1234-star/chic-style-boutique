'use client';

import React, { useState } from 'react';
import styles from "../../page.module.css";
import { ArrowRight, Save, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AdminSettings() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (password && password !== confirmPassword) {
            setMessage({ text: 'كلمات المرور غير متطابقة', type: 'error' });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email || undefined,
                    password: password || undefined
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: 'تم تحديث البيانات بنجاح', type: 'success' });
                setPassword('');
                setConfirmPassword('');
            } else {
                setMessage({ text: data.error || 'حدث خطأ أثناء التحديث', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'خطأ في الاتصال بالخادم', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container" dir="rtl">
            <header className={styles.sectionHeader} style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/admin" style={{ color: 'var(--text-dark)', display: 'flex', alignItems: 'center' }}>
                    <ArrowRight size={24} />
                </Link>
                <div>
                    <h1 className="elegant-text">إعدادات الحساب</h1>
                    <p>تغيير البريد الإلكتروني وكلمة المرور</p>
                </div>
            </header>

            <div style={{ maxWidth: '600px', margin: '3rem auto', background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }}>
                {message.text && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        marginBottom: '1.5rem',
                        backgroundColor: message.type === 'success' ? '#e8f5e9' : '#ffebee',
                        color: message.type === 'success' ? '#2e7d32' : '#c62828',
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            <Mail size={16} style={{ marginLeft: '5px' }} />
                            البريد الإلكتروني الجديد
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="اتركه فارغاً إذا كنت لا تريد تغييره"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <hr style={{ margin: '2rem 0', opacity: 0.1 }} />

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            <Lock size={16} style={{ marginLeft: '5px' }} />
                            كلمة المرور الجديدة
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="اتركها فارغة إذا كنت لا تريد تغييرها"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            تأكيد كلمة المرور الجديدة
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'var(--text-dark)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {isLoading ? 'جاري الحفظ...' : (
                            <>
                                <Save size={20} />
                                حفظ التغييرات
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
