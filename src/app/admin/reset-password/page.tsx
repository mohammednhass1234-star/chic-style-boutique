import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export const dynamic = 'force-dynamic';

export default function ResetPassword() {
    return (
        <Suspense fallback={<div className="container" style={{ textAlign: 'center', padding: '5rem' }}>جاري التحميل...</div>}>
            <ResetPasswordClient />
        </Suspense>
    );
}
