'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../../page.module.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.error);
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
                <h1 className="elegant-text" style={{ marginBottom: '1rem' }}>نسيت كلمة السر</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>أدخل بريدك الإلكتروني لتلقي رابط استعادة كلمة السر</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="email"
                            placeholder="البريد الإلكتروني"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            opacity: isLoading ? 0.7 : 1,
                            marginBottom: '1.5rem'
                        }}
                    >
                        {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                    </button>

                    <div>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/login')}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            العودة لتسجيل الدخول
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
