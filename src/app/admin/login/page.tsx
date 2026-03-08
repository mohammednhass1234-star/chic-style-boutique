'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../../page.module.css";

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/admin');
            } else {
                const data = await res.json();
                const detailedError = data.details || data.error || 'البيانات غير صحيحة';
                const debugStr = data.debug ? ` | Debug: ${JSON.stringify(data.debug)}` : '';
                setError(detailedError + debugStr);
            }
        } catch (err) {
            setError('حدث خطأ ما، يرجى المحاولة لاحقاً');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container" dir="rtl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{ background: 'white', padding: '3rem', borderRadius: '15px', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h1 className="elegant-text" style={{ marginBottom: '1rem' }}>دخول الإدارة</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>يرجى إدخال بياناتك للوصول إلى لوحة التحكم</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.2rem' }}>
                        <input
                            type="email"
                            placeholder="البريد الإلكتروني"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.9rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                textAlign: 'center'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="password"
                            placeholder="كلمة السر"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.9rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                textAlign: 'center'
                            }}
                        />
                    </div>

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
                            opacity: isLoading ? 0.7 : 1,
                            marginBottom: '1rem'
                        }}
                    >
                        {isLoading ? 'جاري الدخول...' : 'الدخول إلى لوحة التحكم'}
                    </button>
                    {error && <p style={{ color: '#f44336', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</p>}
                </form>
            </div>
        </div>
    );
}
