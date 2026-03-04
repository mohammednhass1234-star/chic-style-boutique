'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "../../page.module.css";

export default function ResetPassword() {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const t = searchParams.get('token');
        if (t) setToken(t);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('كلمات السر غير متطابقة');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setTimeout(() => {
                    router.push('/admin/login');
                }, 3000);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('حدث خطأ ما، يرجى المحاولة لاحقاً');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="container" dir="rtl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div style={{ background: 'white', padding: '3rem', borderRadius: '15px', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <h1 style={{ color: '#f44336' }}>خطأ في الرمز</h1>
                    <p>رمز الاستعادة غير صالح أو مفقود.</p>
                    <button onClick={() => router.push('/admin/login')} style={{ marginTop: '1.5rem', padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', background: 'var(--text-dark)', color: 'white', cursor: 'pointer' }}>
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" dir="rtl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{ background: 'white', padding: '3rem', borderRadius: '15px', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h1 className="elegant-text" style={{ marginBottom: '1rem' }}>إعادة تعيين كلمة السر</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>أدخل كلمة السر الجديدة الخاصة بك</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="password"
                            placeholder="كلمة السر الجديدة"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                textAlign: 'center',
                                fontSize: '1.1rem'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="password"
                            placeholder="تأكيد كلمة السر"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                textAlign: 'center',
                                fontSize: '1.1rem'
                            }}
                        />
                    </div>

                    {message && <p style={{ color: '#4caf50', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{message}</p>}
                    {error && <p style={{ color: '#f44336', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--text-dark)',
                            color: 'white',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            opacity: isLoading ? 0.7 : 1
                        }}
                    >
                        {isLoading ? 'جاري التغيير...' : 'تغيير كلمة السر'}
                    </button>
                </form>
            </div>
        </div>
    );
}
