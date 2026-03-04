'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
    expiryDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiryDate }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(expiryDate) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setIsExpired(true);
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [expiryDate]);

    if (isExpired) return null;

    return (
        <div style={{
            background: 'var(--text-dark)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            display: 'flex',
            gap: '0.8rem',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            width: 'fit-content',
            margin: '0.5rem auto'
        }}>
            <span style={{ color: 'var(--accent-rose)' }}>ينتهي العرض خلال:</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span>{timeLeft.days} يوم</span>
                <span>{timeLeft.hours} ساعة</span>
                <span>{timeLeft.minutes} دقيقة</span>
                <span>{timeLeft.seconds} ثانية</span>
            </div>
        </div>
    );
};

export default CountdownTimer;
